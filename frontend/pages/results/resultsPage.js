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
const DefaultTemplate = require('windlass').Templates.Default.DefaultTemplate;
const {
    SecurityHelpers,
    TypeHelpers,
} = require('windlass').Utilities.Server;
const NavBar = require("../../components/navBar/navBar.js");
const ListItem = require("../../components/listItem/listItem.js");

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

module.exports = function ResultsPage(props) {
    try {
        if (typeof props === "object" || props instanceof Object) {
            props instanceof RESULTS_PAGE_PROPERTIES
                ? (this.props = props)
                : (this.props = new RESULTS_PAGE_PROPERTIES(props));
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
                    "./frontend/pages/results/results.js",
                ],
                content: [
                    NavBar(this.props.loggedIn),
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
                                            (this.props.videos.length != 0)
                                                ? this.props.videos.map((video) => {
                                                    return ListItem({
                                                        metadata: video.metadata,
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
