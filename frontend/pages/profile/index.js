const { Survey } = require('windlass/structures/form');
const Navbar = require('windlass').Structures.Navbar;
const { Container, Seperator } = require('windlass').Components.Layout;
const { Button } = require('windlass').Components.Input;
const { HEADING_VALUES, Heading } = require('windlass').Components.Typography;
const {
    SPLITSCREEN_SIDE_VALUES,
    SplitScreenTemplate,
} = require('windlass').Templates.SplitScreen;

const ProfilePage = async (userData) => {
    const data = await userData;
    if (data) {
        return SplitScreenTemplate({
            description: `Profile page for ${data.username} the ValueTube website.`,
            title: `ValueTube - Profile (${data.username})`,
            icon: "./frontend/img/ValueTube_Logogram.svg",
            linkedStylesheets: [
                "./frontend/fonts/font-awesome/css/all.min.css",
                "./frontend/css/style.css",
            ],
            linkedScripts: [
                "./frontend/utilities/common.js",
            ],
            side: SPLITSCREEN_SIDE_VALUES.LEFT,
            header: Navbar(data),
            leftContent: "<br>",
            rightContent: Container({
                class: "full-width-container",
                content: Container({
                    class: "content-container signup",
                    content: [
                        Container({
                            class: "sign-title",
                            content: Heading({
                                variant: HEADING_VALUES.HEADING_2,
                                content: "Values Survey",
                            }),
                        }),
                        Seperator(),
                        Container({
                            class: "survey-form",
                            content: await Survey(),
                        }),
                        Container({
                            class: "btn-container center",
                            content: Button({
                                class: "primary",
                                content: "Save",
                            }),
                        }),
                    ].join("\n"),
                }),
            }),
        });
    } else {
        return false;
    }
}

module.exports = { ProfilePage };
