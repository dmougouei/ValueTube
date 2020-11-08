const { Survey } = require('windlass/structures/form');
const Navbar = require('windlass').Structures.Navbar;
const { DISPLAY_VALUES } = require('windlass').Components.Default;
const { METHOD_VALUES, Container, Seperator, Form } = require('windlass').Components.Layout;
const { HEADING_VALUES, Heading } = require('windlass').Components.Typography;
const { Image } = require('windlass').Components.Media;
const { Button } = require('windlass').Components.Input;
const {
    SplitScreenTemplate,
} = require('windlass').Templates.SplitScreen;

const ProfilePage = async (userData) => {
    const data = await userData;
    if (data) {
        return SplitScreenTemplate({
            description: `Profile page for ${data.username} the ValueTube website.`,
            title: `ValueTube - Profile (${data.username})`,
            icon: "./frontend/img/ValueTube_Logogram.svg",
            linkedStylesheets: [
                "./frontend/fonts/font-awesome/css/all.min.css",
                "./frontend/css/style.css",
            ],
            linkedScripts: [
                "./frontend/utilities/common.js",
            ],
            header: Navbar(data),
            leftContent: Container({
                class: "full-width-container",
                content: Container({
                    class: "content-container signup",
                    content: [
                        Container({
                            class: "sign-title",
                            content: Heading({
                                variant: HEADING_VALUES.HEADING_2,
                                content: "Profile",
                            }),
                        }),
                        Seperator(),
                        Form({
                            class: "profile-picture-container",
                            action: "/profile",
                            method: METHOD_VALUES.POST,
                            onchange: "convertImage();",
                            content: [
                                Image({
                                    id: "profile-picture",
                                    class: "profile-picture",
                                    alt: `${data.username}'s profile picture`,
                                    src: data.profilePicture ? data.profilePicture : "./frontend/img/default_profile.jpg",
                                }),
                                `<canvas id="canvas" style="display: none;"></canvas>`,
                                `<input type="hidden" name="form" value="profile_picture" />`,
                                `<input id="base64" type="hidden" name="base64" />`,
                                `<input id="file-input" class="upload-profile-picture" type="file" style="display: none" />`,
                                Container({
                                    class: "button-container",
                                    content: [
                                        Button({
                                            class: "file-button",
                                            outline: true,
                                            actionDown: "browseFiles(event);",
                                            content: "Browse Files",
                                        }),
                                        Button({
                                            class: "upload-button",
                                            content: "Upload Image",
                                        }),
                                    ].join("\n"),
                                }),
                                `<script>
                                    function browseFiles(event) {
                                        event.preventDefault();
                                        document.getElementById("file-input").click();
                                    }

                                    function convertImage() {
                                        const fileInput = document.getElementById("file-input");
                                        if (fileInput.files && fileInput.files[0]) {
                                            const base64 = document.getElementById("base64");
                                            const FR = new FileReader();
                                            FR.addEventListener("load", (e) => {
                                                const img = new Image();
                                                img.onload = () => {
                                                    const canvas = document.getElementById("canvas");
                                                    const ctx = canvas.getContext("2d");
                                                    canvas.width = canvas.height = 400;
                                                    if (img.width > img.height) {
                                                        const scale = img.width/img.height;
                                                        const x0 = 200*(1 - scale);
                                                        ctx.drawImage(img, x0, 0, 400*scale, 400);
                                                    } else {
                                                        const scale = img.height/img.width;
                                                        const y0 = 200*(1 - scale);
                                                        ctx.drawImage(img, 0, y0, 400, 400*scale);
                                                    }
                                                    base64.value = canvas.toDataURL();
                                                    document.getElementById("profile-picture").src = base64.value;
                                                }
                                                img.src = e.target.result;
                                            });
                                            FR.readAsDataURL(fileInput.files[0]);
                                        }
                                    }
                                </script>`,
                            ].join("\n"),
                        }),
                        Seperator(),
                        Container({
                            class: "user-details",
                            content: [
                                Container({
                                    content: `Username: ${data.username}`,
                                }),
                                Container({
                                    content: `Email: ${data.email}`,
                                })
                            ].join("\n"),
                        }),
                        Seperator(),
                        Container({
                            class: "user-actions",
                            content: [
                                Container({
                                    onclick: "window.location.href = './signout'",
                                    content: `<i class="fas fa-sign-out-alt"></i> Sign Out`,
                                }),
                                Container({
                                    content: `<i class="fas fa-key"></i> Reset Password`,
                                }),
                                Container({
                                    content: `<i class="fas fa-user-slash"></i> Delete Account`,
                                }),
                            ].join("\n"),
                        }),
                    ].join("\n"),
                }),
            }),
            rightContent: Container({
                class: "full-width-container",
                content: Container({
                    class: "content-container signup",
                    content: await Survey(),
                }),
            }),
        });
    } else {
        return false;
    }
}

module.exports = { ProfilePage };
