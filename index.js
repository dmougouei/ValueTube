
const fs = require('fs');
const spdy = require('spdy');
const compression = require('compression');
const express = require('express');
const app = express();
const Pages = require("./frontend/pages");
const Backend = require('@vt/backend');

const options = {
    key: fs.readFileSync('./keys/dev/valuetube.tech.key'),
    cert: fs.readFileSync('./keys/dev/valuetube.tech.crt')
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

app.use('/', express.static('./'), compression({ filter: compress }));

app.get('/', async (req, res) => {
    try {
        // console.log(req.headers.cookie);
        // res.setHeader('Set-Cookie', ['authId=ABCDE123; Max-Age=1000'])
        res.send(await Pages.Home.HomePage());
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
            await Pages.About.AboutPage()
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
            })
        );
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.get('/signin', async (req, res) => {
    try {
        res.send(
            await Pages.SignIn.SignInPage()
        );
    } catch (err) {
        console.error(err);
        renderError(req, res);
    }
    return;
});

app.get('/signup', (req, res) => {
    if (req.query.survey != '') {
        res.send(Pages.SignUp.SignUpPage(false));
    } else {
        res.send(Pages.SignUp.SignUpPage(true));
    }
    return;
});

app.get('/success', (req, res) => {
    res.send(Pages.Success.SuccessPage());
    return;
});

// 404 Page Not Found - Error Handling
app.get('*', renderError);

// Run https server
spdy.createServer(options, app).listen(443, error => {
    if (error) {
        console.error(error)
    } else {
        console.log(`HTTP/2 server 'Running on https://localhost`)
    }
});

// Redirect http traffic to https
var httpServer = express();

httpServer.get('*', function (req, res) {
    res.redirect(`https://${req.headers.host}${req.url}`);
})

httpServer.listen(80);
