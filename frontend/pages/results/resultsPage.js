const WIDTH_VALUES = require('windlass').Components.Default.WIDTH_VALUES;
const {
    Container,
    Seperator,
} = require('windlass').Components.Layout;
const {
    HEADING_VALUES,
    Heading,
    Text,
} = require('windlass').Components.Typography;
const {
    ListItem,
    Navbar,
} = require('windlass').Structures;
const DefaultTemplate = require('windlass').Templates.Default.DefaultTemplate;
const {
    SecurityHelpers,
    TypeHelpers,
} = require('windlass').Utilities.Server;
const queryDatabase = require('@vt/backend').Utilities.Database.queryDatabase;

class RESULTS_PAGE_PROPERTIES {
    constructor(props) {
        // searchQuery
        TypeHelpers.typeCheckPrimative(
            this,
            props,
            "searchQuery",
            TypeHelpers.PRIMATIVES.STRING,
            false,
            SecurityHelpers.sanitiseHTML(`${props.searchQuery}`),
        );
    }
}

async function ResultsPage(props) {
    try {
        if (typeof props === "object" || props instanceof Object) {
            props instanceof RESULTS_PAGE_PROPERTIES
                ? (this.props = props)
                : (this.props = new RESULTS_PAGE_PROPERTIES(props));
            const videoList = await queryDatabase(resultsQuery(this.props.searchQuery));
            return DefaultTemplate({
                description: `Results page for the ValueTube website with the query ${this.props.searchQuery}.`,
                title: `ValueTube - ${this.props.searchQuery}`,
                icon: "./frontend/img/ValueTube_Logogram.svg",
                linkedStylesheets: [
                    "./frontend/fonts/font-awesome/css/all.min.css",
                    "./frontend/css/style.css",
                ],
                linkedScripts: [
                    "./frontend/utilities/common.js",
                ],
                content: [
                    Navbar(this.props.loggedIn),
                    Container({
                        class: "full-width-container",
                        content:
                            Container({
                                class: "list-container",
                                maxWidth: WIDTH_VALUES.LARGE,
                                content: [
                                    Heading({
                                        variant: HEADING_VALUES.HEADING_2,
                                        content: `Results for ${this.props.searchQuery}`,
                                    }),
                                    Seperator(),
                                    Container({
                                        class: "list",
                                        content:
                                            (videoList.length != 0)
                                                ? videoList.map((video) => {
                                                    return ListItem({
                                                        metadata: video,
                                                    });
                                                }).join("\n")
                                                : Container({
                                                    style: "text-align: center;",
                                                    content: [
                                                        Heading({
                                                            variant: HEADING_VALUES.HEADING_2,
                                                            content: "No results found",
                                                        }),
                                                        Text({
                                                            paragraph: true,
                                                            content: "Try different keywords or remove search filters."
                                                        })
                                                    ].join("\n"),
                                                })
                                        ,
                                    })
                                ].join("\n"),
                            })
                        ,
                    }),
                ].join("\n"),
            });
        } else {
          throw new TypeError(`${props} on ResultsPage is not a valid Object type.`);
        }
    } catch (e) {
        console.error(e);
    }
}

function resultsQuery(searchQuery) {
    try {
        if (typeof searchQuery === "string" || searchQuery instanceof String) {
            return `
                SELECT DISTINCT ON (videos.videoid) videos.videoid, channelid, channelname, title, description, averagerating, viewcount, uploaddate,
                    keywords, category, values, tn.thumbnail,
                    fm.duration, difference(lower(title), lower('${searchQuery}'))
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
                WHERE difference(lower(title), lower('${searchQuery}')) >= 2
                ORDER BY videos.videoid, difference(lower(title), lower('${searchQuery}')) DESC;
            `;
        } else {
            throw new TypeError(`${searchQuery} on queryDatabase is not a valid String type.`);
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    RESULTS_PAGE_PROPERTIES,
    ResultsPage,
    resultsQuery,
}
