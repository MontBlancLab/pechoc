var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.end('Pecho un chocard, l\'agence matrimoniale des chorcards !');
});

app.get('/naissance', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.end('ici l\'oeuf');
});

app.get('/tinder', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Ici tinder');
});

app.listen(8080);