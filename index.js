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

app.get('/watch', (req, res) => {
    if (req.query.v) {
        const metadata = videoList.find((video) => {
            return (video.id == req.query.v);
        }).metadata;

        const watch = new Pages.WatchPage(metadata);
        res.send(watch.render(videoList));
        return;
    } else {
        res.sendStatus(404);
        return;
    }
});

app.get('/about', (req, res) => {
    res.send(Pages.AboutPage());
    return;
});

app.get('/results', (req, res) => {
    const results = new Pages.ResultsPage(req.query.search_query);
    if (videoList) {
        res.send(results.render(videoList));
    }
    return;
});

app.get('/signin', (req, res) => {
    const signin = new Pages.SignInPage();
    res.send(signin.render());
    return;
});

app.get('/signup', (req, res) => {
    const signup = new Pages.SignUpPage();
        if (req.query.survey != '') {
            res.send(signup.render(false));
        } else {
            res.send(signup.render(true));
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
});


const ipAddr = 'localhost';
const PORT = 443;

spdy.createServer(options, app).listen(PORT, error => {
    if (error) {
      console.error(error)
      return process.exit(1)
    } else {
      console.log(`HTTP/2 server 'Running on https://` + ipAddr)
    }
});

// Redirect http traffic to https
var httpServer = express();

httpServer.get('*', function(req, res) {  
    res.redirect('https://' + req.headers.host + req.url);
})

httpServer.listen(80);
