const NavBar = require("../../components/navBar/navBar.js");

module.exports = class AboutPage {
    constructor() {}
    
    render() {
        const navBar = new NavBar();
    
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>ValueTube - About</title>
                    <link rel="icon" href="./frontend/img/ValueTube_Logogram.svg">
                    <link rel="stylesheet" type="text/css" href="./frontend/css/style.css" />
                </head>
                <body>
                    ` + navBar.render() + `
                    <script type="module" src="./frontend/pages/about/about.js"></script>
                </body>
            </html>
        `;
    }
}