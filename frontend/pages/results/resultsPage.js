const NavBar = require("../../components/navBar/navBar.js");
const ListItem = require("../../components/listItem/listItem.js");

module.exports = class ResultsPage {
    constructor(searchQuery) {
        this.searchQuery = searchQuery;
    }
   
    render(videos) {
        this.videos = videos;
        const navBar = new NavBar();
        let listHTML = "";
        if (this.videos.length != 0) {
            for (let i = 0; i < this.videos.length; i++) {
                const listItem = new ListItem(this.videos[i].metadata);
                listHTML += listItem.render();
            }
        } else {
            listHTML = `
                <div style="text-align: center;">
                    <h2>No results found.</h2>
                    <p>Try different keywords or remove search filters</p>
                </div>
            `;
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
                        <div class="list-container mw-1300">
                            <h2>Results for "<span id="searchQuery">` + encodeURI(this.searchQuery) + `</span>"</h2>
                            <div class="seperator"></div>
                            <div class="list">
                                ` + listHTML + `
                            </div>
                        </div>
                    </div>
                    <script type="module" src="./frontend/utilities/common.js"></script>
                    <script type="module" src="./frontend/pages/results/results.js"></script>
                </body>
            </html>
        `;
    }
}