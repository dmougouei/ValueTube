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

const query = `
    SELCT ...
`;

const getImage = async (userId) => {
    queryDatabase(query);
    return `<img src="data:jpegbase64${result}`
}

const resizeImage = async (img, width) => {
    img
}