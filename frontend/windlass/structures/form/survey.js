const {
  METHOD_VALUES,
  Form,
  Container,
  Seperator
} = require("../../components").Layout;
const {
  HEADING_VALUES,
  Heading,
  Text
} = require("../../components").Typography;
const {
  Button,
  RadioInput
} = require('../../components').Input;
const queryDatabase = require('@vt/backend').Utilities.Database.queryDatabase;

module.exports = async function SurveyQuestions() {
  let surveyQuestions = await queryDatabase(`
    SELECT * FROM questions;
  `)
  surveyQuestions = surveyQuestions.map((question) => {
    return {
      ...question,
      question_options: question.question_options
        .slice(3, -5)
        .split(`\\")","(`)
        .map((option) => {
          const optionArray = option.split(`,\\"`);
          return {
            index: optionArray[0],
            text: optionArray[1]
          }
        }),
    };
  })
  return Form({
    class: "survey-container",
    method: METHOD_VALUES.POST,
    action: "/profile",
    content: [
      Container({
        class: "sign-title",
        content: Heading({
            variant: HEADING_VALUES.HEADING_2,
            content: "Values Survey",
        }),
      }),
      Seperator(),
      `<input type="hidden" name="form" value="values_survey" />`,
      surveyQuestions.map((surveyQuestion, i) => {
        return Container({
          content: [
            Text({
              paragraph: true,
              content: surveyQuestion.question_text,
            }),
            Container({
              content: surveyQuestion.question_options.map((option) => {
                return RadioInput({
                  class: "radio-button",
                  name: `${surveyQuestion.value_attrib}-${option.index}`,
                  value: option.index,
                  label: option.text,
                });
              }).join("\n"),
            }),
            Seperator(),
          ].join("\n"),
        });
      }).join("\n"),
      Container({
        class: "btn-container center survey",
        content: Button({
            class: "primary",
            content: "Save",
        }),
      }),
    ].join("\n"),
  });
};
