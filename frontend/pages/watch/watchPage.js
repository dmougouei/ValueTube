const Comment = require("../../components/comment/comment.js")
const ListItem = require("../../components/listItem/listItem.js")
const Media = require("../../components/media/media.js");
const NavBar = require("../../components/navBar/navBar.js");

module.exports = class WatchPage {
    constructor(metadata) {
        this.metadata = metadata;
        this.metadata.comments = [
            {
                user: "John Smith",
                commentBody: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In augue enim, tempus at egestas vitae, vehicula ac dui. Pellentesque gravida orci non sem tincidunt hendrerit. Nunc cursus sollicitudin tellus. Phasellus molestie ante sit amet arcu varius congue."
            },
            {
                user: "Jane Doe",
                commentBody: "Sed quis ligula sed purus pharetra dignissim. Sed ut tempor mauris, eget ullamcorper quam. Aenean pretium ornare ante ac aliquam. Donec condimentum felis turpis, ut laoreet massa interdum eget."
            }
        ];
        this.title = metadata.title;
    }
    
    render(videos) {
        this.videos = videos;
        const navBar = new NavBar();
        const media = new Media(this.metadata);
        let listHTML = "";
        if (this.videos.length != 0) {
            for (let i = 0; i < this.videos.length; i++) {
                const listItem = new ListItem(this.videos[i].metadata, "sm");
                listHTML += listItem.render();
            }
        }

        let duration = "";
        const hours = Math.floor(this.metadata.duration / 3600);
        let minutes = Math.floor((this.metadata.duration - (hours * 3600)) / 60);
        let seconds = (this.metadata.duration - (hours * 3600) - (minutes * 60))
        minutes = ((minutes < 10) && (hours != 0)) ?  "0" + minutes : minutes;
        seconds = (seconds < 10) ?  "0" + seconds : seconds;
        duration = (hours != 0) ? hours + ":" + minutes + ":" + seconds : minutes + ":" + seconds;

        let views = "";
        if (this.metadata.view_count < 1000) {
            views = this.metadata.view_count;
        } else if (this.metadata.view_count < 1000000) {
            views = (this.metadata.view_count/1000).toFixed(1) + "K";
        } else if (this.metadata.view_count < 1000000000) {
            views = (this.metadata.view_count/1000000).toFixed(1) + "M";
        } else if (this.metadata.view_count < 1000000000000) {
            views = (this.metadata.view_count/1000000000).toFixed(1) + "B";
        } else {
            views = (this.metadata.view_count/1000000000000).toFixed(1) + "T";
        }

        let timeSinceUpload = "";
        const date = new Date();
        const timeSince = [
            date.getUTCFullYear() - this.metadata.upload_date.substr(0,4),
            date.getUTCMonth() - this.metadata.upload_date.substr(4,2),
            date.getUTCDay() - this.metadata.upload_date.substr(6,2)
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

        let commentsHTML = "";
        if (this.metadata.comments) {
            for (let i = 0; i < this.metadata.comments.length; i++) {
                const comment = new Comment(this.metadata.comments[i]);
                commentsHTML += comment.render();
            }
        }
            
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>` + this.title + `</title>
                    <link rel="icon" href="./frontend/img/ValueTube_Logogram.svg" />
                    <link rel="stylesheet" type="text/css" href="./frontend/fonts/font-awesome/css/all.min.css" />
                    <link rel="stylesheet" type="text/css" href="./frontend/css/style.css" />
                </head>
                <body>
                    ` + navBar.render() + `
                    <div class="full-width-container">
                        <div class="grid-container">
                            <div class="grid-3-1">
                                <div class="media-container">
                                    `  + media.render() + `
                                    <div class="details">
                                        <div class="title">` + this.metadata.title + `</div>
                                        <div class="views">` + views + ' views' + `</div>
                                        <div class="published">` + timeSinceUpload + `</div>
                                        <div class="content-creator youtube-link" data-url="` + this.metadata.uploader_url + `">` + this.metadata.uploader + `</div>
                                        <div class="seperator"></div>
                                        <div class="description">` + this.metadata.description + `</div>
                                        <div class="seperator"></div>
                                        <div class="comments">
                                            <h4>` + this.metadata.comments.length + ` Comments</h4>
                                            ` + commentsHTML + `
                                        </div>
                                    </div>
                                </div>
                                <div class="list-container">
                                    <h4>Recommended for you</h3>
                                    <div class="seperator"></div>
                                    ` + listHTML + `
                                </div>
                            </div>
                        </div>
                    </div>
                    <script type="module" src="./frontend/utilities/common.js"></script>
                    <script type="module" src="./frontend/pages/watch/watch.js"></script>
                </body>
            </html>
        `;
    }
}