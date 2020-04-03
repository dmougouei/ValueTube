const Search = require("../search/search.js");
const Button = require("../button/button.js");

module.exports = class NavBar {
    constructor() {
    }
    
    render() {
        const search = new Search();
        const loginButton = new Button("Log in", "round outline caps", "primary", "./login");
        const signupButton = new Button("Sign up", "round caps", "primary", "./signup");

        return `
            <div class="nav-bar small">
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