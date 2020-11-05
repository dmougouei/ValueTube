

const Navbar = require('windlass').Structures.Navbar;
const { Container } = require('windlass').Components.Layout;
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
            header: Navbar(true),
            leftContent: Container({
                content: "Profile Info",
            }),
            rightContent: Container({
                content: "Survey Form",
            }),
        });
    } else {
        return false;
    }
}

module.exports = { ProfilePage };
