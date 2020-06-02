const NavBar = require("../../components/navBar/navBar.js");
const Card = require("../../components/card/card.js");

module.exports = class HomePage {
    constructor() {
        this.videos = false;
    }
    
    render(videos) {
        this.videos = videos;
        const navBar = new NavBar();
        let cardsHTML_1 = "";
        if (this.videos) {
            for (let i = 0; i < 8; i++) {
                const card = new Card(this.videos[i].metadata);
                cardsHTML_1 += card.render();
            }
        }
        let cardsHTML_2 = "";
        if (this.videos) {
            for (let i = 8; i < 30; i++) {
                const card = new Card(this.videos[i].metadata);
                cardsHTML_2 += card.render();
            }
        }
    
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
                    <div class="full-width-container">
                        <div class="grid-container mw-1300">
                            <h2>Recommended</h2>
                            <div class="seperator"></div>
                            <div class="grid-4">` +
                                cardsHTML_1
                            + `</div>
                            <div class="seperator"></div>
                            <div class="grid-4">` +
                                cardsHTML_2
                            + `</div>
                        </div>
                    <script type="module" src="./frontend/utilities/common.js"></script>
                    <script type="module" src="./frontend/pages/home/home.js"></script>
                </body>
            </html>
        `;
    }
}