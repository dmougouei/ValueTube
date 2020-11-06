const {
    Button,
    TextInput,
    PasswordInput,
} = require('windlass').Components.Input;
const {
    METHOD_VALUES,
    Container,
    Seperator,
    Form,
} = require('windlass').Components.Layout;
const {
    HEADING_VALUES,
    Heading,
    Link,
} = require('windlass').Components.Typography;
const Navbar = require('windlass').Structures.Navbar;
const StickyHeaderTemplate = require('windlass').Templates.StickyHeader.StickyHeaderTemplate;

const SignUpPage = (errors) => {
    // Render invalid username error message
    let usernameError = "";
    try {
        usernameError = errors.filter((error) => (
            error.error == "That username is already taken."
        ))[0].error;
    } catch (e) {
        usernameError = "";
    }
    // Render invalid email error message
    let emailError = "";
    try {
        emailError = errors.filter((error) => (
            error.error == "Invalid email address."
        ))[0].error;
    } catch (e) {
        emailError = "";
    }
    // Render invalid password error message
    let passwordError = "";
    try {
        passwordError = errors.filter((error) => (
            error.error == "Password is not strong enough."
        ))[0].error;
    } catch (e) {
        passwordError = "";
    }
    // Render confirm password error message
    let confirmPasswordError = "";
    try {
        confirmPasswordError = errors.filter((error) => (
            error.error == "Password fields don't match."
        ))[0].error;
    } catch (e) {
        confirmPasswordError = "";
    }
    // Render SignUp Page
    return StickyHeaderTemplate({
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
        header: Navbar(),
        content: Container({
            class: "full-width-container",
            content: [
                Container({
                    class: "content-container signup",
                    content: [
                        Container({
                            class: "sign-title",
                            content: Heading({
                                variant: HEADING_VALUES.HEADING_2,
                                content: "Sign up to ValueTube",
                            }),
                        }),
                        Seperator(),
                        Form({
                            class: "signup-form",
                            method: METHOD_VALUES.POST,
                            action: "/signup",
                            content: [
                                TextInput({
                                    name: "email",
                                    placeholder: "example@email.com",
                                    required: true,
                                    label: "Email:",
                                    error: emailError,
                                }),
                                TextInput({
                                    name: "username",
                                    placeholder: "Username",
                                    required: true,
                                    label: "Username:",
                                    error: usernameError,
                                }),
                                PasswordInput({
                                    name: "password",
                                    placeholder: "Password",
                                    required: true,
                                    label: "Password:",
                                    error: passwordError,
                                }),
                                PasswordInput({
                                    name: "confirmPassword",
                                    placeholder: "Password",
                                    required: true,
                                    label: "Confirm Password:",
                                    error: confirmPasswordError,
                                }),
                                Container({
                                    class: "btn-container center",
                                    content: Button({
                                        class: "primary",
                                        content: "Sign Up",
                                    }),
                                }),
                            ].join("\n")
                        }),
                        Container({
                            class: "member-check",
                            content: `Already have an account? ${Link({
                                link: './signup',
                                content: "Sign in",
                            })}`
                        }),
                    ].join('\n'),
                }),
                Container({
                    class: "color-section primary-secondary half",
                }),
            ].join('\n'),
        }),
    });
}

module.exports = { SignUpPage };
