const fs = require('fs');
const request = require('request');

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

                    const videoId = JSON.parse(`{${videoIdRegex.exec(decodedData)[0]}}`).videoId;
                    const channelId = JSON.parse(`{${channelIdRegex.exec(decodedData)[0]}}`).channelId;
                    const channelName = JSON.parse(`{${channelNameRegex.exec(decodedData)[0]}}`).author.split("+").join(" ");
                    const title = JSON.parse(`{${titleRegex.exec(decodedData)[0]}}`).title.split("+").join(" ");
                    const description = JSON.parse(`{${[descriptionRegex.exec(decodedData)]}}`).description.simpleText.split("+").join(" ");
                    const averageRating = JSON.parse(`{${averageRatingRegex.exec(decodedData)[0]}}`).averageRating;
                    const viewCount = JSON.parse(`{${viewCountRegex.exec(decodedData)[0]}}`).viewCount;
                    const uploadDate = JSON.parse(`{${uploadDateRegex.exec(decodedData)[0]}}`).uploadDate;
                    const keywords = JSON.parse(`{${keywordsRegex.exec(decodedData)[0]}}`).keywords.map((keyword) => keyword.split("+").join(" "));
                    const category = JSON.parse(`{${categoryRegex.exec(decodedData)[0]}}`).category.split("+").join(" ");
                    const thumbnails = JSON.parse(`{${thumbnailsRegex.exec(decodedData)[0]}}`).thumbnails;
                    const formatsData = formatsRegex.exec(decodedData);
                    const formats = formatsData == null ? null : JSON.parse(`{${formatsData[0]}}`).formats;
                    const subtitlesData = subtitlesRegex.exec(decodedData);
                    const subtitles = subtitlesData == null ? null : JSON.parse(`{${subtitlesData[0]}}`).captionTracks;

                    const data = {
                        id: videoId,
                        metadata: {
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
                            comments: [],
                        }
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
