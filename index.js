const fs = require('fs');
const spdy = require('spdy');
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const app = express();
const Pages = require("./frontend/pages");
const Backend = require('@vt/backend');
const ROOT_URL = require('@vt/vt_env').ROOT_URL;

const options = {
    key: fs.readFileSync('./keys/localhost.key'),
    cert: fs.readFileSync('./keys/localhost.crt')
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static('./'), compression({ filter: compress }));

app.get('/', async (req, res) => {
    try {
        res.send(
            await Pages.Home.HomePage({
                userData: await Backend.Utilities.Auth.authorise(req.headers.cookie)
            })
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
                    userData: Backend.Utilities.Auth.authorise(req.headers.cookie)
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
            await Pages.About.AboutPage({
                userData: Backend.Utilities.Auth.authorise(req.headers.cookie)
            })
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
            await Pages.Results.ResultsPage({
                searchQuery: req.query.search_query,
                userData: Backend.Utilities.Auth.authorise(req.headers.cookie)
            })
        );
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.get('/profile', async (req, res) => {
    try {
        Backend.Utilities.Auth.authorise(req.headers.cookie);
        res.redirect(`https://${ROOT_URL}`);
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.get('/image', async (req, res) => {
    try {
        const userData = Backend.Utilities.Auth.authorise(req.headers.cookie);
        res.send(getImage(userData.userId));
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.get('/signin', async (req, res) => {
    try {
        if (Backend.Utilities.Auth.authorise(req.headers.cookie)) {
            res.send(
                await Pages.SignIn.SignInPage()
            );
            // res.setHeader('Set-Cookie', [`${req.headers.cookie}; Max-Age=2678400; Secure; HttpOnly; SameSite=Strict;`]);
            // res.redirect(`https://${ROOT_URL}`);
        } else {
            res.send(
                await Pages.SignIn.SignInPage()
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
            .catch((e) => {
                res.send(e);
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
                await Pages.SignUp.SignUpPage({})
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
        Backend.Utilities.Auth.signUp(
            req.body.username,
            req.body.email,
            req.body.password,
            req.body.confirmPassword,
        ).then((result) => {
            res.setHeader('Set-Cookie', [`authToken=${result}; Max-Age=2678400; Secure; HttpOnly; SameSite=Strict;`]);
            res.redirect(`https://${ROOT_URL}/profile`);
        }).catch(async (error) => {
            res.send(await Pages.SignUp.SignUpPage({
                errors: error,
            }));
        });
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.post('/signout', async (req, res) => {
    try {
        res.setHeader('Set-Cookie', [`${req.headers.cookie}; Max-Age=-1; Secure; HttpOnly; SameSite=Strict;`]);
        res.redirect(`https://${ROOT_URL}`);
    } catch (error) {
        console.error(error);
        renderError(req, res);
    }
    return;
});

// 404 Page Not Found - Error Handling
app.get('*', renderError);

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
