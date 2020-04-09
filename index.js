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

app.use('/', express.static('./'));

app.get('/', (req, res) => {
    const home = new HomePage();

    fs.readFile('./backend/data/temp_video_list.json', function read(err, data) {
        if (err) {
            throw err;
        }

        res.send(home.render(JSON.parse(data)));
    });

    return;
});

app.get('/watch', (req, res) => {
    if (req.query.v) {
        // --- NOTE: Make sure you do sanatise this input and error check it.
        fs.readFile('./backend/data/temp_video_list.json', function read(err, data) {
            if (err) {
                throw err;
            }

            const videos = JSON.parse(data);
            const metadata = videos.find((video) => {
                return (video.id == req.query.v);
            }).metadata;

            const watch = new WatchPage(metadata);
            res.send(watch.render());
            return;
        });

        /*execute(`"./backend/scripts/youtube-dl.exe" -j https://www.youtube.com/watch?v=` + req.query.v, function(videoMetadata){
            const watch = new WatchPage(JSON.parse(videoMetadata));
            res.send(watch.render());
            return;
        });*/
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