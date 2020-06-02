const express = require('express');
const app = express();
const fs = require('fs');
var exec = require('child_process').exec;
const {Pool} = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ValueTubeUserInfo',
    password: '',
    port: '5432'
});

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

const HomePage = require('./frontend/pages/home/homePage.js');
const WatchPage = require("./frontend/pages/watch/watchPage.js");
const AboutPage = require('./frontend/pages/about/aboutPage.js');
const ErrorPage = require('./frontend/pages/error/errorPage.js');
const ResultsPage = require('./frontend/pages/results/resultsPage.js');
const LogInPage = require('./frontend/pages/login/loginPage.js');

let videoList = false;
fs.readFile('./backend/data/temp_video_list.json', function read(err, data) {
    if (err) {
        throw err;
    }

    videoList = JSON.parse(data);
});

app.use('/', express.static('./'));

app.get('/', (req, res) => {
    const home = new HomePage();
    if (videoList) {
        res.send(home.render(videoList));
    }
    return;
});

app.get('/watch', (req, res) => {
    if (req.query.v) {
        const metadata = videoList.find((video) => {
            return (video.id == req.query.v);
        }).metadata;

        const watch = new WatchPage(metadata);
        res.send(watch.render(videoList));
        return;
    } else {
        res.sendStatus(404);
        return;
    }
});

app.get('/about', (req, res) => {
    const about = new AboutPage();
    res.send(about.render());
    return;
});

app.get('/results', (req, res) => {
    const results = new ResultsPage(req.query.search_query);
    if (videoList) {
        res.send(results.render(videoList));
    }
    return;
});

app.get('/login', (req, res) => {
    const login = new LogInPage();
    res.send(login.render());
    return;
});

// 404 Page Not Found - Error Handling
app.get('*', (req, res) => {
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
        const error = new ErrorPage();
        res.send(error.render());
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


let ipAddr = 'localhost';

app.listen(8080);
console.log('Running on http://' + ipAddr + ':8080');