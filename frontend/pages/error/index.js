const Container = require('windlass').Components.Layout.Container;
const {
    Heading,
    Text,
} = require('windlass').Components.Typography;
const Navbar = require('windlass').Structures.Navbar;
const StickyHeaderTemplate = require('windlass').Templates.StickyHeader.StickyHeaderTemplate;

async function ErrorPage(userData) {
    return StickyHeaderTemplate({
        description: "Error 404 page not found for the ValueTube website.",
        title: "ValueTube - Error 404 page not found",
        icon: "./frontend/img/ValueTube_Logogram.svg",
        linkedStylesheets: [
            "./frontend/fonts/font-awesome/css/all.min.css",
            "./frontend/css/style.css",
        ],
        linkedScripts: [
            "./frontend/utilities/common.js",
        ],
        header: Navbar(await userData),
        content: Container({
            style: "text-align: center",
            content: [
                Heading({
                    content: "404",
                }),
                Text({
                    paragraph: true,
                    content: "Oops looks like something went wrong.",
                }),
                Text({
                    paragraph: true,
                    content: "We were unable to find the page you requested",
                }),
            ].join("\n"),
        }),
    });
};

module.exports = { ErrorPage };
