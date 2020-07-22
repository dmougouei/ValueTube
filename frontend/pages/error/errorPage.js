const NavBar = require("../../components/navBar/navBar.js");

module.exports = class ErrorPage {
    constructor() {}
    
    render() {
        const navBar = new NavBar();
    
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>ValueTube</title>
                    <link rel="icon" href="./frontend/img/ValueTube_Logogram.svg" />
                    <link rel="stylesheet" type="text/css" href="./frontend/fonts/font-awesome/css/all.min.css" />
                    <link rel="stylesheet" type="text/css" href="./frontend/css/style.css" />
                </head>
                <body>
                    ` + navBar.render() + `
                    <div style="text-align: center;">
                        <h1>404</h1>
                        <p>Oops looks like something went wrong.</p>
                        <p>We were unable to find the page you requested</p>
                    </div>
                    <script type="module" src="./frontend/utilities/common.js"></script>
                    <script type="module" src="./frontend/pages/error/error.js"></script>
                </body>
            </html>
        `;
    }
}