// Imports
const { Container } = require("../../components").Layout;
const {
  DECODING_VALUES,
  LOADING_VALUES,
  Image
} = require("../../components").Media;
const { Link } = require('../../components').Typography;
const {
  SecurityHelpers,
  TypeHelpers,
} = require("../../utilities").Server;

function parseThumbnails(thumbnails) {
  return thumbnails.slice(2, -2).split(`","`).map((item) => {
    const thumbnail = item.slice(1, -1).split(",");
    return {
      url: thumbnail[0],
      width: +thumbnail[1],
    }
  }).sort((a, b) => {
    return b.width - a.width;
  }).reduce((o, n) => {
    return ((n.width < o.width) && (n.width >= 300)) ? n : o
  }).url;
}

function parseDuration(duration) {
  const approxDurationSeconds = duration / 1000;
  const hours = Math.floor(approxDurationSeconds / 3600);
  let minutes = Math.floor((approxDurationSeconds - hours * 3600) / 60);
  let seconds = Math.floor(approxDurationSeconds - hours * 3600 - minutes * 60);

  minutes = minutes < 10 && hours != 0 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return (hours != 0)
    ? `${hours}:${minutes}:${seconds}`
    : `${minutes}:${seconds}`;
}

function parseViewCount(viewcount) {
  if (viewcount < 1000) {
    return `${viewcount} views`;
  } else if (viewcount < 1000000) {
    return `${(viewcount / 1000).toFixed(1)}K views`;
  } else if (viewcount < 1000000000) {
    return `${(viewcount / 1000000).toFixed(1)}M views`;
  } else if (viewcount < 1000000000000) {
    return `${(viewcount / 1000000000).toFixed(1)}B views`;
  } else {
    return `${(viewcount / 1000000000000).toFixed(1)}T views`;
  }
}

function parseUploadDate(uploaddate) {
  const date = new Date();
  const uploadDate = new Date(uploaddate);
  const timeSince = [
    date.getUTCFullYear() - uploadDate.getUTCFullYear(),
    date.getUTCMonth() - uploadDate.getUTCMonth(),
    date.getUTCDay() - uploadDate.getUTCDay(),
  ];

  if (timeSince[0] > 1) {
    return `${timeSince[0]} years ago`;
  } else if (timeSince[0] > 0) {
    return "1 year ago";
  } else if (timeSince[1] > 1) {
    return `${timeSince[1]} months ago`;
  } else if (timeSince[1] > 0) {
    return "1 month ago";
  } else if (timeSince[2] > 1) {
    return `${timeSince[2]} days ago`;
  } else if (timeSince[2] > 0) {
    return "1 day ago";
  } else {
    return "less than 1 day ago";
  }
}

// Card Properties
class CARD_PROPERTIES {
  constructor(metadata) {
    // videoid
    TypeHelpers.typeCheckPrimative(
      this,
      metadata,
      "videoid",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      SecurityHelpers.sanitiseHTML(metadata.videoid)
    );

    // title
    TypeHelpers.typeCheckPrimative(
      this,
      metadata,
      "title",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      SecurityHelpers.sanitiseHTML(metadata.title)
    );

    // thumbnails
    TypeHelpers.typeCheckPrimative(
      this,
      metadata,
      "thumbnails",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      parseThumbnails(metadata.thumbnails)
    );

    // duration
    TypeHelpers.typeCheckPrimative(
      this,
      metadata,
      "duration",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      SecurityHelpers.sanitiseHTML(parseDuration(+metadata.duration))
    );

    // channelid
    TypeHelpers.typeCheckPrimative(
      this,
      metadata,
      "channelid",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      SecurityHelpers.sanitiseHTML(metadata.channelid)
    );

    // channelname
    TypeHelpers.typeCheckPrimative(
      this,
      metadata,
      "channelname",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      SecurityHelpers.sanitiseHTML(metadata.channelname)
    );

    // viewcount
    TypeHelpers.typeCheckPrimative(
      this,
      metadata,
      "viewcount",
      TypeHelpers.PRIMATIVES.STRING,
      "",
      SecurityHelpers.sanitiseHTML(parseViewCount(metadata.viewcount))
    );

    // uploaddate
    TypeHelpers.typeCheckPrimative(
      this,
      metadata,
      "uploaddate",
      TypeHelpers.PRIMATIVES.DATE,
      "",
      SecurityHelpers.sanitiseHTML(parseUploadDate(metadata.uploaddate))
    );
  }
}

// Image
function Card(metadata) {
  try {
    metadata === undefined ? (metadata = {}) : null;
    if (typeof metadata === "object" || metadata instanceof Object) {
      metadata instanceof CARD_PROPERTIES
        ? (this.metadata = metadata)
        : (this.metadata = new CARD_PROPERTIES(metadata));
      return Container({
        class: "card",
        content: [
          Container({
            class: "preview",
            onclick: `window.location.href = './watch?v=${this.metadata.videoid}'`,
            content: [
              Image({
                alt: `${this.metadata.title} thumbnail`,
                src: this.metadata.thumbnails,
                loading: LOADING_VALUES.LAZY,
                decoding: DECODING_VALUES.ASYNC,
              }),
              Container({
                class: "duration",
                content: this.metadata.duration,
              }),
            ].join("\n"),
          }),
          Container({
            class: "details",
            content: [
              Container({
                class: "title",
                onclick: `window.location.href = './watch?v=${this.metadata.videoid}'`,
                content: this.metadata.title,
              }),
              Container({
                class: "content-creator youtube-link",
                content: Link({
                  link: `https://www.youtube.com/channel/${this.metadata.channelid}/`,
                  content: this.metadata.channelname,
                }),
              }),
              Container({
                class: "views",
                content: this.metadata.viewcount,
              }),
              Container({
                class: "published",
                content: this.metadata.uploaddate,
              }),
            ].join("\n"),
          })
        ].join("\n"),
      });
    } else {
      throw new TypeError(`${metadata} on Card is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  CARD_PROPERTIES,
  Card,
};
