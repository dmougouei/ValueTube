const NavBar = require("../../components/navBar/navBar.js");
const aboutData = require("./aboutData.js");

module.exports = class AboutPage {
    constructor() { }
    
    render() {
        const navBar = new NavBar();
        let teamMembersHTML = "<div style='height: 540px;'></div>";
    
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
                        <div class="content-container">
                            <h2>About Us</h2>
                            <p>` + aboutData.mission + `</p>
                        </div>
                        <div class="color-section primary-secondary parallax" data-speed="-32"></div>
                        <div class="content-container">
                            <h2>Meet the Team</h2>
                            <div class="grid-3">` +
                                teamMembersHTML
                            + `</div>
                        </div>
                        <div class="content-container">
                            <h2>Find out more</h2>
                            <p>For more information about this project. Please checkout our GitLab repository at:</p>
                            <p><a href="https://gitlab.com/ValueTube/ValueTube">https://gitlab.com/ValueTube/ValueTube</a></p>
                        </div>
                    </div>
                    <script type="module" src="./frontend/utilities/common.js"></script>
                    <script type="module" src="./frontend/pages/about/about.js"></script>
                </body>
            </html>
        `;
    }
}