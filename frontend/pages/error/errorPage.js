const Container = require('windlass').Components.Layout.Container;
const {
    Heading,
    Text,
} = require('windlass').Components.Typography;
const Navbar = require('windlass').Structures.Navbar;
const DefaultTemplate = require('windlass').Templates.Default.DefaultTemplate;

function ErrorPage() {
    return DefaultTemplate({
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
        content: [
            Navbar(),
            Container({
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
        ].join("\n"),
    });
};

module.exports = { ErrorPage };
