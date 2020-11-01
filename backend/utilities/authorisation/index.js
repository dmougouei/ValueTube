const env = require('vt_env');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: env.AUTH_USER,
    host: env.AUTH_HOST,
    database: env.AUTH_DATABASE,
    password: env.AUTH_PASS,
    port: env.AUTH_PORT
});

async function authorisation(cookie) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof cookie === "string" || cookie instanceof String) {    
                if (cookie == undefined) {
                    resolve(false);
                }
                const query = authQuery(cookie);
                pool.connect((err, client, release) => {
                    if (err) {
                        console.error('Error acquiring client', err.stack);
                        reject();
                    }
                    client.query(query, (err, res) => {
                        release();
                        if (err) {
                            console.error('Error executing query', err.stack);
                            reject();
                        } else {
                            resolve(res.rows);
                        }
                    })
                });
            } else {
                throw new TypeError(`${cookie} on authorisation is not a valid String type.`);
            }
        } catch (e) {
            console.error(e);
            reject();
        }
    });
};

function authQuery(cookie) {
    return `
    `;
}

module.exports = authorisation;
