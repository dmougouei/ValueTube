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
const DefaultTemplate = require('windlass').Templates.Default.DefaultTemplate;
const queryDatabase = require('@vt/backend').Utilities.Database.queryDatabase;

const query = `
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

async function HomePage () {
    const videoList = await queryDatabase(query);

    return DefaultTemplate({
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
        content: [
            Navbar(),
            Container({
                class: "full-width-container",
                content:
                    Container({
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
                                        return Card(video);
                                    }).join("\n"),
                            })
                        ].join("\n"),
                    })
                ,
            }),
        ].join("\n"),
    });
};

module.exports = {
    HomePage,
}
