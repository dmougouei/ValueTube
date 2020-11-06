// Import
const AUTH_ENV = require('@vt/vt_env').AUTH;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: AUTH_ENV.AUTH_USER,
    host: AUTH_ENV.AUTH_HOST,
    database: AUTH_ENV.AUTH_DATABASE,
    password: AUTH_ENV.AUTH_PASS,
    port: AUTH_ENV.AUTH_PORT,
});
const AuthData = require('../../data').Auth;
const randomId = require('../../../frontend/windlass/utilities').Server.RandomHelpers.randomId;

// MD5 hash given string
const getHash = (index) => {
    let hash = crypto.createHash('md5');
    hash.update(index);
    return hash.digest('base64');
};

// Encrypt information for the authToken cookie
const encryptToken = async (userId, authKey, username, email) => {
    return new Promise((resolve, reject) => {
        try {
            // Generate private key object
            const privateKey = crypto.createPrivateKey({
                key: AuthData.PRIVATE_KEY,
                type: 'pkcs8',
                format: 'pem',
                passphrase: AuthData.PASSPHRASE,
            });
            // Generate a cihper object using the users authKey and a random iv string
            const iv = getHash(randomId(13));
            const cipher = crypto.createCipheriv(
                'aes-256-ctr',
                Buffer.from(authKey, 'base64'),
                Buffer.from(iv, 'base64'),
            );
            // Encipher the user data using the cipher object and convert to a base 64 string
            const encryptedUserData = Buffer.concat([
                cipher.update(
                    JSON.stringify({
                        username: username,
                        email: email,
                    }),
                ),
                cipher.final(),
            ]).toString('base64');
            // Encrypt the authToken cookie details with the private key object, convert to 
            // a base 64 string and return the result to the promise object
            resolve(
                crypto.privateEncrypt(
                    privateKey,
                    Buffer.from(
                        JSON.stringify({
                            userId: userId,
                            iv: iv,
                            userData: encryptedUserData,
                        })
                    )
                ).toString('base64')
            );
        } catch (error) {
            reject(error);
        }
    });
}

// Decrypt information from the authToken cookie
async function decryptToken(authToken) {
    return new Promise((resolve, reject) => {
        try {
            if (authToken == undefined) {
                throw new Error("AuthToken to be decrypted is undefined.");
            }
            // Generate public key object
            const publicKey = crypto.createPublicKey({
                key: AuthData.PUBLIC_KEY,
                type: "spki",
                format: "pem",
            });
            // Decrypt the authToken cookie details with the public key object, convert to 
            // a utf-8 string and parse to an encryptedUserDetails object
            const encryptedUserDetails = JSON.parse(
                crypto.publicDecrypt(
                    publicKey,
                    Buffer.from(authToken, 'base64')
                ).toString("utf-8")
            );
            // Get the authKey from the users database that matches the userId on the 
            // encryptedUserDetails object
            pool.query(`
                SELECT authkey
                FROM users
                WHERE (userid = $1);
            `, [
                encryptedUserDetails.userId
            ], (err, res) => {
                if (err) {
                    throw err;
                } else {
                    if (res.rows[0]) {
                        // Generate a decipher object using the users authKey and the iv 
                        // string from the encryptedUserDetails object
                        const decipher = crypto.createDecipheriv(
                            'aes-256-ctr',
                            Buffer.from(res.rows[0].authkey, 'base64'),
                            Buffer.from(encryptedUserDetails.iv, 'base64')
                        );
                        // Decipher the user data using the decipher object, convert to a 
                        // utf-8 string and parse as JSON into an object
                        const userData = JSON.parse(
                            Buffer.concat([
                                decipher.update(
                                    Buffer.from(encryptedUserDetails.userData, 'base64')
                                ),
                                decipher.final()
                            ]).toString('utf-8'));
                        // Return the user data to the promise object
                        resolve({
                            userId: encryptedUserDetails.userId,
                            username: userData.username,
                            email: userData.email,
                        });
                    } else {
                        throw new Error("Invalid User ID. Unable to get user data.")
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Authorise client based on authToken cookie
const authorise = async (cookie) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (cookie == undefined) {
                throw new Error("Cookie to be encrypted is undefined.");
            }
            // Split the cookie and get the value of the authToken
            const authToken = cookie.split('=')[1];
            // Decrypt the authToken using the decryptToken function
            await decryptToken(authToken).then(async (userData) => {
                pool.query(`
                    SELECT profilepicture
                    FROM users
                    WHERE userid = $1;
                `, [ userData.userId ]).then((res) => {
                    userData = {
                        profilePicture: res.rows[0].profilePicutre,
                        ...userData,
                    };
                    resolve(userData);
                }).catch((err) => {
                    throw err;
                });
            }).catch((error) => {
                throw error;
            });
        } catch (error) {
            resolve(false);
        }
    });
};

// Verify the users sign up action, return an appropriate error if required, else return the
// authToken cookie value
const signUp = async (username, email, password, confirmPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Search the database for an existing user with the same username        
            await pool.query(`
                SELECT COUNT(*)
                FROM users
                WHERE username = $1
            `, [ username ]).then(async (res) => {
                let errors = [];
                // Check that the password and confirmPassword fields match
                if (password != confirmPassword) {
                    errors.push({
                        error: "Password fields don't match.",
                    });
                }
                // Check that the password is strong enough
                const passwordRegex = new RegExp(
                    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
                );
                if (!passwordRegex.test(password)) {
                    errors.push({
                        error: "Password is not strong enough.",
                        message: 
                            "Password must be have at least six characters\n" +
                            "and have at least one lowercase and one uppercase alphabetical character\n" +
                            "or have at least one lowercase and one numeric character\n" +
                            "or have at least one uppercase and one numeric character.",
                    });
                }
                // Check that the username is unique
                if (+res.rows[0].count != 0) {
                    errors.push({
                        error: `That username is already taken.`,
                    });
                }
                // Check that email is valid
                const emailRegex = new RegExp(
                    "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
                );
                if (!emailRegex.test(email)) {
                    errors.push({
                        error: "Invalid email address.",
                    });
                }
                if (errors.length != 0) {
                    reject(errors);
                    return;
                }
                // Get the current number of entries in the users database
                await pool.query(`SELECT COUNT(*) FROM users`).then(async (res) => {
                    // Generate a userId from the md5 hash of the current number of users
                    const userId = getHash(res.rows[0].count);
                    // Generate an authKey of length 256 and convert to a base 64 string
                    const authKey = crypto.generateKeySync(
                        'hmac',
                        { length: 256 },
                    ).export().toString('base64');
                    // Insert the user data into the users table
                    await pool.query(`
                        INSERT INTO users(
                            userid,
                            authkey,
                            username,
                            passwordHash,
                            email
                        ) VALUES(
                            $1, $2, $3, $4, $5
                        );
                    `, [
                        userId,
                        authKey,
                        username,
                        bcrypt.hashSync(password, 13),
                        email,
                    ]).then(async (res) => {
                        // Encrypt the authToken using the encryptToken function and 
                        // return the result to the promise object
                        await encryptToken(
                            userId,
                            authKey,
                            username,
                            email
                        ).then((authToken) => {
                            resolve(authToken);
                        }).catch((error) => {
                            reject(error);
                        });
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Verify the users sign in action, return an appropriate error if required, else return the
// authToken cookie value
const signIn = async (username, password) => {
    return new Promise((resolve, reject) => {
        try {
            // Get the hashed password from the users database for the given username
            pool.query(`
                SELECT passwordHash
                FROM users
                WHERE (username = $1)
            `, [ username ], (err, res) => {
                if (err) {
                    throw err;
                } else {
                    if (res.rows[0]) {
                        // Compare the entered password to the hashed password from the 
                        // database
                        if (bcrypt.compareSync(password, res.rows[0].passwordhash)) {
                            // Get the user data from the database
                            pool.query(`
                                SELECT userid, authkey, username, email
                                FROM users
                                WHERE (username = $1)
                            `, [ username ], (err, res) => {
                                if (err) {
                                    throw err;
                                } else {
                                    // Encrypt the authToken using the encryptToken function and 
                                    // return the result to the promise object
                                    encryptToken(
                                        res.rows[0].userid,
                                        res.rows[0].authkey,
                                        res.rows[0].username,
                                        res.rows[0].email
                                    ).then((authToken) => {
                                        resolve(authToken);
                                    }).catch((error) => {
                                        throw error;
                                    });
                                }
                            });
                        } else {
                            reject({
                                error: "Invalid username or password.",
                            });
                        }
                    } else {
                        reject({
                            error: "Invalid username or password.",
                        });
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Export
const Auth = {
    authorise,
    signUp,
    signIn
};

module.exports = Auth;
