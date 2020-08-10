const NavBar = require("../../components/navBar/navBar.js");
const Button = require("../../components/button/button.js");

module.exports = class SignInPage {
    constructor() { }
    
    render() {
        const googleSignIn = new Button(`<i class="fab fa-google"></i> Sign in with Google`, "", "primary", "");
        const signIn = new Button("Sign In", "", "primary", "./-");

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
                    ${NavBar()}
                    <div class="full-width-container">
                        <div class="content-container signin">
                            <div class="sign-title">
                                <h2>Sign in to ValueTube</h2>
                                ` + googleSignIn.render() + `
                            </div>
                            <div class="seperator"></div>
                            <form class="signin-form">
                                <label for="username_signin">Username:</label>
                                <input class="username" type="text" placeholder="Username" name="username_signin" required/>
                                <label for="password_signin">Password:</label>
                                <input class="password" type="text" placeholder="Password" name="password_signin" required/>
                                <div class="btn-container center">
                                    ` + signIn.render() + `
                                </div>
                            </form>
                            <div class="member-check">Not a member? <a href="./signup">Sign up now</a></div>
                        </div>
                        <div class="color-section primary-secondary half"></div>
                    </div>
                    <script type="module" src="./frontend/utilities/common.js"></script>
                    <script type="module" src="./frontend/pages/signin/signIn.js"></script>
                </body>
            </html>
        `;
    }
}
