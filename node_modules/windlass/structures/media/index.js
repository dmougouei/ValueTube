function Video(thumbnail, videoUrl) {
  return `<video id="video" src="${videoUrl}" poster="${thumbnail}" autoplay controls></video>`;
}

module.exports = function Media(metadata) {
  return `<div class="media">
    <div class="media_controls"></div>
    ${Video(metadata.thumbnail, metadata.videoUrl)}
  </div>`;
};
