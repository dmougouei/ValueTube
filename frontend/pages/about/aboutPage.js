const {
    CONTAINER_VALUES,
    Container,
    Seperator,
} = require('windlass').Components.Layout;
const {
    HEADING_VALUES,
    Heading,
    Link,
    Text,
} = require('windlass').Components.Typography;
const DefaultTemplate = require('windlass').Templates.Default.DefaultTemplate;
const NavBar = require("../../components/navBar/navBar.js");
const aboutData = require("./aboutData.js");

module.exports = function AboutPage() {
    return DefaultTemplate({
        description: "About page for the ValueTube website.",
        title: "ValueTube - About",
        icon: "./frontend/img/ValueTube_Logogram.svg",
        linkedStylesheets: [
            "./frontend/fonts/font-awesome/css/all.min.css",
            "./frontend/css/style.css",
        ],
        linkedScripts: [
            "./frontend/utilities/common.js",
            "./frontend/pages/about/about.js",
        ],
        content: [
            NavBar(),
            Container({
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
                                content: aboutData.mission
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
                            Container({
                                class: "grid-3",
                                content:
                                    aboutData.teamMembers.map((teamMember) => {
                                        return Container({
                                            class: "team-member",
                                            content: [
                                                `<img alt="Picture of ${teamMember.name}" src="./frontend/img/team/${teamMember.img}" />`,
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
                                                Link({
                                                    paragraph: true,
                                                    link: `mailto://${teamMember.link}`,
                                                    content: "Email"
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
        ].join("\n"),
    });
};
