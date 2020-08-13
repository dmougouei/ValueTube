const {
    Container,
    Seperator,
} = require('windlass').Components.Layout;
const {
    HEADING_VALUES,
    Heading,
} = require('windlass').Components.Typography;
const DefaultTemplate = require('windlass').Templates.Default.DefaultTemplate;
const TypeHelpers = require('windlass').Utilities.Server.TypeHelpers;
const {
    Comment,
    ListItem,
    Media,
    Navbar,
} = require('windlass').Structures;

class WATCH_PAGE_PROPERTIES {
    constructor(props) {
        // metadata
        TypeHelpers.typeCheckPrimative(
            this,
            props,
            "metadata",
            TypeHelpers.PRIMATIVES.OBJECT,
            undefined,
            props.metadata,
        );

        // videos
        TypeHelpers.typeCheckPrimative(
            this,
            props,
            "videos",
            TypeHelpers.PRIMATIVES.ARRAY,
            [],
            props.videos
        );
    }
}

function WatchPage(props) {
    try {
        if (typeof props === "object" || props instanceof Object) {
            props instanceof WATCH_PAGE_PROPERTIES
                ? (this.props = props)
                : (this.props = new WATCH_PAGE_PROPERTIES(props));

            const title = this.props.metadata.title;
            const description = this.props.metadata.description;

            const comments = [
                {
                    user: "John Smith",
                    commentBody: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In augue enim, tempus at egestas vitae, vehicula ac dui. Pellentesque gravida orci non sem tincidunt hendrerit. Nunc cursus sollicitudin tellus. Phasellus molestie ante sit amet arcu varius congue."
                },
                {
                    user: "Jane Doe",
                    commentBody: "Sed quis ligula sed purus pharetra dignissim. Sed ut tempor mauris, eget ullamcorper quam. Aenean pretium ornare ante ac aliquam. Donec condimentum felis turpis, ut laoreet massa interdum eget."
                }
            ];

            let views = "";
            if (this.props.metadata.viewCount < 1000) {
                views = this.props.metadata.viewCount;
            } else if (this.props.metadata.viewCount < 1000000) {
                views = (this.props.metadata.viewCount/1000).toFixed(1) + "K";
            } else if (this.props.metadata.viewCount < 1000000000) {
                views = (this.props.metadata.viewCount/1000000).toFixed(1) + "M";
            } else if (this.props.metadata.viewCount < 1000000000000) {
                views = (this.props.metadata.viewCount/1000000000).toFixed(1) + "B";
            } else {
                views = (this.props.metadata.viewCount/1000000000000).toFixed(1) + "T";
            }

            let timeSinceUpload = "";
            const date = new Date();
            const timeSince = [
                date.getUTCFullYear() - this.props.metadata.uploadDate.substring(0,4),
                date.getUTCMonth() - this.props.metadata.uploadDate.substring(6,8),
                date.getUTCDay() - this.props.metadata.uploadDate.substring(10,12)
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

            return DefaultTemplate({
                description: `Watch page for the ValueTube website for the video ${title}.`,
                title: `ValueTube - ${title}`,
                icon: "./frontend/img/ValueTube_Logogram.svg",
                linkedStylesheets: [
                    "./frontend/fonts/font-awesome/css/all.min.css",
                    "./frontend/css/style.css",
                ],
                linkedScripts: [
                    "./frontend/utilities/common.js",
                    "./frontend/pages/watch/watch.js",
                ],
                content: [
                    Navbar(),
                    Container({
                        class: "full-width-container",
                        content:
                            Container({
                                class: "grid-container",
                                content:
                                    Container({
                                        class: "grid-3-1",
                                        content: [
                                            Container({
                                                class: "media-container",
                                                content: [
                                                    Media(this.props.metadata),
                                                    Container({
                                                        class: "details",
                                                        content: [
                                                            Container({
                                                                class: "title",
                                                                content: title,
                                                            }),
                                                            Container({
                                                                class: "views",
                                                                content: `${views} views`,
                                                            }),
                                                            Container({
                                                                class: "published",
                                                                content: timeSinceUpload,
                                                            }),
                                                            `<div class="content-creator youtube-link" data-url="https://www.youtube.com/channel/${this.props.metadata.channelId}">${this.props.metadata.channelName}</div>`,
                                                            Seperator(),
                                                            Container({
                                                                class: "description",
                                                                content: description,
                                                            }),
                                                            Seperator(),
                                                            Container({
                                                                class: "comments",
                                                                content: [
                                                                    Heading({
                                                                        variant: HEADING_VALUES.HEADING_4,
                                                                        content: `${comments.length} Comments`,
                                                                    }),
                                                                    comments.map((comment) => {
                                                                        return Comment(comment);
                                                                    }).join("\n"),
                                                                ].join("\n"),
                                                            }),
                                                        ].join("\n"),
                                                    }),
                                                ].join("\n"),
                                            }),
                                            Container({
                                                class: "list-container",
                                                content: [
                                                    Heading({
                                                        variant: HEADING_VALUES.HEADING_4,
                                                        content: "Recommended for you",
                                                    }),
                                                    Seperator(),
                                                    this.props.videos.map((video) => {
                                                        return ListItem({
                                                            small: true,
                                                            metadata: video.metadata
                                                        });
                                                    }).join("\n"),
                                                ].join("\n"),
                                            }),
                                        ].join("\n"),
                                    })
                                ,
                            })
                        ,
                    }),
                ].join("\n"),
            });
        } else {
          throw new TypeError(`${props} on WatchPage is not a valid Object type.`);
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    WATCH_PAGE_PROPERTIES,
    WatchPage,
};
