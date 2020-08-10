const {
    Container,
} = require('windlass').Components.Layout;
const {
    Link,
} = require('windlass').Components.Typography;
const Search = require("../search/search.js");
const Button = require("../button/button.js");

module.exports = NavBar = (loggedIn) => {
    const search = new Search();
    const signInButton = new Button("Sign in", "outline caps", "primary", "./signin");
    const signUpButton = new Button("Sign up", "caps", "primary", "./signup");

    return Container({
        class: "nav-bar",
        content: [
            Container({
                class: "logo-container",
                content: `<img class="logo" alt="ValueTube Logo" src="./frontend/img/ValueTube_Logo.png" onclick="window.location.href = './'"></img>`,
            }),
            Container({
                id: "about",
                class: "nav-link",
                content:
                    Link({
                        link: "./about",
                        tabIndex: 0,
                        content: "About",
                    }),
            }),
            search.render(),
            loggedIn ? `
                <div class="profile_icon">
                    <img src="./frontend/img/team/default_profile.jpg" />
                </div>
            ` : `
                <div class="signin-container">
                ` + signInButton.render() +
                    signUpButton.render() + `
                </div>
            `,
        ].join("\n"),
    });
}
