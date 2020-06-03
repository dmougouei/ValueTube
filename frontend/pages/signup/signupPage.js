const NavBar = require("../../components/navBar/navBar.js");
const Button = require("../../components/button/button.js");

module.exports = class SignUpPage {
    constructor() { }
    
    render() {
        const navBar = new NavBar();
        const googleSignUp = new Button(`<i class="fab fa-google"></i> Sign in with Google`, "", "primary", "");
        const createAccount = new Button("Create Account", "", "primary", "");

        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>ValueTube - About</title>
                    <link rel="icon" href="./frontend/img/ValueTube_Logogram.svg" />
                    <link rel="stylesheet" type="text/css" href="./frontend/fonts/font-awesome/css/all.min.css" />
                    <link rel="stylesheet" type="text/css" href="./frontend/css/style.css" />
                </head>
                <body>
                    ` + navBar.render() + `
                    <div class="full-width-container">
                        <div class="content-container">
                            <h2>Sign up to ValueTube</h2>
                            ` + googleSignUp.render() + `
                            <div class="seperator"></div>
                            <form>
                                <input id="name-signup-input" class="input" type="text" placeholder="Name" name="name_signup" required/>
                                <input id="username-signup-input" class="input" type="text" placeholder="Username" name="username_signup" required/>
                                <input id="email-signup-input" class="input" type="text" placeholder="Email" name="email_signup" required/>
                                <input id="password-signup-input" class="input" type="text" placeholder="Password" name="password_signup" required/>
                                ` + createAccount.render() + `
                            </form>
                            <div>Already a member?<a href="./login">Sign In</a></div>
                        </div>
                        <div class="color-section primary-secondary parallax" data-speed="-32"></div>
                    </div>
                    <script type="module" src="./frontend/utilities/common.js"></script>
                    <script type="module" src="./frontend/pages/login/login.js"></script>
                </body>
            </html>
        `;
    }
}