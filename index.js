const express = require('express');
const app = express();

app.use('/', express.static('./'));

app.get('/', (req, res) => {
    res.redirect('./frontend/index.html');
});


let ipAddr = 'localhost';

app.listen(8080);
console.log('Running on http://' + ipAddr + ':8080');