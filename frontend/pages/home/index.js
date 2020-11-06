const WIDTH_VALUES = require('windlass').Components.Default.WIDTH_VALUES;
const {
    Container,
    Seperator,
} = require('windlass').Components.Layout;
const {
    HEADING_VALUES,
    Heading,
} = require('windlass').Components.Typography;
const {
    Card,
    Navbar,
} = require('windlass').Structures;
const StickyHeaderTemplate = require('windlass').Templates.StickyHeader.StickyHeaderTemplate;
const recommend = require('@vt/backend').Utilities.Recommend.recommend;
const queryDatabase = require('@vt/backend').Utilities.Database.queryDatabase;
const env = require('@vt/vt_env');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: env.DB.DB_USER,
    host: env.DB.DB_HOST,
    database: env.DB.DB_DATABASE,
    password: env.DB.DB_PASS,
    port: env.DB.DB_PORT
});

function homeQuery(recommendedVideos) {
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
        WHERE videoData.videoid IN (${placeholders});
    `;
}

async function HomePage (userData) {
    let recommendedVideos = await recommend(userData.userId);
    recommendedVideos = recommendedVideos.slice(0, 36).map((x) => {
        return `${x[0]}`
    });
    const videoList = await queryDatabase(homeQuery(recommendedVideos), recommendedVideos);
    return StickyHeaderTemplate({
        description: "Home page for the ValueTube website.",
        title: "ValueTube",
        icon: "./frontend/img/ValueTube_Logogram.svg",
        linkedStylesheets: [
            "./frontend/fonts/font-awesome/css/all.min.css",
            "./frontend/css/style.css",
        ],
        linkedScripts: [
            "./frontend/utilities/common.js",
        ],
        header: Navbar(await userData),
        content: Container({
            class: "full-width-container",
            content: Container({
                class: "grid-container",
                maxWidth: WIDTH_VALUES.LARGE,
                content: [
                    Heading({
                        variant: HEADING_VALUES.HEADING_2,
                        content: "Recommended",
                    }),
                    Seperator(),
                    Container({
                        class: "grid-4",
                        content:
                            videoList.map((video) => {
                                return Card.Card(video);
                            }).join("\n"),
                    })
                ].join("\n"),
            }),
        }),
    });
};

module.exports = { HomePage }
