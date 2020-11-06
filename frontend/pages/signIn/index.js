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
    Text,
} = require('windlass').Components.Typography;
const Navbar = require('windlass').Structures.Navbar;
const StickyHeaderTemplate = require('windlass').Templates.StickyHeader.StickyHeaderTemplate;

function SignInPage(error) {
    // Render invalid username or password error message
    let signInError = "";
    try {
        signInError = 
            (error.error == "Invalid username or password.") ?
                error.error :
                "";
    } catch (e) {
        signInError = "";
    }
    return StickyHeaderTemplate({
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
        header: Navbar(),
        content: Container({
            class: "full-width-container",
            content: [
                Container({
                    class: "content-container signin",
                    content: [
                        Container({
                            class: "sign-title",
                            content: Heading({
                                variant: HEADING_VALUES.HEADING_2,
                                content: "Sign in to ValueTube",
                            }),
                        }),
                        Seperator(),
                        Form({
                            class: "signin-form",
                            method: METHOD_VALUES.POST,
                            action: "/signin",
                            content: [
                                TextInput({
                                    name: "username",
                                    placeholder: "Username",
                                    required: true,
                                    label: "Username:",
                                }),
                                PasswordInput({
                                    name: "password",
                                    placeholder: "Password",
                                    required: true,
                                    label: "Password:",
                                    error: signInError,
                                }),
                                Container({
                                    class: "btn-container center",
                                    content: Button({
                                        class: "primary",
                                        content: "Sign In"
                                    }),
                                }),
                            ].join("\n"),
                        }),
                        Container({
                            class: "member-check",
                            content: [
                                Text({
                                    content: `Forgot your ${Link({
                                        link: './reset',
                                        content: "Password",
                                    })}?`
                                }),
                                " - ",
                                Text({
                                    content: `Not a member? ${Link({
                                        link: './signup',
                                        content: "Sign up now",
                                    })}`
                                }),
                            ].join("\n")
                        }),
                    ].join("\n"),
                }),
                Container({
                    class: "color-section primary-secondary half"
                }),
            ].join("\n"),
        }),
    });
};

module.exports = { SignInPage };
