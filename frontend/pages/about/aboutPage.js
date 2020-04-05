const NavBar = require("../../components/navBar/navBar.js");
const aboutData = require("./aboutData.js");

module.exports = class AboutPage {
    constructor() { }
    
    render() {
        const navBar = new NavBar();
        let teamMembersHTML = "<div style='height: 500px;'></div>";
    
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>ValueTube - About</title>
                    <link rel="icon" href="./frontend/img/ValueTube_Logogram.svg" />
                    <link rel="stylesheet" type="text/css" href="./frontend/fonts/font-awesome/css/all.min.css" />
                    <link rel="stylesheet" type="text/css" href="./frontend/css/style.css" />
                </head>
                <body>
                    ` + navBar.render() + `
                    <div class="full-width-container">
                        <h1>About Us</h1>
                        <p>` + aboutData.mission + `</p>
                        <div class="color-section-container primary-secondary">
                            <h1>Meet the Team</h1>
                            <div class="grid-3">` +
                                teamMembersHTML
                            + `</div>
                        </div>
                        <h1>Find out more</h1>
                        <p>For more information about this project. Please checkout our GitLab repository at:</p>
                        <p><a href="https://gitlab.com/ValueTube/ValueTube">https://gitlab.com/ValueTube/ValueTube</a></p>
                    </div>
                    <script type="module" src="./frontend/utilities/common.js"></script>
                    <script type="module" src="./frontend/pages/about/about.js"></script>
                </body>
            </html>
        `;
    }
}