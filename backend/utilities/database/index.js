const env = require('@vt/vt_env');
const YouTube = require('../youtube');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: env.DB.DB_USER,
    host: env.DB.DB_HOST,
    database: env.DB.DB_DATABASE,
    password: env.DB.DB_PASS,
    port: env.DB.DB_PORT
});

const queryDatabase = async (query) => {
    return new Promise((resolve, reject) => {
        try {
            if (typeof query === "string" || query instanceof String) {              
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
                throw new TypeError(`${query} on queryDatabase is not a valid String type.`);
            }
        } catch (e) {
            console.error(e);
            reject();
        }
    });
};

const updateDatabase = async (videoId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (YouTube.validId(videoId)) {
                const data = await YouTube.getVideoMetadata(videoId).catch((e) => {
                    throw new Error(e.stack);
                });

                if (data == undefined) {
                    throw new Error("No video data found.")
                }

                pool.connect((err, client, release) => {
                    if (err) {
                        throw new Error("Error acquiring client.", err.stack)
                    }
                    client.query(`
                        UPDATE videos
                        SET channelid = $1,
                            channelname = $2,
                            title = $3,
                            description = $4,
                            averagerating = $5,
                            viewcount = $6,
                            uploaddate = $7,
                            keywords = $8,
                            category = $9
                        WHERE videoid = '${videoId}';
                    `, [
                        data.channelId,
                        data.channelName,
                        data.title,
                        data.description,
                        data.averageRating,
                        data.viewCount,
                        data.uploadDate,
                        data.keywords,
                        data.category  
                    ]).catch((e) => {
                        throw new Error(e.stack);
                    });
                    release();
                });

                pool.connect((err, client, release) => {
                    if (err) {
                        throw new Error("Error acquiring client.", err.stack)
                    }
                    if (data.thumbnails != undefined && data.thumbnails != null) {
                        if (Array.isArray(data.thumbnails)) {
                            data.thumbnails.forEach((thumbnail) => {
                                client.query(`
                                    UPDATE thumbnails
                                    SET url = $1,
                                        width = $2,
                                        height = $3
                                    WHERE videoid = '${videoId}';
                                `, [
                                    thumbnail.url,
                                    thumbnail.width,
                                    thumbnail.height
                                ]).catch((e) => {
                                    throw new Error(e.stack);
                                });
                            });
                        }
                    }
                    release();
                });
        
                pool.connect((err, client, release) => {
                    if (err) {
                        throw new Error("Error acquiring client.", err.stack)
                    }
                    if (data.formats != undefined && data.formats != null) {
                        if (Array.isArray(data.formats)) {
                            data.formats.forEach((format) => {
                                client.query(`
                                    UPDATE formats
                                    SET itag = $1,
                                        url = $2,
                                        mimeType = $3,
                                        bitrate = $4,
                                        width = $5,
                                        height = $6,
                                        lastModified = $7,
                                        contentLength = $8,
                                        quality = $9,
                                        fps = $10,
                                        qualityLabel = $11,
                                        projectionType = $12,
                                        averageBitrate = $13,
                                        audioQuality = $14,
                                        approxDurationMs = $15,
                                        audioSampleRate = $16,
                                        audioChannels = $17
                                    WHERE videoid = '${videoId}';
                                `, [
                                    format.itag,
                                    format.url,
                                    format.mimeType,
                                    format.bitrate,
                                    format.width,
                                    format.height,
                                    format.lastModified,
                                    format.contentLength,
                                    format.quality,
                                    format.fps,
                                    format.qualityLabel,
                                    format.projectionType,
                                    format.averageBitrate,
                                    format.audioQuality,
                                    format.approxDurationMs,
                                    format.audioSampleRate,
                                    format.audioChannels,
                                ]).catch((e) => {
                                    throw new Error(e.stack);
                                });
                            });
                        }
                    }
                    release();
                });
        
                pool.connect((err, client, release) => {
                    if (err) {
                        throw new Error("Error acquiring client.", err.stack)
                    }
                    if (data.subtitles != undefined && data.subtitles != null) {
                        if (Array.isArray(data.subtitles)) {
                            data.subtitles.forEach((subtitle) => {
                                client.query(`
                                    UPDATE subtitles
                                    SET baseUrl = $1,
                                        name = $2,
                                        vssId = $3,
                                        languageCode = $4,
                                        rtl = $5,
                                        isTranslatable = $6
                                    WHERE videoid = '${videoId}';
                                `, [
                                    subtitle.baseUrl,
                                    subtitle.name,
                                    subtitle.vssId,
                                    subtitle.languageCode,
                                    subtitle.rtl,
                                    subtitle.isTranslatable
                                ]).catch((e) => {
                                    throw new Error(e.stack);
                                });
                            });
                        }
                    }
                    release();
                });

                resolve();
            } else {
                throw new Error(`${videoId} is an invalid video id.`)
            }
        } catch (e) {
            reject(e.stack);
        }
    });
}

module.exports = {
    queryDatabase,
    updateDatabase,
}
