const Search = require("../search/search.js");
const Button = require("../button/button.js");

module.exports = class NavBar {
    constructor(searchQuery) { }
    
    render() {
        const search = new Search();
        const loginButton = new Button("Log in", "outline caps", "primary", "./login");
        const signupButton = new Button("Sign up", "caps", "primary", "./signup");

        return `
            <div class="nav-bar">
                <div class="logo-container">
                    <img class="logo" src="./frontend/img/ValueTube_Logo.svg" onclick="window.location.href = './'"></img>
                </div>
                <div id="about" class="nav-link" onclick="window.location.href = './about'">About</div>
                ` + search.render() + `
                <div class="login-container">
                ` + loginButton.render() +
                    signupButton.render() + `
                </div>
            </div>
        `;
    }
}