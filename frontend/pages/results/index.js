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
const StickyHeaderTemplate = require('windlass').Templates.StickyHeader.StickyHeaderTemplate;
const queryDatabase = require('@vt/backend').Utilities.Database.queryDatabase;

async function ResultsPage(searchQuery, userData) {
    const videoList = await queryDatabase(`SELECT * FROM resultsquery1($1);`, [searchQuery]);
    return StickyHeaderTemplate({
        description: `Results page for the ValueTube website with the query ${searchQuery}.`,
        title: `ValueTube - ${searchQuery}`,
        icon: "./frontend/img/ValueTube_Logogram.svg",
        linkedStylesheets: [
            "./frontend/fonts/font-awesome/css/all.min.css",
            "./frontend/css/style.css",
        ],
        linkedScripts: [
            "./frontend/utilities/common.js",
        ],
        header: Navbar(userData),
        content: Container({
            class: "full-width-container",
            content: Container({
                class: "list-container",
                maxWidth: WIDTH_VALUES.LARGE,
                content: [
                    Heading({
                        variant: HEADING_VALUES.HEADING_2,
                        content: `Results for ${searchQuery}`,
                    }),
                    Seperator(),
                    Container({
                        class: "list",
                        content:(videoList.length != 0)
                            ? videoList.map((video) => {
                                return ListItem.ListItem({
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
            }),
        }),
    });
}

module.exports = { ResultsPage }
