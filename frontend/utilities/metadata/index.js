module.exports = parseMetadata = (metadata) => {
    return {
        videoId: metadata[0].videoid,
        channelId: metadata[0].channelid,
        channelName: metadata[0].channelname,
        title: metadata[0].title,
        description: metadata[0].description,
        averageRating: metadata[0].averagerating,
        views: parseViews(metadata[0].viewcount),
        timeSinceUpload: parseUploadDate(metadata[0].uploaddate),
        keywords: metadata[0].keywords,
        category: metadata[0].category,
        duration: parseDuration(metadata[0].duration),
        thumbnail: metadata[0].thumbnail,
        videoUrl: metadata[0].videourl
    };
}

const parseDuration = (duration) => {
    let output = "";
    const approxDurationSeconds = +duration / 1000;
    const hours = Math.floor(approxDurationSeconds / 3600);
    let minutes = Math.floor((approxDurationSeconds - hours * 3600) / 60);
    let seconds = Math.floor(approxDurationSeconds - hours * 3600 - minutes * 60);
    
    minutes = minutes < 10 && hours != 0 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    output =
        hours != 0
            ? hours + ":" + minutes + ":" + seconds
            : minutes + ":" + seconds;
    return output;
}

const parseViews = (views) => {
    let output = "";
    if (views < 1000) {
        output = views;
    } else if (views < 1000000) {
        output = (views / 1000).toFixed(1) + "K";
    } else if (views < 1000000000) {
        output = (views / 1000000).toFixed(1) + "M";
    } else if (views < 1000000000000) {
        output = (views / 1000000000).toFixed(1) + "B";
    } else {
        output =
            (views / 1000000000000).toFixed(1) + "T";
    }
    return output;
}

const parseUploadDate = (uploadDate) => {
    let output = "";
    const date = new Date();
    const parsedUploadDate = new Date(uploadDate);
    const timeSince = [
        date.getUTCFullYear() - parsedUploadDate.getUTCFullYear(),
        date.getUTCMonth() - parsedUploadDate.getUTCMonth(),
        date.getUTCDay() - parsedUploadDate.getUTCDay(),
    ];
    if (timeSince[0] > 1) {
        output = timeSince[0] + " years ago";
    } else if (timeSince[0] > 0) {
        output = "1 year ago";
    } else if (timeSince[1] > 1) {
        output = timeSince[1] + " months ago";
    } else if (timeSince[1] > 0) {
        output = "1 month ago";
    } else if (timeSince[2] > 1) {
        output = timeSince[2] + " days ago";
    } else if (timeSince[2] > 0) {
        output = "1 day ago";
    } else {
        output = "less than 1 day ago";
    }
    return output;
}