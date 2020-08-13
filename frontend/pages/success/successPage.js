const Navbar = require('windlass').Structures.Navbar;

class SuccessPage {
    constructor() {}
    
    render() {
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>ValueTube</title>
                    <link rel="icon" href="./frontend/img/ValueTube_Logogram.svg" />
                    <link rel="stylesheet" type="text/css" href="./frontend/fonts/font-awesome/css/all.min.css" />
                    <link rel="stylesheet" type="text/css" href="./frontend/css/style.css" />
                </head>
                <body>
                    ${Navbar()}
                    <div style="text-align: center;">
                        <h1>Successfully Signed Up</h1>
                        <p>Yay, thankyou for signing up to ValueTube.</p>
                        <p>We we will redirect you to the home page in a couple seconds.</p>
                        <p>If you are not automatically redirected, please click <a href="./-">here</a>.</p>
                    </div>
                    <script type="module" src="./frontend/utilities/common.js"></script>
                    <script type="module" src="./frontend/pages/success/success.js"></script>
                </body>
            </html>
        `;
    }
}

module.exports = { SuccessPage };
