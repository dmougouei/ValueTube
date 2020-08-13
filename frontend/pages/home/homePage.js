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
const TypeHelpers = require('windlass').Utilities.Server.TypeHelpers;

class HOME_PAGE_PROPERTIES {
    constructor(props) {
        // loggedIn
        TypeHelpers.typeCheckPrimative(
            this,
            props,
            "loggedIn",
            TypeHelpers.PRIMATIVES.BOOLEAN,
            false,
            props.loggedIn
        );

        // videos
        TypeHelpers.typeCheckPrimative(
            this,
            props,
            "videos",
            TypeHelpers.PRIMATIVES.ARRAY,
            "",
            props.videos
        );
    }
}

function HomePage (props) {
    try {
        if (typeof props === "object" || props instanceof Object) {
            props instanceof HOME_PAGE_PROPERTIES
                ? (this.props = props)
                : (this.props = new HOME_PAGE_PROPERTIES(props));
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
                    "./frontend/pages/home/home.js",
                ],
                content: [
                    Navbar(this.props.loggedIn),
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
                                            this.props.videos.map((video) => {
                                                return Card(video.metadata);
                                            }).join("\n"),
                                    })
                                ].join("\n"),
                            })
                        ,
                    }),
                ].join("\n"),
            });
        } else {
          throw new TypeError(`${props} on HomePage is not a valid Object type.`);
        }
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    HOME_PAGE_PROPERTIES,
    HomePage,
}
