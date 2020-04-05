const Media = require("../../components/media/media.js");
const NavBar = require("../../components/navBar/navBar.js");

module.exports = class WatchPage {
    constructor(metadata) {
        this.metadata = metadata;
        this.title = metadata.title;
    }
    
    render() {
        const media = new Media(this.metadata);
        const navBar = new NavBar();
    
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>` + this.title + `</title>
                    <link rel="icon" href="./frontend/img/ValueTube_Logogram.svg" />
                    <link rel="stylesheet" type="text/css" href="./frontend/fonts/font-awesome/css/all.min.css" />
                    <link rel="stylesheet" type="text/css" href="./frontend/css/style.css" />
                </head>
                <body>
                    ` + navBar.render()
                      + media.render() + `
                    <script type="module" src="./frontend/utilities/common.js"></script>
                    <script type="module" src="./frontend/pages/watch/watch.js"></script>
                </body>
            </html>
        `;
    }
}