const Button = require("../../components").Input.Button;
const { Container } = require("../../components").Layout;
const { Link } = require("../../components").Typography;
const { Image } = require("../../components").Media;
const Search = require("../search");
const Menu = require("../menu");

function Navbar(userData) {
  return Container({
    class: "nav-bar",
    content: [
      Container({
        class: "logo-container",
        content: Image({
          class: "logo",
          alt: "ValueTube Logo",
          src: "./frontend/img/ValueTube_Logo.png",
          onclick: "window.location.href = './'"
        }),
      }),
      Container({
        id: "about",
        class: "nav-link",
        content: Link({
          link: "./about",
          tabIndex: 0,
          content: "About",
        }),
      }),
      Search(),
      Container({
        class: "signin-container",
        content: userData
          ? Menu(userData)
          : [
            Button({
              class: "primary",
              outline: true,
              caps: true,
              actionDown: `window.location.href='./signin'`,
              content: "Sign in",
            }),
            Button({
              class: "primary",
              caps: true,
              actionDown: `window.location.href='./signup'`,
              content: "Sign up",
            })
          ].join("\n")
      }),
    ].join("\n"),
  });
}

module.exports = Navbar;
