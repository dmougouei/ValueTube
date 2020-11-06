const Container = require("../../components").Layout.Container;
const TypeHelpers = require("../../utilities").Server.TypeHelpers;

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

module.exports = function ListItem(props) {
  try {
    if (typeof props === "object" || props instanceof Object) {
      props instanceof LIST_ITEM_PROPERTIES
        ? (this.props = props)
        : (this.props = new LIST_ITEM_PROPERTIES(props));

      let duration = "";
      const approxDurationSeconds = +this.props.metadata.duration / 1000;
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
      if (this.props.metadata.vid_viewcount < 1000) {
        views = this.props.metadata.vid_viewcount;
      } else if (this.props.metadata.vid_viewcount < 1000000) {
        views = (this.props.metadata.vid_viewcount / 1000).toFixed(1) + "K";
      } else if (this.props.metadata.vid_viewcount < 1000000000) {
        views = (this.props.metadata.vid_viewcount / 1000000).toFixed(1) + "M";
      } else if (this.props.metadata.vid_viewcount < 1000000000000) {
        views = (this.props.metadata.vid_viewcount / 1000000000).toFixed(1) + "B";
      } else {
        views =
          (this.props.metadata.vid_viewcount / 1000000000000).toFixed(1) + "T";
      }

      let timeSinceUpload = "";
      const date = new Date();
      const uploadDate = new Date(this.props.metadata.vid_uploaddate);
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
                <div class="list-item${
                  this.props.small ? " sm" : ""
                }" onclick="window.location.href = './watch?v=${
        this.props.metadata.vid_videoid
      }'">
                    <div class="preview">
                        <img alt="${this.props.metadata.vid_title}" src="${
        this.props.metadata.vid_thumbnail_url
      }" loading="lazy" decoding="async" />
                        <div class="duration">${
                          hours != 0
                            ? `${hours}:${minutes}:${seconds}`
                            : `${minutes}:${seconds}`
                        }</div>
                    </div>
                    <div class="details">
                        <div class="title">${
                          this.props.small &&
                          this.props.metadata.vid_title.length > 58
                            ? `${this.props.metadata.vid_title
                                .substring(0, 58)
                                .substring(
                                  0,
                                  this.props.metadata.vid_title.lastIndexOf(" ")
                                )} ...`
                            : this.props.metadata.vid_title
                        }</div>
                        <div class="content-creator youtube-link" data-url="https://www.youtube.com/channel/${this.props.metadata.vid_channelid}/">${this.props.metadata.vid_channelname}</div>
                        <div class="views">${views} views</div>
                        <div class="published">${timeSinceUpload}</div>
                        ${Container({
                          class: "description",
                          content: this.props.small
                            ? ``
                            : this.props.metadata.vid_description.length > 270
                            ? `${this.props.metadata.vid_description
                                .substring(0, 270)
                                .substring(
                                  0,
                                  this.props.metadata.vid_description.lastIndexOf(
                                    " "
                                  )
                                )} ...`
                            : this.props.metadata.vid_description,
                        })}
                    </div>
                </div>
            `;
    } else {
      throw new TypeError(`${props} on ListItem is not a valid Object type.`);
    }
  } catch (e) {
    console.error(e);
  }
};
