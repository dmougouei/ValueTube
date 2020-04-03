const NavBar = require("../../components/navBar/navBar.js");

module.exports = class HomePage {
    constructor() {}
    
    render() {
        const navBar = new NavBar();
    
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>ValueTube</title>
                    <link rel="icon" href="./frontend/img/ValueTube_Logogram.svg">
                    <link rel="stylesheet" type="text/css" href="./frontend/css/style.css" />
                </head>
                <body>
                    ` + navBar.render() + `
                    <script type="module" src="./frontend/pages/home/home.js"></script>
                </body>
            </html>
        `;
    }
}