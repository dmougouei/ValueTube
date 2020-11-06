const {
    CONTAINER_VALUES,
    Container,
    Grid,
    Seperator,
} = require('windlass').Components.Layout;
const {
    HEADING_VALUES,
    Heading,
    Link,
    Text,
} = require('windlass').Components.Typography;
const Image = require('windlass').Components.Media.Image;
const Navbar = require('windlass').Structures.Navbar;
const StickyHeaderTemplate = require('windlass').Templates.StickyHeader.StickyHeaderTemplate;
const AboutData = require('@vt/backend').Data.About;

function AboutPage(userData) {
    return StickyHeaderTemplate({
        description: "About page for the ValueTube website.",
        title: "ValueTube - About",
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
            variant: CONTAINER_VALUES.MAIN,
            class: "full-width-container",
            content: [
                Container({
                    variant: CONTAINER_VALUES.SECTION,
                    class: "content-container",
                    content: [
                        Heading({
                            variant: HEADING_VALUES.HEADING_2,
                            content: "About Us"
                        }),
                        Seperator(),
                        Text({
                            paragraph: true,
                            content: AboutData.mission
                        }),
                    ].join("\n"),
                }),
                `<div class="color-section primary-secondary parallax" data-speed="-32"></div>`,
                Container({
                    variant: CONTAINER_VALUES.SECTION,
                    class: "content-container",
                    content: [
                        Heading({
                            variant: HEADING_VALUES.HEADING_2,
                            content: "Meet the Team"
                        }),
                        Seperator(),
                        Grid({
                            class: "grid-3",
                            content:
                                AboutData.teamMembers.map((teamMember) => {
                                    return Container({
                                        class: "team-member",
                                        content: [
                                            Image({
                                                alt: `Picture of ${teamMember.name}`,
                                                src: `./frontend/img/team/${teamMember.img}`
                                            }),
                                            Heading({
                                                variant: HEADING_VALUES.HEADING_4,
                                                content: teamMember.name,
                                            }),
                                            Heading({
                                                variant: HEADING_VALUES.HEADING_6,
                                                class: "sub",
                                                content: teamMember.role,
                                            }),
                                            Text({
                                                paragraph: true,
                                                content: teamMember.description,
                                            }),
                                            Text({
                                                paragraph: true,
                                                content: [
                                                    Link({
                                                        link: `mailto://${teamMember.email}`,
                                                        content: "Email"
                                                    }),
                                                    (teamMember.phone != undefined) ?
                                                        Text({
                                                            content: ` - PH. ${teamMember.phone}`,
                                                        }) :
                                                        null
                                                ].join("\n")
                                            })
                                        ].join("\n"),
                                    });
                                }).join("\n")
                            ,
                        }),
                    ].join("\n"),
                }),
                Container({
                    variant: CONTAINER_VALUES.SECTION,
                    class: "content-container",
                    content: [
                        Heading({
                            variant: HEADING_VALUES.HEADING_2,
                            content: "Find out more"
                        }),
                        Seperator(),
                        Text({
                            paragraph: true,
                            content: "For more information about this project. Please checkout our GitLab repository at:"
                        }),
                        Link({
                            link: "https://gitlab.com/ValueTube/ValueTube",
                            paragraph: true,
                            tabIndex: 0,
                            content: "https://gitlab.com/ValueTube/ValueTube",
                        }),
                    ].join("\n"),
                }),
            ].join("\n"),
        }),
    });
};

module.exports = { AboutPage };
