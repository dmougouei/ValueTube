const fs = require('fs');
const rl = require('readline').createInterface({
    input: fs.createReadStream("./youtube_urls.txt")
});
const request = require('request');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ValueTube',
    password: '',
    port: '5432'
});

module.exports = populateDatabase = async (videoID) => {
    return new Promise(async (resolve, reject) => {
        const data = await getVideoInfo(videoID).catch((e) => {
            console.error(e);
            reject();
        });

        if (data == undefined) {
            console.error("No video data found.");
            reject();
            return;
        }

        pool.connect((err, client, release) => {
            if (err) {
                console.error('Error acquiring client', err.stack);
                return;
            }

            client.query(`INSERT INTO videos(
                videoID,
                channelID,
                channelName,
                title,
                description,
                averageRating,
                viewCount,
                uploadDate,
                keywords,
                category
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
            );`, [
                data.id,
                data.channelId,
                data.channelName,
                data.title,
                data.description,
                data.averageRating,
                data.viewCount,
                data.uploadDate,
                data.keywords,
                data.category  
            ]).then(() => {
                release();
            }).catch((error) => {
                release();
                console.error(error);
                reject();
            });
        });

        pool.connect((err, client, release) => {
            if (err) {
                console.error('Error acquiring client', err.stack);
                return;
            }

            if (data.thumbnails != undefined && data.thumbnails != null) {
                if (Array.isArray(data.thumbnails)) {
                    data.thumbnails.forEach((thumbnail) => {
                        client.query(`INSERT INTO thumbnails(
                            videoId,
                            url,
                            width,
                            height
                        ) VALUES (
                            $1, $2, $3, $4
                        );`, [
                            data.id,
                            thumbnail.url,
                            thumbnail.width,
                            thumbnail.height
                        ]).catch((error) => {
                            console.error(error);
                            reject();
                        });
                    });
                }
            }

            release();
        });

        pool.connect((err, client, release) => {
            if (err) {
                console.error('Error acquiring client', err.stack);
                return;
            }
            
            if (data.formats != undefined && data.formats != null) {
                if (Array.isArray(data.formats)) {
                    data.formats.forEach((format) => {
                        client.query(`INSERT INTO formats(
                            videoId,
                            itag,
                            url,
                            mimeType,
                            bitrate,
                            width,
                            height,
                            lastModified,
                            contentLength,
                            quality,
                            fps,
                            qualityLabel,
                            projectionType,
                            averageBitrate,
                            audioQuality,
                            approxDurationMs,
                            audioSampleRate,
                            audioChannels
                        ) VALUES (
                            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
                        );`, [
                            data.id,
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
                        ]).catch((error) => {
                            console.error(error);
                            reject();
                        });
                    });
                }
            }

            release();
        });

        pool.connect((err, client, release) => {
            if (err) {
                console.error('Error acquiring client', err.stack);
                return;
            }

            if (data.subtitles != undefined && data.subtitles != null) {
                if (Array.isArray(data.subtitles)) {
                    data.subtitles.forEach((subtitle) => {
                        client.query(`INSERT INTO subtitles(
                            videoId,
                            baseUrl,
                            name,
                            vssId,
                            languageCode,
                            rtl,
                            isTranslatable
                        ) VALUES (
                            $1, $2, $3, $4, $5, $6, $7
                        );`, [
                            data.id,
                            subtitle.baseUrl,
                            subtitle.name,
                            subtitle.vssId,
                            subtitle.languageCode,
                            subtitle.rtl,
                            subtitle.isTranslatable
                        ]).catch((error) => {
                            console.error(error);
                            reject();
                        });
                    });
                }
            }
            
            release();
        });

        resolve();
    });
}

module.exports = getVideoInfo = async (videoID) => {
    return new Promise((resolve, reject) => {
        request.get(`https://youtube.com/get_video_info?video_id=${videoID}`, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                try {
                    const decodedData = decodeURIComponent(body);

                    const videoIdRegex = /\"videoId\":\"(.[^\"]*)\"/g;
                    const channelIdRegex = /\"channelId\":\"(.[^\,\"]*)\"/g;
                    const channelNameRegex = /\"author\":\"(.[^\,\"]*)\"/g;
                    const titleRegex = /\"title\":\"(.[^\"]*)\"/g;
                    const descriptionRegex = /\"description\":\{(.[^\}]*)\}/g;
                    const averageRatingRegex = /\"averageRating\":(.[^\,\}]*)/g;
                    const viewCountRegex = /\"viewCount\":(.[^\,\}]*)/g;
                    const uploadDateRegex = /\"uploadDate\":(.[^\,\}]*)/g;
                    const keywordsRegex = /\"keywords\":\[(.[^\:]*)\]/g;
                    const categoryRegex = /\"category\":(.[^\,\}]*)/g;
                    const thumbnailsRegex = /\"thumbnails\":\[(.[^\]]*)\]/g;
                    const formatsRegex = /\"formats\":\[(.[^\]]*)\]/g;
                    const subtitlesRegex = /\"captionTracks\":\[(.[^\]]*)\]/g;

                    if (videoIdRegex.exec(decodedData) == null) {
                        reject(new Error("Cannot get video information (video may be private)."));
                    }

                    const videoId = JSON.parse(`{${videoIdRegex.exec(decodedData)[0]}}`).videoId;
                    const channelId = JSON.parse(`{${channelIdRegex.exec(decodedData)[0]}}`).channelId;
                    const channelName = JSON.parse(`{${channelNameRegex.exec(decodedData)[0]}}`).author.split("+").join(" ");
                    const title = JSON.parse(`{${titleRegex.exec(decodedData)[0]}}`).title.split("+").join(" ");
                    const description = JSON.parse(`{${[descriptionRegex.exec(decodedData)]}}`).description.simpleText.split("+").join(" ");
                    const averageRating = JSON.parse(`{${averageRatingRegex.exec(decodedData)[0]}}`).averageRating;
                    const viewCount = JSON.parse(`{${viewCountRegex.exec(decodedData)[0]}}`).viewCount;
                    const uploadDate = JSON.parse(`{${uploadDateRegex.exec(decodedData)[0]}}`).uploadDate;
                    const keywordsData = keywordsRegex.exec(decodedData);
                    const keywords = keywordsData == null ? null : JSON.parse(`{${keywordsData[0]}}`).keywords.map((keyword) => keyword.split("+").join(" "));
                    const category = JSON.parse(`{${categoryRegex.exec(decodedData)[0]}}`).category.split("+").join(" ");
                    const thumbnails = JSON.parse(`{${thumbnailsRegex.exec(decodedData)[0]}}`).thumbnails;
                    const formatsData = formatsRegex.exec(decodedData);
                    const formats = formatsData == null ? null : JSON.parse(`{${formatsData[0]}}`).formats;
                    const subtitlesData = subtitlesRegex.exec(decodedData);
                    const subtitles = subtitlesData == null ? null : JSON.parse(`{${subtitlesData[0]}}`).captionTracks;

                    const data = {
                        id: videoId,
                        channelId: channelId,
                        channelName: channelName,
                        title: title,
                        description: description,
                        averageRating: averageRating,
                        viewCount: viewCount,
                        uploadDate: uploadDate,
                        keywords: keywords,
                        category: category,
                        thumbnails: thumbnails,
                        formats: formats,
                        subtitles: subtitles,
                    };

                    resolve(data);
                } catch (e) {
                    reject(e);
                }
            } else {
                reject(err);
            }
        });
    });
};

async function runDataInsert () {
    let videoArray = [];
    let count = 0;

    for await (const line of rl) {
        videoArray.push(line.substring(line.length - 11));
    }

    for await (const videoId of videoArray) {
        await populateDatabase(videoId)
            .then(() => {
                count++;
            })
            .catch((err) => {
                console.error(err)
            });
    }

    console.log(`Successfully added ${count} of ${videoArray.length} videos to database.`)
}

runDataInsert();
