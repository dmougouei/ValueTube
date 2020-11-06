const { Button, TextInput } = require("../../components").Input;
const { Container, Form } = require("../../components").Layout;

function Search() {
  return Container({
    class: "search",
    content: Container({
      class: "search-container",
      content: Form({
        class: "search-form",
        action: "./results",
        content: [
          TextInput({
            id: "search-input",
            class: "search-input",
            placeholder: "Search",
            name: "search_query",
            required: true,
          }),
          Button({
            class: "search-button",
            content: `<i class="fas fa-search"></i>`
          }),
        ].join(""),
      }),
    }),
  });
};

module.exports = Search;
