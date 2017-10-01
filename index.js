var port = 5000;
var path = require('path');
var express = require('express');
var app = express();

// var RedisStore = require('connect-redis')(session);

var cookieParser = require('cookie-parser')

var server = require('http').Server(app);
var io = require('socket.io')(server);

var bdd_tinder = require('./data/fiche_chocards.js');
var bdd_profils = require('./data/profil_chocards.js');
var connect = require('connect');

//---------------------------------------------------------------------------

		var data  = {
			message : "",
			chocards : {}
		};

//---------------------------------------------------------------------------



var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");

app.use(session);

io.use(sharedsession(session, {
  autoSave:true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
app.use(express.bodyParser());
app.use(express.cookieParser('secret text'));
app.use(express.session({
    store: sessionStore,
    secret: 'secret',
    key: 'express.sid'}
));
*/

//app.use('/img', express.static(__dirname + '/img'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/public/js', express.static(__dirname + '/public/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/css', express.static(__dirname + '/node_modules/jquery-ui/dist/css')); 
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts')); // redirect bootstrap JS



server.listen( port, function() {
  console.log( 'it is listening at port %d', port );
  console.log(bdd_tinder.chocards.length + " chocards dans Tinder.");
  console.log(bdd_profils.profils.length + " chocards dans les profils.");
  // ajout des chocards aux data
  data.tinder_chocards = bdd_tinder.chocards;
  data.profils_chocards = bdd_profils.profils;
  // for(var i=0; i < data.chocards.length; i++) {
  // 	  console.log(data.chocards[i].code);
  // }

});
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

var players = [];

io.on('connection', function (socket) {

  socket.emit('news', { hello: 'world' });

  socket.on('my other event', function (data) {
    console.log(data);
  });

	socket.on("login", function(data) {

		console.log('Socket length before push:'+players.length);

		socket.playerId = data.playerId;
		players.push(socket);

		console.log('Socket Login of player ' + socket.playerId);

		console.log('-----');
		console.log('Sockets list of '+players.length+' player(s):');
		players.forEach(function(player) {
			console.log('#'+player.playerId);
		});
		console.log('-----');
  });

  socket.on("disconnect", function() {
		console.log('Socket Logout of player ' + socket.playerId);
		var i = players.indexOf(socket);
		if (i != -1) {
			players.splice(i, 1);
		}
  });

});

app.get('/', function(req, res) {
	if ( req.param('message') != undefined ) {
			data.message = req.param('message'); // La bonne faille XHR !
		}
	res.render('index',{ data: data });
});

app.get('/naissance', function(req, res) {

  res.render('naissance',{ data: data });
});

app.get('/dedelavie', function(req, res) {

  res.render('dedelavie',{ data: data });
});

app.get('/roulette', function(req, res) {

	res.render('roulette',{ data: data });
});

app.get('/tinder', function(req, res) {

	res.render('tinder',{ data: data });
});

app.listen(8080);
