const Button = require('windlass').Components.Inputs.Button;
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
const Survey = require('windlass').Structures.Form.Survey;

function SignUpPage(isSurvey) {
    return DefaultTemplate({
        description: "Sign up page for the ValueTube website.",
        title: "ValueTube - Sign up",
        icon: "./frontend/img/ValueTube_Logogram.svg",
        linkedStylesheets: [
            "./frontend/fonts/font-awesome/css/all.min.css",
            "./frontend/css/style.css",
        ],
        linkedScripts: [
            "./frontend/utilities/common.js",
            "./frontend/pages/signUp/signUp.js",
        ],
        content: [
            Navbar(),
            Container({
                class: "full-width-container",
                content: [
                    Container({
                        class: "content-container signup",
                        content: isSurvey ? [
                            Container({
                                class: "sign-title",
                                content: Heading({
                                    variant: HEADING_VALUES.HEADING_2,
                                    content: "Sign up - Survey Questions",
                                }),
                            }),
                            Seperator(),
                            `<form class="survey-form">
                                ${Survey()}
                                <div class="btn-container">
                                ${Button({
                                    class: "primary left",
                                    actionDown: `window.location.href='./signup?survey'`,
                                    content: "Back",
                                })}
                                ${Button({
                                    class: "primary right",
                                    actionDown: `window.location.href='./success'`,
                                    content: "Create Account",
                                })}
                                </div>
                            </form>`,
                            Container({
                                class: "member-check",
                                content: `Already a member? ${Link({
                                    link: './signup',
                                    content: "Sign in",
                                })}`
                            }),
                        ].join("\n") : [
                            Container({
                                class: "sign-title",
                                content: [
                                    Heading({
                                        variant: HEADING_VALUES.HEADING_2,
                                        content: "Sign up to ValueTube",
                                    }),
                                    Button({
                                        class: "primary",
                                        content: `<i class="fab fa-google"></i> Sign up with Google`
                                    }),
                                ].join("\n"),
                            }),
                            Seperator(),
                            `<form class="signup-form">
                                <div class="username">
                                    <label for="username_signup">Username:</label>
                                    <input type="text" placeholder="Username" name="username_signup" required/>
                                </div>
                                <div class="email">
                                    <label for="email_signup">Email:</label>
                                    <input type="text" placeholder="Email" name="email_signup" required/>
                                </div>
                                <div class="password">
                                    <label for="password_signup">Password:</label>
                                    <input type="text" placeholder="Password" name="password_signup" required/>
                                </div>
                                <div class="confirm_password">
                                    <label for="confirm_password_signup">Confirm Password:</label>
                                    <input type="text" placeholder="Password" name="confirm_password_signup" required/>
                                </div>
                                <div class="btn-container center">
                                    ${Button({
                                        class: "primary",
                                        actionDown: `window.location.href='./signup?survey'`,
                                        content: "Next",
                                    })}
                                </div>
                            </form>`,
                            Container({
                                class: "member-check",
                                content: `Already a member? ${Link({
                                    link: './signup',
                                    content: "Sign in",
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
}

module.exports = { SignUpPage };
