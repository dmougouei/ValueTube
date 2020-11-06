const fs = require('fs');
const spdy = require('spdy');
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const app = express();
const Pages = require("./frontend/pages");
const Backend = require('@vt/backend');
const {
    ROOT_URL,
    CERT_ROUTE
} = require('@vt/vt_env');

const options = {
    key: fs.readFileSync(CERT_ROUTE.KEY),
    cert: fs.readFileSync(CERT_ROUTE.CERT)
};

const compress = (req, res) => {
    if (req.headers['x-no-compression']) {
        return false
    }
    return compression.filter(req, res)
};

const renderError = (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.send(Pages.Error.ErrorPage());
        return;
    }
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }
    res.type('txt').send('Not found');
}

const subfolders = (folder) => {
    return new RegExp(`${folder}\/?(?:[^\/]+\/?)*$`);
}

app.all('*', (req, res, next) => {
    if (
        ([
            "/frontend/css/style.css",
            "/",
            "/watch",
            "/about",
            "/results",
            "/profile",
            "/signin",
            "/signup",
            "/signout",
            "/error",
        ]).includes(req._parsedUrl.pathname) ||
        (subfolders("/frontend/fonts").test(req._parsedUrl.pathname)) ||
        (subfolders("/frontend/img").test(req._parsedUrl.pathname)) ||
        (subfolders("/frontend/utilities").test(req._parsedUrl.pathname))
    ) {
        next();
    } else {
        res.redirect(`https://${ROOT_URL}`);
    }
});
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use('/', express.static('./'), compression({ filter: compress }));

app.get('/', async (req, res) => {
    try {
        res.send(
            await Pages.Home.HomePage(
                await Backend.Utilities.Auth.authorise(req.headers.cookie)
            )
        );
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.get('/watch', async (req, res) => {
    try {
        if (Backend.Utilities.YouTube.validId(req.query.v)) {
            res.send(
                await Pages.Watch.WatchPage({
                    videoId: req.query.v,
                    userData: await Backend.Utilities.Auth.authorise(req.headers.cookie)
                })
            );
        } else {
            throw new Error("Error: Invalid video id");
        }
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.get('/about', async (req, res) => {
    try {
        res.send(
            await Pages.About.AboutPage(
                await Backend.Utilities.Auth.authorise(req.headers.cookie)
            )
        );
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.get('/results', async (req, res) => {
    try {
        res.send(
            await Pages.Results.ResultsPage(
                req.query.search_query,
                await Backend.Utilities.Auth.authorise(req.headers.cookie)
            )
        );
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.get('/profile', async (req, res) => {
    try {
        const profilePage = await Pages.Profile.ProfilePage(await Backend.Utilities.Auth.authorise(req.headers.cookie));
        if (profilePage) {
            res.send(profilePage);
        } else {
            res.redirect(`https://${ROOT_URL}`);
        }
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.post('/profile', async (req, res) => {
    try {
        const userData = await Backend.Utilities.Auth.authorise(req.headers.cookie);
        await Backend.Utilities.VTImage.uploadProfileImage(userData.userId, req.body.base64);
        userData = {
            profilePicture: await Backend.Utilities.VTImage.getProfileImage(userData.userId),
            ...userData,
        };
        if (userData) {
            res.send(
                Pages.Profile.ProfilePage(userData)
            );
        } else {
            res.redirect(`https://${ROOT_URL}`);
        }
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.get('/signin', async (req, res) => {
    try {
        if (await Backend.Utilities.Auth.authorise(req.headers.cookie)) {
            res.setHeader('Set-Cookie', [`authToken=${req.headers.cookie.split('=')[1]}; Max-Age=2678400; Secure; HttpOnly; SameSite=Strict;`]);
            res.redirect(`https://${ROOT_URL}`);
        } else {
            res.send(
                Pages.SignIn.SignInPage()
            );
        }
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.post('/signin', async (req, res) => {
    try {
        Backend.Utilities.Auth.signIn(req.body.username, req.body.password)
            .then((result) => {
                res.setHeader('Set-Cookie', [`authToken=${result}; Max-Age=2678400; Secure; HttpOnly; SameSite=Strict;`])
                res.redirect(`https://${ROOT_URL}`);
            })
            .catch((error) => {
                res.send(
                    Pages.SignIn.SignInPage(error)
                );
            });
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.get('/signup', async (req, res) => {
    try {
        if (await Backend.Utilities.Auth.authorise(req.headers.cookie)) {
            res.setHeader('Set-Cookie', [`authToken=${req.headers.cookie.split('=')[1]}; Max-Age=2678400; Secure; HttpOnly; SameSite=Strict;`]);
            res.redirect(`https://${ROOT_URL}`);
        } else {
            res.send(
                Pages.SignUp.SignUpPage()
            );
        }
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.post('/signup', async (req, res) => {
    try {
        await Backend.Utilities.Auth.signUp(
            req.body.username,
            req.body.email,
            req.body.password,
            req.body.confirmPassword,
        ).then((result) => {
            res.setHeader('Set-Cookie', [`authToken=${result}; Max-Age=2678400; Secure; HttpOnly; SameSite=Strict;`]);
            res.redirect(`https://${ROOT_URL}/profile`);
        }).catch((error) => {
            res.send(
                Pages.SignUp.SignUpPage(error)
            );
        });
    } catch (error) {
        console.error(error);
        renderError(req, res);
    }
    return;
});

app.get('/signout', async (req, res) => {
    try {
        res.setHeader('Set-Cookie', [`authToken=undefined; Max-Age=-1; Secure; HttpOnly; SameSite=Strict;`]);
        res.redirect(`https://${ROOT_URL}`);
    } catch (error) {
        console.error(error);
        renderError(req, res);
    }
    return;
});

// 404 Page Not Found - Error Handling
app.get('/error', renderError);


// Run https server
spdy.createServer(options, app).listen(443, error => {
    if (error) {
        console.error(error)
    } else {
        console.log(`HTTP/2 server 'Running on https://${ROOT_URL}`)
    }
});

// Redirect http traffic to https
var httpServer = express();

httpServer.get('*', function (req, res) {
    res.redirect(`https://${ROOT_URL}${req.url}`);
})

httpServer.listen(80);
