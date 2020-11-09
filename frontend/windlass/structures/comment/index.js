module.exports = function Comment(props) {
  this.props = props;
  return `<div class="comment">
      <div class="user">
        ${this.props.user}
      </div>
      <div class="comment-body">
        ${this.props.text}
      </div>
    </div>`;
};

// Imports
const { Container, Seperator } = require("../../components").Layout;
const {
  DECODING_VALUES,
  LOADING_VALUES,
  Image
} = require("../../components").Media;
const { Text, Link } = require('../../components').Typography;
const {
  TypeHelpers,
} = require("../../utilities").Server;

function parseLikeCount(viewcount) {
  if (viewcount < 1000) {
    return `${viewcount} likes`;
  } else if (viewcount < 1000000) {
    return `${(viewcount / 1000).toFixed(1)}K likes`;
  } else if (viewcount < 1000000000) {
    return `${(viewcount / 1000000).toFixed(1)}M likes`;
  } else if (viewcount < 1000000000000) {
    return `${(viewcount / 1000000000).toFixed(1)}B likes`;
  } else {
    return `${(viewcount / 1000000000000).toFixed(1)}T likes`;
  }
}

function parsePostDate(uploaddate) {
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

class COMMENT_PROPERTIES {
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
  }
}

// Comment
function Comment(props) {
  try {
    props === undefined ? (props = {}) : null;
    if (typeof props === "object" || props instanceof Object) {
      props instanceof COMMENT_PROPERTIES
        ? (this.props = props)
        : (this.props = new COMMENT_PROPERTIES(props));
      return Container({
        class: "comment",
        content: [
          Container({
            content: [
              Container({
                class: "profile_icon",
                content: Image({
                  alt: `${this.props.metadata.user} profile`,
                  src: this.props.metadata.profilepicture,
                })
              }),
              Container({
                class: "user-details",
                content: [
                  Container({
                    class: "content-creator youtube-link username",
                    content: Link({
                      link: this.props.metadata.userprofile,
                      content: this.props.metadata.user,
                    }),
                  }),
                  Text({
                    class: "posted",
                    content: parsePostDate(this.props.metadata.updatedat),
                  }),
                  Text({
                    class: "likes",
                    content: parseLikeCount(this.props.metadata.likecount),
                  }),
                ].join("\n")
              }),
            ].join("\n"),
          }),
          Seperator(),
          Container({
            content: this.props.metadata.text
          })
        ].join("\n"),
      });
    } else {
      throw new TypeError(`${props} on Comment is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  COMMENT_PROPERTIES,
  Comment,
};
