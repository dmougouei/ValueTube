// imports
const env = require('@vt/vt_env');
const { Pool } = require('pg');
// connect to databases
const videoPool = new Pool({
    user: env.DB.DB_USER,
    host: env.DB.DB_HOST,
    database: env.DB.DB_DATABASE,
    password: env.DB.DB_PASS,
    port: env.DB.DB_PORT,
});
const userPool = new Pool({
    user: env.AUTH.AUTH_USER,
    host: env.AUTH.AUTH_HOST,
    database: env.AUTH.AUTH_DATABASE,
    password: env.AUTH.AUTH_PASS,
    port: env.AUTH.AUTH_PORT,
});
// some utility functions
function sum(array){
    let result = 0;
    array.forEach(x => result += x);
    return result;
}
function distance(v1, v2){
    result = 0;
    for(let i = 0; i < v1.length; i++){
        result += Math.pow(v1[i] - v2[i], 2)
    }
    return Math.sqrt(result);
}
// the recommendation function
// takes in the results of the SQL query on the video table and a users values
// outputs a list with each list item being [row id, distance] (sorted by lowest distance)
// idea is the first items are the videos with the closest values to the user
const recommend = async (userid) => {
    return new Promise((resolve, reject) => {
        try {
            videoPool.query(`
                SELECT videoid, values
                FROM videos
                WHERE values IS NOT NULL;
            `, (err, videoRes) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else { 
                    userPool.query(`
                        SELECT valuesprofile
                        FROM user_values
                        WHERE (userid = $1);
                    `, [userid], (err, userRes) => {
                        if (err) {
                            reject(err);
                        } else {
                            const user_values = 
                                userRes.rows[0] ?
                                    userRes.rows[0].valuesprofile
                                        .slice(1, -1)
                                        .split(',')
                                        .map(parseFloat):
                                    [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
                            // calculate vector distance
                            distances = videoRes.rows.map(row => {
                                // for some reason values is a string, great, thanks JS
                                const values = 
                                    row.values
                                        .slice(1, -1)
                                        .split(',')
                                        .map(parseFloat);
                                return [row.videoid, distance(values, user_values)];
                            });
                            // do a sort to order the video ids
                            distances.sort((pair1, pair2) => pair1[1] - pair2[1]);
                            resolve(distances);
                        }
                    })
                }
            });
        } catch (e) {
            console.error(e);
            reject();
        }
    });
}
// Exports
const Recommendation = {
    recommend
}
module.exports = Recommendation;
