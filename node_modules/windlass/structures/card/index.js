module.exports = function Card(metadata) {
  let duration = "";
  const approxDurationSeconds = +metadata.duration / 1000;
  const hours = Math.floor(approxDurationSeconds / 3600);
  let minutes = Math.floor((approxDurationSeconds - hours * 3600) / 60);
  let seconds = Math.floor(approxDurationSeconds - hours * 3600 - minutes * 60);

  minutes = minutes < 10 && hours != 0 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  duration =
    hours != 0
      ? hours + ":" + minutes + ":" + seconds
      : minutes + ":" + seconds;

  let views = "";
  if (metadata.viewcount < 1000) {
    views = metadata.viewcount;
  } else if (metadata.viewcount < 1000000) {
    views = (metadata.viewcount / 1000).toFixed(1) + "K";
  } else if (metadata.viewcount < 1000000000) {
    views = (metadata.viewcount / 1000000).toFixed(1) + "M";
  } else if (metadata.viewcount < 1000000000000) {
    views = (metadata.viewcount / 1000000000).toFixed(1) + "B";
  } else {
    views = (metadata.viewcount / 1000000000000).toFixed(1) + "T";
  }

  let timeSinceUpload = "";
  const date = new Date();
  const uploadDate = new Date(metadata.uploaddate);
  const timeSince = [
    date.getUTCFullYear() - uploadDate.getUTCFullYear(),
    date.getUTCMonth() - uploadDate.getUTCMonth(),
    date.getUTCDay() - uploadDate.getUTCDay(),
  ];

  if (timeSince[0] > 1) {
    timeSinceUpload = timeSince[0] + " years ago";
  } else if (timeSince[0] > 0) {
    timeSinceUpload = "1 year ago";
  } else if (timeSince[1] > 1) {
    timeSinceUpload = timeSince[1] + " months ago";
  } else if (timeSince[1] > 0) {
    timeSinceUpload = "1 month ago";
  } else if (timeSince[2] > 1) {
    timeSinceUpload = timeSince[2] + " days ago";
  } else if (timeSince[2] > 0) {
    timeSinceUpload = "1 day ago";
  } else {
    timeSinceUpload = "less than 1 day ago";
  }

  return `
      <div class="card" onclick="window.location.href = './watch?v=${metadata.videoid}'">
          <div class="preview">
              <img alt="${metadata.title} thumbnail" src="${metadata.thumbnail}" loading="lazy" decoding="async" />
              <div class="duration">${duration}</div>
          </div>
          <div class="details">
              <div class="title">${metadata.title}</div>
              <div class="content-creator youtube-link" data-url="https://www.youtube.com/channel/${metadata.channelid}/">${metadata.channelname}</div>
              <div class="views">${views} views</div>
              <div class="published">${timeSinceUpload}</div>
          </div>
      </div>
  `;
};
