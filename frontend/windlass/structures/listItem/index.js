// Imports
const { Container } = require("../../components").Layout;
const {
  DECODING_VALUES,
  LOADING_VALUES,
  Image
} = require("../../components").Media;
const { Link } = require('../../components').Typography;
const {
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

class LIST_ITEM_PROPERTIES {
  constructor(props) {
    // metadata
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "metadata",
      TypeHelpers.PRIMATIVES.OBJECT,
      undefined,
      props.metadata
    );

    // small
    TypeHelpers.typeCheckPrimative(
      this,
      props,
      "small",
      TypeHelpers.PRIMATIVES.BOOLEAN,
      false,
      props.small
    );
  }
}

// List Item
function ListItem(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof LIST_ITEM_PROPERTIES
        ? (this.props = props)
        : (this.props = new LIST_ITEM_PROPERTIES(props));
      return Container({
        class: `list-item${this.props.small ? " sm" : ""}`,
        content: [
          Container({
            class: "preview",
            onclick: `window.location.href = './watch?v=${this.props.metadata.videoid}'`,
            content: [
              Image({
                alt: `${this.props.metadata.title} thumbnail`,
                src: parseThumbnails(this.props.metadata.thumbnails),
                loading: LOADING_VALUES.LAZY,
                decoding: DECODING_VALUES.ASYNC,
              }),
              Container({
                class: "duration",
                content: parseDuration(this.props.metadata.duration),
              }),
            ].join("\n"),
          }),
          Container({
            class: "details",
            content: [
              Container({
                class: "title",
                onclick: `window.location.href = './watch?v=${this.props.metadata.videoid}'`,
                content: (this.props.small && this.props.metadata.title.length > 58)
                  ? `${this.props.metadata.title.substring(0, 58)
                    .substring(0, this.props.metadata.title.lastIndexOf(" "))} ...`
                  : this.props.metadata.title,
              }),
              Container({
                class: "content-creator youtube-link",
                content: Link({
                  link: `https://www.youtube.com/channel/${this.props.metadata.channelid}/`,
                  content: this.props.metadata.channelname,
                }),
              }),
              Container({
                class: "views",
                content: parseViewCount(this.props.metadata.viewcount),
              }),
              Container({
                class: "published",
                content: parseUploadDate(this.props.metadata.uploaddate),
              }),
            ].join("\n"),
          })
        ].join("\n"),
      });
    } else {
      throw new TypeError(`${metadata} on ListItem is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  LIST_ITEM_PROPERTIES,
  ListItem,
};
