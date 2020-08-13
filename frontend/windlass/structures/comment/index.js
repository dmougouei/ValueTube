module.exports = function Comment(props) {
  this.props = props;
  return `<div class="comment">
      <div class="user">
        ${this.props.user}
      </div>
      <div class="comment-body">
        ${this.props.commentBody}
      </div>
    </div>`;
};
