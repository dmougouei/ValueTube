const env = require('@vt/vt_env');
const fs = require('fs');
const spdy = require('spdy');
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const app = express();
const Pages = require("./frontend/pages");
const Pool = require('pg').Pool;
const pool = new Pool({
    user: env.AUTH.AUTH_USER,
    host: env.AUTH.AUTH_HOST,
    database: env.AUTH.AUTH_DATABASE,
    password: env.AUTH.AUTH_PASS,
    port: env.AUTH.AUTH_PORT
});
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

function filterValues(formData, value) {
    try {
        return Object.entries(formData, value)
            .filter((result) => {
                return (result[0].split('-')[0] == value) ? true : false;
            }).map((result) => {
                return +result[1]/6;
            }).reduce((acc, cur) => {
                return (acc/2) + (cur/2);
            });
    } catch (e) {
        return 0;
    }
    
}

app.post('/profile', async (req, res) => {
    try {
        const userData = await Backend.Utilities.Auth.authorise(req.headers.cookie);
        if (req.body.form == 'values_survey') {
            const self_direction = filterValues(req.body, "self_direction");
            const power = filterValues(req.body, "power");
            const universalism = filterValues(req.body, "universalism");
            const achievement = filterValues(req.body, "achievement");
            const security = filterValues(req.body, "security");
            const stimulation = filterValues(req.body, "stimulation");
            const conformity = filterValues(req.body, "conformity");
            const tradition = filterValues(req.body, "tradition");
            const hedonism = filterValues(req.body, "hedonism");
            const benevolence = filterValues(req.body, "benevolence");

            await pool.query(`
                INSERT INTO user_values(userid, valuesprofile)
                VALUES ($11, (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10
                )::values_matrix)
            `, [
                self_direction,
                stimulation,
                hedonism,
                achievement,
                power,
                security,
                tradition,
                conformity,
                benevolence,
                universalism,
                userData.userId,
            ], async (err, res) => {
                if (err) {
                    await pool.query(`
                        UPDATE user_values
                        SET valuesprofile = (
                            $1,
                            $2,
                            $3,
                            $4,
                            $5,
                            $6,
                            $7,
                            $8,
                            $9,
                            $10
                        )::values_matrix
                        WHERE userid = $11;
                    `, [
                        self_direction,
                        stimulation,
                        hedonism,
                        achievement,
                        power,
                        security,
                        tradition,
                        conformity,
                        benevolence,
                        universalism,
                        userData.userId,
                    ], (err, res) => {
                        if (err) {
                            console.error(err);
                        }
                        return;
                    });
                    return;
                }
            });
        } else if (req.body.form == 'profile_picture') {
            await Backend.Utilities.Image.uploadProfileImage(userData.userId, req.body.base64);
        }

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
