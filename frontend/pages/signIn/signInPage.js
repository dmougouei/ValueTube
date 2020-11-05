const Button = require('windlass').Components.Input.Button;
const {
    Container,
    Seperator
} = require('windlass').Components.Layout;
const {
    HEADING_VALUES,
    Heading,
    Link,
} = require('windlass').Components.Typography;
const Navbar = require('windlass').Structures.Navbar;
const DefaultTemplate = require('windlass').Templates.Default.DefaultTemplate;

function SignInPage(error) {
    // Render invalid username or password error message
    let signInError = "";
    try {
        signInError = 
            (error.error == "Invalid username or password.") ?
                `<div>${error.error}</div>` :
                "";
    } catch (e) {
        signInError = "";
    }
    return DefaultTemplate({
        description: "Sign in page for the ValueTube website.",
        title: "ValueTube - Sign in",
        icon: "./frontend/img/ValueTube_Logogram.svg",
        linkedStylesheets: [
            "./frontend/fonts/font-awesome/css/all.min.css",
            "./frontend/css/style.css",
        ],
        linkedScripts: [
            "./frontend/utilities/common.js",
        ],
        content: [
            Navbar(),
            Container({
                class: "full-width-container",
                content: [
                    Container({
                        class: "content-container signin",
                        content: [
                            Container({
                                class: "sign-title",
                                content: [
                                    Heading({
                                        variant: HEADING_VALUES.HEADING_2,
                                        content: "Sign in to ValueTube",
                                    }),
                                    Button({
                                        class: "primary",
                                        content: `<i class="fab fa-google"></i> Sign in with Google`
                                    }),
                                ].join("\n"),
                            }),
                            Seperator(),
                            `<form class="signin-form" method="POST" action="/signin">
                                <label for="username">Username:</label>
                                <input id="username" class="username" type="text" placeholder="Username" name="username" required/>
                                <label for="password">Password:</label>
                                <input id="username" class="password" type="password" placeholder="Password" name="password" required/>
                                ${signInError}
                                <div class="btn-container center">
                                    ${Button({
                                        class: "primary",
                                        content: "Sign In"
                                    })}
                                </div>
                            </form>
                            `,
                            Container({
                                class: "member-check",
                                content: `Not a member? ${Link({
                                    link: './signup',
                                    content: "Sign up now",
                                })}`
                            }),
                        ].join("\n"),
                    }),
                    Container({
                        class: "color-section primary-secondary half"
                    }),
                ].join("\n"),
            }),
        ].join("\n"),
    });
};

module.exports = { SignInPage };
