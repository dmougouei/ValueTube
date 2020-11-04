

const Navbar = require('windlass').Structures.Navbar;
const { Container } = require('windlass').Components.Layout;
const {
    SIDE_VALUES,
    SplitScreenTemplate,
} = require('windlass').Templates.SplitScreen;

const ProfilePage = async (userData) => {
    if (userData) {
        return SplitScreenTemplate({
            description: `Profile page for ${userData.username} the ValueTube website.`,
            title: `ValueTube - Profile (${userData.username})`,
            icon: "./frontend/img/ValueTube_Logogram.svg",
            linkedStylesheets: [
                "./frontend/fonts/font-awesome/css/all.min.css",
                "./frontend/css/style.css",
            ],
            linkedScripts: [
                "./frontend/utilities/common.js",
            ],
            side: SIDE_VALUES.LEFT,
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
