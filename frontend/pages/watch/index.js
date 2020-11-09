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
    Link,
    Text,
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
const recommend = require('@vt/backend').Utilities.Recommend.recommend;
const {
    updateDatabase,
    queryDatabase
} = require('@vt/backend').Utilities.Database;
const parseMetadata = require('../../utilities/metadata/');

function watchListQuery(recommendedVideos) {
    const placeholders = recommendedVideos.map((x, i) => {
        return `$${i+1}`;
    }).join();
    return `
        SELECT * FROM (
            SELECT DISTINCT ON (videos.videoid) videos.videoid,
                channelid, channelname, title, description,
                averagerating, viewcount, uploaddate,
                keywords, category, values,
                array_agg((thumbnails.url, thumbnails.width)) AS thumbnails,
                fm.duration
            FROM videos
            JOIN thumbnails ON thumbnails.videoid = videos.videoid
            JOIN (
                SELECT videoid,
                    MAX(approxdurationms) OVER (PARTITION BY videoid) AS duration,
                    MAX(height) OVER (PARTITION BY videoid) AS max_height
                FROM formats
            ) fm ON videos.videoid = fm.videoid
            GROUP BY videos.videoid, fm.duration
        ) AS videoData
        WHERE videoData.videoid IN (${placeholders})
        LIMIT 12;
    `;
}

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
            await updateDatabase(this.props.videoId);
            let metadata = parseMetadata(
                await queryDatabase(`
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
                    WHERE videos.videoid = '${this.props.videoId}'
                    LIMIT 1;
                `)
            );
            metadata = {
                comments: await queryDatabase(`
                    SELECT authordisplayname AS user,
                        authorprofileimageurl AS profilepicture,
                        authorchannelurl AS userprofile,
                        textdisplay AS text,
                        likecount,
                        updatedat
                    FROM comments
                    WHERE (comments.videoid = '${this.props.videoId}'
                        AND (comments.parentid = '' OR comments.parentid = NULL));
                `),
                ...metadata,
            };
            let recommendedVideos = await recommend(this.props.userData.userId);
            recommendedVideos = recommendedVideos.slice(0, 36).map((x) => {
                return `${x[0]}`
            });
            const videoList = await queryDatabase(watchListQuery(recommendedVideos), recommendedVideos);

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
                header: Navbar(this.props.userData),
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
                                Container({
                                    class: "content-creator youtube-link",
                                    content: Link({
                                      link: `https://www.youtube.com/channel/${metadata.channelId}/`,
                                      content: metadata.channelName,
                                    }),
                                }),
                                Seperator(),
                                Container({
                                    content: [
                                        Text({
                                            id: "description",
                                            content: metadata.description.replaceAll("\n", "<br/>"),
                                        }),
                                        Container({
                                            id: "expand",
                                            onclick: "toggleDescription();",
                                            content: `<i class="fas fa-chevron-down"></i>`
                                        }),
                                    ].join("\n"),
                                }),
                                `<script>
                                    function toggleDescription() {
                                        document.getElementById("description").classList.toggle("expand");
                                        document.getElementById("expand").innerHTML = 
                                            document.getElementById("expand").innerHTML == '<i class="fas fa-chevron-down"></i>'
                                                ? '<i class="fas fa-chevron-up"></i>'
                                                : '<i class="fas fa-chevron-down"></i>';
                                    }
                                </script>`,
                                Seperator(),
                                Container({
                                    class: "comments",
                                    content: [
                                        Heading({
                                            variant: HEADING_VALUES.HEADING_4,
                                            content: `${metadata.comments.length} Comments`,
                                        }),
                                        metadata.comments.map((comment) => {
                                            return Comment.Comment({
                                                metadata: comment,
                                            });
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
                            return ListItem.ListItem({
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

module.exports = {
    WATCH_PAGE_PROPERTIES,
    WatchPage,
};
