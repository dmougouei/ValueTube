// Import
const AUTH_ENV = require('@vt/vt_env').AUTH;
const Pool = require('pg').Pool;
const pool = new Pool({
    user: AUTH_ENV.AUTH_USER,
    host: AUTH_ENV.AUTH_HOST,
    database: AUTH_ENV.AUTH_DATABASE,
    password: AUTH_ENV.AUTH_PASS,
    port: AUTH_ENV.AUTH_PORT,
});
const queryDatabase = require('../database').queryDatabase;

const getProfileImage = async (userId) => {
    queryDatabase(`
        SELECT profilePicture
        FROM users
        WHERE (userid = ${userId});
    `);
}

const resizeImage = async (src, width) => {
}

const VTImage = {
    getProfileImage,
    resizeImage,
};

module.exports = VTImage;
