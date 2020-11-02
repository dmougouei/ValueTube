const env = require('vt_env');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: env.AUTH_USER,
    host: env.AUTH_HOST,
    database: env.AUTH_DATABASE,
    password: env.AUTH_PASS,
    port: env.AUTH_PORT
});
const AuthData = require('../../data').Auth;
const randomId = require('windlass').Utilities.Server.RandomHelpers.randomId;

function getHash(index) {
    let hash = crypto.createHash('md5');
    hash.update(index);
    return hash.digest('base64');
}

function encryptToken(userDetails) {
    const privateKey = crypto.createPrivateKey({
        key: AuthData.PRIVATE_KEY,
        type: 'pkcs8',
        format: 'pem',
        passphrase: AuthData.PASSPHRASE
    });
    const iv = getHash(randomId(13));
    const cipher = crypto.createCipheriv(
        'aes-256-ctr',
        Buffer.from(userDetails.authKey, 'base64'),
        Buffer.from(iv, 'base64')
    );
    const userData = {
        username: userDetails.username,
        email: userDetails.email,
        profilePicture: userDetails.profilePicture
    };
    const encryptedUserData = Buffer.concat([cipher.update(JSON.stringify(userData)), cipher.final()]).toString('base64');
    return crypto.privateEncrypt(
        privateKey,
        Buffer.from(
            JSON.stringify({
                userId: userDetails.userId,
                iv: iv,
                userData: encryptedUserData
            })
        )
    ).toString('base64');
}

function decryptToken(authToken) {
    const publicKey = crypto.createPublicKey({
        key: AuthData.PUBLIC_KEY,
        type: "spki",
        format: "pem",
    });
    const encryptedUserDetails = JSON.parse(
        crypto.publicDecrypt(
            publicKey,
            Buffer.from(authToken, 'base64')
        ).toString("utf-8")
    );
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
                const decipher = crypto.createDecipheriv(
                    'aes-256-ctr',
                    Buffer.from(res.rows[0].authkey, 'base64'),
                    Buffer.from(encryptedUserDetails.iv, 'base64')
                );
                const userData = Buffer.concat([decipher.update(Buffer.from(encryptedUserDetails.userData, 'base64')), decipher.final()]).toString('utf8');
                return {
                    userId: encryptedUserDetails.userId,
                    username: userData.username,
                    email: userData.email,
                    profilePicture: userData.profilePicture
                }
            } else {
                throw new Error("Invalid User ID. Unable to get user data.")
            }
        }
    });
}

async function authorise(cookie) {
    return new Promise((resolve, reject) => {
        try {
            if (cookie == undefined) {
                resolve(false);
                return;
            }
            const authToken = cookie.split('=')[1];
            const userData = decryptToken(authToken);
            if (userData) {
                resolve(userData);
            } else {
                resolve(false);
            }
        } catch (e) {
            console.error(e);
            reject();
        }
    });
};

async function signUp(userDetails) {
    return new Promise((resolve, reject) => {
        try {
            if (userDetails.password != userDetails.confirmPassword) {
                reject(`Password fields don't match`);
            }
            pool.query(`SELECT COUNT(*) FROM users`, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    const userId = getHash(res.rows[0].count)
                    const authKey = crypto.generateKeySync('hmac', {length: 256}).export().toString('base64')
                    pool.query(`
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
                        userDetails.username,
                        bcrypt.hashSync(userDetails.password, 13),
                        userDetails.email
                    ], (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(
                                encryptToken({
                                    userId: userId,
                                    authKey: authKey,
                                    username: userDetails.username,
                                    email: userDetails.email,
                                    profilePicture: ""
                                })
                            );
                        }
                    });
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

// Allow mutliple idential usernames
async function signIn(username, password) {
    return new Promise((resolve, reject) => {
        try {
            pool.query(`
                SELECT passwordHash
                FROM users
                WHERE (username = $1)
            `, [ username ], (err, res) => {
                if (err) {
                    console.error('Error executing query', err.stack);
                    reject();
                } else {
                    if (res.rows[0]) {
                        if (bcrypt.compareSync(password, res.rows[0].passwordhash)) {
                            pool.query(`
                                SELECT userid, authkey, username, email, profilepicture
                                FROM users
                                WHERE (username = $1)
                            `, [ username ], (err, res) => {
                                if (err) {
                                    console.error('Error executing query', err.stack);
                                    reject();
                                } else {
                                    resolve(
                                        encryptToken({
                                            userId: res.rows[0].userid,
                                            authKey: res.rows[0].authkey,
                                            username: res.rows[0].username,
                                            email: res.rows[0].email,
                                            profilePicture: res.rows[0].profilepicture
                                        })
                                    );
                                }
                            });
                        } else {
                            reject({
                                errorMessage: "Invalid username or password."
                            });
                        }
                    } else {
                        reject({
                            errorMessage: "Invalid username or password."
                        });
                    }
                }
            });
        } catch (e) {
            console.error(e);
            reject();
        }
    });
}

const Auth = {
    authorise,
    signUp,
    signIn
};

module.exports = Auth;
