const { METHOD_VALUES, Form, Container, Seperator } = require("../../components").Layout;
const Text = require("../../components").Typography.Text;
const queryDatabase = require('@vt/backend').Utilities.Database.queryDatabase;


function SurveyRadioButtons(questionNumber) {
  return `<input type="radio" class="radio-button" name="surveyQ${questionNumber}"/>
    <label class="radio-button" for=surveyQ${questionNumber}">Very much like me</label>
    <input type="radio" class="radio-button" name="surveyQ${questionNumber}" checked/>
    <label class="radio-button" for=surveyQ${questionNumber}">Like me</label>
    <input type="radio" class="radio-button" name="surveyQ${questionNumber}"/>
    <label class="radio-button" for=surveyQ${questionNumber}">Somewhat like me</label>
    <input type="radio" class="radio-button" name="surveyQ${questionNumber}" checked/>
    <label class="radio-button" for=surveyQ${questionNumber}">A little like me</label>
    <input type="radio" class="radio-button" name="surveyQ${questionNumber}" checked/>
    <label class="radio-button" for=surveyQ${questionNumber}">Not like me</label>
    <input type="radio" class="radio-button" name="surveyQ${questionNumber}" checked/>
    <label class="radio-button" for=surveyQ${questionNumber}">Not like me at all</label>
    <input type="radio" class="radio-button" name="surveyQ${questionNumber}" checked/>
    <label class="radio-button" for=surveyQ${questionNumber}">Don’t know</label>`;
}

module.exports = async function SurveyQuestions() {
  const surveyQuestions = await queryDatabase(`
    SELECT * FROM questions;
  `);
  return Form({
    class: "survey-container",
    method: METHOD_VALUES.POST,
    action: "./profile",
    content: surveyQuestions.map((surveyQuestion) => {
      return Container({
        content: [
          Text({
            paragraph: true,
            content: surveyQuestion.question_text,
          }),
          SurveyRadioButtons(surveyQuestion.question_id),
          Seperator(),
        ].join("\n"),
      });
    }).join("\n"),
  });
};
