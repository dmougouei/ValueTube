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

const SignUpPage = (errors) => {
    // Render invalid username error message
    let usernameError = "";
    try {
        usernameError = errors.filter((error) => {
            return (error.error == "That username is already taken.");
        })[0].error;
    } catch (e) {
        usernameError = "";
    }
    // Render invalid email error message
    let emailError = "";
    try {
        emailError = `<div>${errors.filter((error) => (
            error.error == "Invalid email address."
        ))[0].error}</div>`;
    } catch (e) {
        emailError = "";
    }
    // Render invalid password error message
    let passwordError = "";
    try {
        passwordError = `<div>${errors.filter((error) => (
            error.error == "Password is not strong enough."
        ))[0].error}</div>`;
    } catch (e) {
        passwordError = "";
    }
    // Render confirm password error message
    let confirmPasswordError = "";
    try {
        confirmPasswordError = `<div>${errors.filter((error) => (
            error.error == "Password fields don't match."
        ))[0].error}</div>`;
    } catch (e) {
        confirmPasswordError = "";
    }
    // Render SignUp Page
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
        ],
        content: [
            Navbar(),
            Container({
                class: "full-width-container",
                content: [
                    Container({
                        class: "content-container signup",
                        content: [
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
                                ].join(''),
                            }),
                            Seperator(),
                            `<form class="signup-form" method="POST" action="/signup">
                                <div class="username">
                                    <label for="username">Username:</label>
                                    <input id="username" type="text" placeholder="Username" name="username" required/>
                                    ${usernameError}
                                </div>
                                <div class="email">
                                    <label for="email">Email:</label>
                                    <input id="email" type="text" placeholder="Email" name="email" required/>
                                    ${emailError}
                                </div>
                                <div class="password">
                                    <label for="password">Password:</label>
                                    <input id="password" type="password" placeholder="Password" name="password" required/>
                                    ${passwordError}
                                </div>
                                <div class="confirm_password">
                                    <label for="confirmPassword">Confirm Password:</label>
                                    <input name="confirmPassword" type="password" placeholder="Password" name="confirmPassword" required/>
                                    ${confirmPasswordError}
                                </div>
                                <div class="btn-container center">
                                    ${Button({
                                        class: "primary",
                                        content: "Sign Up",
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
                        ].join(''),
                    }),
                    Container({
                        class: "color-section primary-secondary half",
                    }),
                ].join(''),
            }),
        ].join(''),
    });
}

module.exports = { SignUpPage };
