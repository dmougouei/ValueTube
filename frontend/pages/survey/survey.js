const NavBar = require("../../components/navBar/navBar.js");
const Button = require("../../components/button/button.js");

module.exports = class SurveyPage {
    constructor() { }
    
    render() {
        const navBar = new NavBar();
        const survey = new Button("Submit", "", "primary", "");

        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>ValueTube - Values Survey</title>
                    <link rel="icon" href="./frontend/img/ValueTube_Logogram.svg" />
                    <link rel="stylesheet" type="text/css" href="./frontend/fonts/font-awesome/css/all.min.css" />
                    <link rel="stylesheet" type="text/css" href="./frontend/css/style.css" />
                </head>
                <body>
                    ` + navBar.render() + `
                    <div class="survey-full-width-container">
                        <div style="display: inline-block" class="content-container">
                            <h2>Values Survey</h2>
                            <div class="survey separator"></div>
                            <form>
                            <br><p>I like choosing my own direction</p>
                            <input type="radio" class="surveyqs" name="surveyq1" value="1">
                            <label for="surveyq1">Agree</label>
                            <input type="radio" class="surveyqs" name="surveyq1" value="1">
                            <label for="surveyq2">Neutral</label>
                            <input type="radio" class="surveyqs" name="surveyq1" value="1">
                            <label for="surveyq3">Disagree</label>
                            <br><br><p>I want to be a successful person</p>
                            <input type="radio" class="surveyqs" name="surveyq2" value="1">
                            <label for="surveyq1">Agree</label>
                            <input type="radio" class="surveyqs" name="surveyq2" value="1">
                            <label for="surveyq2">Neutral</label>
                            <input type="radio" class="surveyqs" name="surveyq2" value="1">
                            <label for="surveyq3">Disagree</label>
                            <br><br><p>I feel anxious around people</p>
                            <input type="radio" class="surveyqs" name="surveyq3" value="1">
                            <label for="surveyq1">Agree</label>
                            <input type="radio" class="surveyqs" name="surveyq3" value="1">
                            <label for="surveyq2">Neutral</label>
                            <input type="radio" class="surveyqs" name="surveyq3" value="1">
                            <label for="surveyq3">Disagree</label>
                            <br><br><p>I am a nervous person</p>
                            <input type="radio" class="surveyqs" name="surveyq4" value="1">
                            <label for="surveyq1">Agree</label>
                            <input type="radio" class="surveyqs" name="surveyq4" value="1">
                            <label for="surveyq2">Neutral</label>
                            <input type="radio" class="surveyqs" name="surveyq4" value="1">
                            <label for="surveyq3">Disagree</label>
                            <br><br><p>My social status is important to me</p>
                            <input type="radio" class="surveyqs" name="surveyq5" value="1">
                            <label for="surveyq1">Agree</label>
                            <input type="radio" class="surveyqs" name="surveyq5" value="1">
                            <label for="surveyq2">Neutral</label>
                            <input type="radio" class="surveyqs" name="surveyq5" value="1">
                            <label for="surveyq3">Disagree</label>
                            <br><br><p>I crave novelty and excitement</p>
                            <input type="radio" class="surveyqs" name="surveyq6" value="1">
                            <label for="surveyq1">Agree</label>
                            <input type="radio" class="surveyqs" name="surveyq6" value="1">
                            <label for="surveyq2">Neutral</label>
                            <input type="radio" class="surveyqs" name="surveyq6" value="1">
                            <label for="surveyq3">Disagree</label>
                            <br><br><p>I value caring for others</p>
                            <input type="radio" class="surveyqs" name="surveyq7" value="1">
                            <label for="surveyq1">Agree</label>
                            <input type="radio" class="surveyqs" name="surveyq7" value="1">
                            <label for="surveyq2">Neutral</label>
                            <input type="radio" class="surveyqs" name="surveyq7" value="1">
                            <label for="surveyq3">Disagree</label>
                            <br><br><p>I often feel down</p>
                            <input type="radio" class="surveyqs" name="surveyq8" value="1">
                            <label for="surveyq1">Agree</label>
                            <input type="radio" class="surveyqs" name="surveyq8" value="1">
                            <label for="surveyq2">Neutral</label>
                            <input type="radio" class="surveyqs" name="surveyq8" value="1">
                            <label for="surveyq3">Disagree</label>
                            <br><br><p>I think tradition is important</p>
                            <input type="radio" class="surveyqs" name="surveyq9" value="1">
                            <label for="surveyq1">Agree</label>
                            <input type="radio" class="surveyqs" name="surveyq9" value="1">
                            <label for="surveyq2">Neutral</label>
                            <input type="radio" class="surveyqs" name="surveyq9" value="1">
                            <label for="surveyq3">Disagree</label>
                            <br><br><p>I am a sensitive person</p>
                            <input type="radio" class="surveyqs" name="surveyq9" value="1">
                            <label for="surveyq1">Agree</label>
                            <input type="radio" class="surveyqs" name="surveyq9" value="1">
                            <label for="surveyq2">Neutral</label>
                            <input type="radio" class="surveyqs" name="surveyq9" value="1">
                            <label for="surveyq3">Disagree</label><br><br><br>
                                ` + survey.render() + `
                            </form>
                        </div>
                        <div class="color-section primary-secondary parallax" data-speed="-32"></div>
                    </div>
                    <script type="module" src="./frontend/utilities/common.js"></script>
                    <script type="module" src="./frontend/pages/survey/survey.js"></script>
                </body>
            </html>
        `;
    }
}