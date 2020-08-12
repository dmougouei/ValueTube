const express = require('express');
const app = express();
const spdy = require('spdy');
const compression = require('compression')
const fs = require('fs');
// const {Pool} = require('pg');
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'ValueTubeUserInfo',
//     password: '',
//     port: '5432'
// });
const getVideoInfo = require("./backend/scripts/get_video_info");
const Pages = require("./frontend/pages")

const options = {
    key: fs.readFileSync('./keys/localhost.key'),
    cert: fs.readFileSync('./keys/localhost.crt')
}

const compress = (req, res) => {
    // don't compress responses asking explicitly not
    if (req.headers['x-no-compression']) {
      return false
    }
  
    // use compression filter function
    return compression.filter(req, res)
}

let videoList = false;
fs.readFile('./backend/data/temp_video_list.json', function read(err, data) {
    if (err) {
        throw err;
    }

    videoList = JSON.parse(data);
});

function renderError(req, res) {
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
        res.send(Pages.ErrorPage());
        return;
    }
  
    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
}

app.use('/', express.static('./'), compression({ filter: compress }));

app.get('/', (req, res) => {
    if (videoList) {
        res.send(Pages.HomePage({
            videos: videoList,
        }));
    }
    return;
});

app.get('/-', (req, res) => {
    if (videoList) {
        res.send(Pages.HomePage({
            loggedIn: true,
            videos: videoList,
        }));
    }
    return;
});

app.get('/watch', async (req, res) => {
    const validID = /[a-zA-Z0-9_-]{11}/;
    if (req.query.v && validID.test(req.query.v)) {
        const videoInfo = await getVideoInfo(req.query.v)
            .catch((err) => {
                console.error(err);
                renderError(req, res);
                return;
            });

        res.send(Pages.WatchPage({
            metadata: videoInfo.metadata,
            videos: videoList,
        }));
        return;
    } else {
        console.error("Error: Invalid video id");
        renderError(req, res);
        return;
    }
});

app.get('/about', (req, res) => {
    res.send(Pages.AboutPage());
    return;
});

app.get('/results', (req, res) => {
    if (videoList) {
        res.send(
            Pages.ResultsPage({
                searchQuery: req.query.search_query,
                videos: videoList,
            })
        );
    }
    return;
});

app.get('/signin', (req, res) => {
    const signin = new Pages.SignInPage();
    res.send(signin.render());
    return;
});

app.get('/signup', (req, res) => {
    if (req.query.survey != '') {
        res.send(Pages.SignUpPage(false));
    } else {
        res.send(Pages.SignUpPage(true));
    }
    return;
});

app.get('/success', (req, res) => {
    const success = new Pages.SuccessPage();
    res.send(success.render());
    return;
});

// 404 Page Not Found - Error Handling
app.get('*', (req, res) => {
    renderError(req, res);
});


const ipAddr = 'localhost';
const PORT = 8080;

spdy.createServer(options, app).listen(PORT, error => {
    if (error) {
      console.error(error)
      return process.exit(1)
    } else {
      console.log(`HTTP/2 server 'Running on https://${ipAddr}:${PORT}`)
    }
});

// Redirect http traffic to https
var httpServer = express();

httpServer.get('*', function(req, res) {  
    res.redirect(`https://${req.headers.host}${req.url}`);
})

httpServer.listen(80);
