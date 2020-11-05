const {
    DISPLAY_VALUES,
    PADDING_VALUES,
} = require('windlass').Components.Default;
const {
    Container,
    Seperator,
} = require('windlass').Components.Layout;
const {
    HEADING_VALUES,
    Heading,
} = require('windlass').Components.Typography;
const Video = require('windlass').Components.Media.Video;
const {
    SidebarTemplate,
} = require('windlass').Templates.Sidebar;
const TypeHelpers = require('windlass').Utilities.Server.TypeHelpers;
const {
    Comment,
    ListItem,
    Navbar,
} = require('windlass').Structures;
const Database = require('@vt/backend').Utilities.Database;
const parseMetadata = require('../../utilities/metadata/');

const videoQuery = `
    SELECT * FROM (
        SELECT * FROM (
            SELECT DISTINCT ON (videos.videoid) videos.videoid, channelid, channelname, title, description, averagerating, viewcount, uploaddate,
            keywords, category, values, tn.thumbnail,
            fm.duration, (videos.averagerating::FLOAT * videos.viewcount::FLOAT) AS popularity
            FROM videos
            INNER JOIN
            (
                SELECT videoid,
                        url AS thumbnail,
                        MAX(height) OVER (PARTITION BY videoid) AS max_height
                FROM thumbnails
            ) tn ON videos.videoid = tn.videoid
            INNER JOIN
            (
                SELECT videoid,
                    MAX(approxdurationms) OVER (PARTITION BY videoid) AS duration,
                        MAX(height) OVER (PARTITION BY videoid) AS max_height
                FROM formats
            ) fm ON tn.videoid = fm.videoid
            ORDER BY videos.videoid DESC
        ) AS sortedVideos
        ORDER BY popularity DESC
        LIMIT 50
    ) AS topVideos
    ORDER BY RANDOM()
    LIMIT 12;
`;

class WATCH_PAGE_PROPERTIES {
    constructor(props) {
        // videoId
        TypeHelpers.typeCheckPrimative(
            this,
            props,
            "videoId",
            TypeHelpers.PRIMATIVES.STRING,
            undefined,
            props.videoId,
        );
        
        // userData {
        TypeHelpers.typeCheckPrimative(
            this,
            props,
            "userData",
            TypeHelpers.PRIMATIVES.OBJECT,
            false,
            props.userData,
        );
    }
}

async function WatchPage(props) {
    try {
        if (typeof props === "object" || props instanceof Object) {
            props instanceof WATCH_PAGE_PROPERTIES
                ? (this.props = props)
                : (this.props = new WATCH_PAGE_PROPERTIES(props));
            await Database.updateDatabase(this.props.videoId);
            let metadata = parseMetadata(
                await Database.queryDatabase(
                    watchQuery(this.props.videoId)
                )
            );
            metadata = {
                comments: await Database.queryDatabase(`
                    SELECT authordisplayname AS user,
                        textdisplay AS text 
                    FROM comments
                    WHERE comments.videoid = '${this.props.videoId}'
                    LIMIT 5;
                `),
                ...metadata,
            };
            const videoList = await Database.queryDatabase(videoQuery);

            return SidebarTemplate({
                description: `Watch page for the ValueTube website for the video ${metadata.title}.`,
                title: `ValueTube - ${metadata.title}`,
                icon: "./frontend/img/ValueTube_Logogram.svg",
                linkedStylesheets: [
                    "./frontend/fonts/font-awesome/css/all.min.css",
                    "./frontend/css/style.css",
                ],
                linkedScripts: [
                    "./frontend/utilities/common.js",
                ],
                header: Navbar((this.props.userData) ? true : false),
                mainContent: Container({
                    class: "media-container",
                    padding: PADDING_VALUES[4.5],
                    content: [
                        Video({
                            poster: metadata.thumbnail,
                            src: metadata.videoUrl,
                            controls: true,
                            autoplay: true,
                            display: DISPLAY_VALUES.BLOCK,
                            style: "width: 100%;",
                        }),
                        Container({
                            class: "details",
                            content: [
                                Container({
                                    class: "title",
                                    content: metadata.title,
                                }),
                                Container({
                                    class: "views",
                                    content: `${metadata.views} views`,
                                }),
                                Container({
                                    class: "published",
                                    content: metadata.timeSinceUpload,
                                }),
                                `<div class="content-creator youtube-link" data-url="https://www.youtube.com/channel/${metadata.channelId}">${metadata.channelName}</div>`,
                                Seperator(),
                                Container({
                                    class: "description",
                                    content: metadata.description,
                                }),
                                Seperator(),
                                Container({
                                    class: "comments",
                                    content: [
                                        Heading({
                                            variant: HEADING_VALUES.HEADING_4,
                                            content: `${metadata.comments.length} Comments`,
                                        }),
                                        metadata.comments.map((comment) => {
                                            return Comment(comment);
                                        }).join("\n"),
                                    ].join("\n"),
                                }),
                            ].join("\n"),
                        }),
                    ].join("\n"),
                }),
                sidebarContent: Container({
                    class: "list-container",
                    padding: PADDING_VALUES[3.5],
                    content: [
                        Heading({
                            variant: HEADING_VALUES.HEADING_4,
                            content: "Recommended for you",
                        }),
                        Seperator(),
                        videoList.map((video) => {
                            return ListItem({
                                small: true,
                                metadata: video
                            });
                        }).join("\n"),
                    ].join("\n"),
                }),
            });
        } else {
          throw new TypeError(`${props} on WatchPage is not a valid Object type.`);
        }
    } catch (e) {
        console.error(e);
    }
}

function watchQuery(videoId) {
    try {
        if (typeof videoId === "string" || videoId instanceof String) {
            return `
                SELECT DISTINCT ON (videos.videoid) videos.videoid, channelid, channelname, title, description, averagerating, viewcount, uploaddate,
                    keywords, category, values, tn.thumbnail, fm.duration, fm.videoUrl
                FROM videos
                INNER JOIN
                (
                        SELECT videoid,
                                url AS thumbnail,
                                MAX(height) OVER (PARTITION BY videoid) AS max_height
                        FROM thumbnails
                ) tn ON videos.videoid = tn.videoid
                INNER JOIN
                (
                        SELECT videoid,
                            url AS videoUrl,
                            MAX(approxdurationms) OVER (PARTITION BY videoid) AS duration,
                                MAX(height) OVER (PARTITION BY videoid) AS max_height
                        FROM formats
                    ) fm ON tn.videoid = fm.videoid
                WHERE videos.videoid = '${videoId}'
                LIMIT 1;
            `;
        } else {
            throw new TypeError(`${videoId} on queryDatabase is not a valid String type.`);
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    WATCH_PAGE_PROPERTIES,
    WatchPage,
};
