const Button = require("../../components").Input.Button;
const { Container } = require("../../components").Layout;
const { Text } = require("../../components").Typography;
const { Image } = require("../../components").Media;

function Menu(userData) {
  return [
    Button({
      class: "menu-button",
      actionDown: `document.toggleMenu();`,
      content: [
        Container({
          class: "profile_icon",
          content: Image({
            alt: `${userData.username} profile`,
            src: userData.profilePicture
              ? userData.profilePicture
              : "./frontend/img/default_profile.jpg"
          })
        }),
        Text({
          class: "username",
          content: userData.username,
        }),
        `<i class="fas fa-chevron-down"></i>`,
      ].join("\n"),
    }),
    Container({
      id: "menu",
      class: "menu",
      content: [
        Container({
          onclick: "window.location.href = './profile'",
          content: `<i class="fas fa-user-circle"></i>My Profile`,
        }),
        Container({
          class: "signout",
          onclick: "window.location.href = './signout'",
          content: `<i class="fas fa-sign-out-alt"></i>Sign Out`
        }),
      ].join("\n"),
    }),
  ].join("\n");
}

module.exports = Menu;
