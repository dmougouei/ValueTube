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
const {
    SecurityHelpers,
    TypeHelpers,
} = require('windlass').Utilities.Server;
const Navbar = require('windlass').Structures.Navbar;
const DefaultTemplate = require('windlass').Templates.Default.DefaultTemplate;
const Survey = require('windlass').Structures.Form.Survey;

class SIGNUP_PAGE_PROPERTIES {
    constructor(props) {
        // errors
        TypeHelpers.typeCheckPrimative(
            this,
            props,
            "errors",
            TypeHelpers.PRIMATIVES.ARRAY,
            undefined,
            props.errors,
        );
    }
}

const SignUpPage = async (props) => {
    try {
        if (typeof props === "object" || props instanceof Object) {
            props instanceof SIGNUP_PAGE_PROPERTIES
                ? (this.props = props)
                : (this.props = new SIGNUP_PAGE_PROPERTIES(props));
            const usernameError = `<div>${this.props.errors.filter((error) => (
                error.error == "The username user is already taken."
            ))[0].error}</div>`;
            const emailError = `<div>${this.props.errors.filter((error) => (
                error.error == "Invalid email address."
            ))[0].error}</div>`;
            const passwordError = `<div>${this.props.errors.filter((error) => (
                error.error == "Password is not strong enough."
            ))[0].error}</div>`;
            const confirmPasswordError = `<div>${this.props.errors.filter((error) => (
                    error.error == "Password fields don't match."
                ))[0].error}</div>`;
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
                                        ].join("\n"),
                                    }),
                                    Seperator(),
                                    `<form class="signup-form" method="POST" action="/signup">
                                        <div class="username">
                                            <label for="username">Username:</label>
                                            <input id="username" type="text" placeholder="Username" name="username" required/>
                                        </div>
                                        <div class="email">
                                            <label for="email">Email:</label>
                                            <input id="email" type="text" placeholder="Email" name="email" required/>
                                        </div>
                                        <div class="password">
                                            <label for="password">Password:</label>
                                            <input id="password" type="password" placeholder="Password" name="password" required/>
                                        </div>
                                        <div class="confirm_password">
                                            <label for="confirmPassword">Confirm Password:</label>
                                            <input name="confirmPassword" type="password" placeholder="Password" name="confirmPassword" required/>
                                        </div>
                                        <div class="btn-container center">
                                            ${Button({
                                                class: "primary",
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
        } else {
          throw new TypeError(`${props} on SignUpPage is not a valid Object type.`);
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = { SignUpPage };
