const {
    Container,
    Seperator,
} = require('windlass').Components.Layout;
const {
    HEADING_VALUES,
    Heading,
    Text,
} = require('windlass').Components.Typography;
const DefaultTemplate = require('windlass').Templates.Default.DefaultTemplate;
const TypeHelpers = require('windlass').Utilities.Server.TypeHelpers;
const {
    Comment,
    ListItem,
    Media,
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
    LIMIT 36;
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
    }
}

async function WatchPage(props) {
    try {
        if (typeof props === "object" || props instanceof Object) {
            props instanceof WATCH_PAGE_PROPERTIES
                ? (this.props = props)
                : (this.props = new WATCH_PAGE_PROPERTIES(props));
            await Database.updateDatabase(this.props.videoId);
            const metadata = parseMetadata(
                await Database.queryDatabase(
                    watchQuery(this.props.videoId)
                )
            );
            const videoList = await Database.queryDatabase(videoQuery);

            return DefaultTemplate({
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
                                                    Media(metadata),
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
                                                            // Container({
                                                            //     class: "comments",
                                                            //     content: [
                                                            //         Heading({
                                                            //             variant: HEADING_VALUES.HEADING_4,
                                                            //             content: `${metadata.comments.length} Comments`,
                                                            //         }),
                                                            //         comments.map((comment) => {
                                                            //             return Comment(metadata.comment);
                                                            //         }).join("\n"),
                                                            //     ].join("\n"),
                                                            // }),
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
                                                    videoList.map((video) => {
                                                        return ListItem({
                                                            small: true,
                                                            metadata: video
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
