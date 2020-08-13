const express = require('express');
const app = express();
const spdy = require('spdy');
const compression = require('compression');
const net = require('net');
const fs = require('fs');
// const {Pool} = require('pg');
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'ValueTubeUserInfo',
//     password: '',
//     port: '5432'
// });
const getVideoInfo = require("./backend/scripts/getVideoInfo");
const Pages = require("./frontend/pages");

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

let videoList = false;
fs.readFile('./backend/data/temp_video_list.json', (err, data) => {
    if (err) { throw err; }
    videoList = JSON.parse(data);
});

const renderError = (req, res) => {
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
        res.send(Pages.Error.ErrorPage());
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
        res.send(Pages.Home.HomePage({
            videos: videoList,
        }));
    }
    return;
});

app.get('/-', (req, res) => {
    if (videoList) {
        res.send(Pages.Home.HomePage({
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

        res.send(Pages.Watch.WatchPage({
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
    res.send(Pages.About.AboutPage());
    return;
});

app.get('/results', (req, res) => {
    if (videoList) {
        res.send(
            Pages.Results.ResultsPage({
                searchQuery: req.query.search_query,
                videos: videoList,
            })
        );
    }
    return;
});

app.get('/signin', (req, res) => {
    res.send(Pages.SignIn.SignInPage());
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


const ipAddr = 'localhost';
const PORT = 8080;


// Manage http and https
function tcpConnection(connection) {
    connection.once('data', function (buffer) {
        // A TLS handshake record starts with byte 22.
        let proxy = net.createConnection(
            (buffer[0] === 22) ? (PORT + 2) : (PORT + 1),
            () => {
                proxy.write(buffer);
                connection.pipe(proxy).pipe(connection);
            }
        );
    });
}

net.createServer(tcpConnection).listen(PORT);

// Run https server
spdy.createServer(options, app).listen((PORT + 2), error => {
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

httpServer.listen((PORT + 1));
