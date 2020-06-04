const NavBar = require("../../components/navBar/navBar.js");
const Button = require("../../components/button/button.js");
const SurveyQuestions = require("../../components/survey/survey.js");

module.exports = class SignUpPage {
    constructor() { }
    
    render(isSurvey) {
        const navBar = new NavBar();

        const surveyQuestions = new SurveyQuestions();

        const googleSignUp = new Button(`<i class="fab fa-google"></i> Sign in with Google`, "", "primary", "");
        const nextStep = new Button("Next", "", "primary", "./signup?survey");
        const previousStep = new Button("Back", "", "primary left", "./signup");
        const createAccount = new Button("Create Account", "right", "primary", "./success");

        let signUpPageHTML = ``;
        if (!isSurvey) {
            signUpPageHTML = `
                <div class="sign-title">
                    <h2 class>Sign up to ValueTube</h2>
                    ` + googleSignUp.render() + `
                </div>
                <div class="seperator"></div>
                <form class="signup-form">
                    <div class="name">
                        <label for="name_signup">Name:</label>
                        <input type="text" placeholder="Name" name="name_signup" required/>
                    </div>
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
                    <div class="btn-container center">
                        ` + nextStep.render() + `
                    </div>
                </form>
            `;
        } else {
            signUpPageHTML = `
                <div class="sign-title">
                    <h2>Sign up - Survey Questions</h2>
                </div>
                <div class="seperator"></div>
                <form class="survey-form">
                    ` + surveyQuestions.render() + `
                    <div class="btn-container">
                    ` + previousStep.render() + createAccount.render() + `
                    </div>
                </form>
            `;
        }

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
                        <div class="content-container signup">
                            ` + signUpPageHTML + `
                            <div class="member-check">Already a member? <a href="./signin">Sign In</a></div>
                        </div>
                        <div class="color-section primary-secondary half"></div>
                    </div>
                    <script type="module" src="./frontend/utilities/common.js"></script>
                    <script type="module" src="./frontend/pages/signUp/signUp.js"></script>
                </body>
            </html>
        `;
    }
}