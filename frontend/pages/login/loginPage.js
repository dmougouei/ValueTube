const NavBar = require("../../components/navBar/navBar.js");
const Button = require("../../components/button/button.js");

module.exports = class LogInPage {
    constructor() { }
    
    render() {
        const navBar = new NavBar();
        const googleSignIn = new Button(`<i class="fab fa-google"></i> Sign in with Google`, "", "primary", "");
        const signIn = new Button("Sign In", "", "primary", "");

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
                            <h2>Sign in to ValueTube</h2>
                            ` + googleSignIn.render() + `
                            <div class="seperator"></div>
                            <form>
                                <input id="username-signin-input" class="input" type="text" placeholder="Username" name="username_signin" required/>
                                <input id="password-signin-input" class="input" type="text" placeholder="Password" name="password_signin" required/>
                                ` + signIn.render() + `
                            </form>
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