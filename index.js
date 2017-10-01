var port = 5000;
var path = require('path');
var express = require('express');
var app = express();

// var RedisStore = require('connect-redis')(session);

var cookieParser = require('cookie-parser')

var server = require('http').Server(app); //
var io = require('socket.io')(server);

var bdd_tinder = require('./data/fiche_chocards.js');
var bdd_profils = require('./data/profil_chocards.js');
var connect = require('connect');

//---------------------------------------------------------------------------

		var dataForTemplate  = {
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



server.listen(port, function() {
  console.log( 'it is listening at port %d', port );
  console.log(bdd_tinder.chocards.length + " chocards dans Tinder.");
  console.log(bdd_profils.profils.length + " chocards dans les profils.");
  // ajout des chocards aux data
  dataForTemplate.tinder_chocards = bdd_tinder.chocards;
  dataForTemplate.profils_chocards = bdd_profils.profils;
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

	socket.data = {};

	socket.on("login", function(data) {
		// We get all player's data
		var player = getPlayer(data.playerId);

		// We create player if he does not exists yet
		if (player == null) {
			console.log('#'+data.playerId+' a rejoint le jeu !');

			players.push({
				playerId: data.playerId
			});
			player = getPlayer(data.playerId);
		}

		// We set the player id to the current socket
		socket.data.playerId = player.playerId;

		promptPlayers();
  });

	/* * * * * * * * * *
	 *
	 * 	When a bird is taken by a player
	 *
	 */

	socket.on('chocardPecho', function(data) {
		// We get all player's data
		var player = getPlayer(socket.data.playerId);

		if (player != null) {
			console.log('#'+player.playerId+' a pécho un chocard : '+data.chocardPechoId);

			// We update birds database
			dataForTemplate.profils_chocards.forEach(function(profil) {
				if (profil.code == data.chocardPechoId) {
					profil.choisi = true;
				}
			});

			// We set the bird id of the player
			player.chocardPechoId = data.chocardPechoId;

			// We update the player with fresh data
			updatePlayer(player.playerId, player);

			// We tell everyone this bird is already taken (huh, losers!)
			io.sockets.emit('chocardPechoBySomeone', {
				chocardPechoId: data.chocardPechoId
			});
		}
	});

	socket.on('callToRefreshPlayersCookie', function() {
		console.log('refresh');
		players = [];
		io.sockets.emit('refreshPlayersCookie', {});
	});

	socket.on('refreshChocardsList', function() {
		// We update birds database
		dataForTemplate.profils_chocards.forEach(function(profil) {
			profil.choisi = false;
		});
	});

  socket.on("disconnect", function() {
		if (socket.data) {
		//	console.log('Socket Logout of player ' + socket.data.playerId);
		}
  });

});

function getPlayer(playerId) {
	var r = null;
	players.forEach(function(player) {
		if (player.playerId == playerId) r = player;
	});
	return r;
}

function updatePlayer(playerId, playerUpdated) {
	players.forEach(function(player, index) {
		if (player.playerId == playerId) {
			players[index] = playerUpdated;
		}
	});
}

function promptPlayers() {
	console.log('- - - - -');
	console.log(''+players.length+' player(s):');
	players.forEach(function(player) {
		console.log('#'+player.playerId);
		console.log(JSON.stringify(player, null, 4));
	});
	console.log('- - - - -');
}

app.get('/', function(req, res) {
	if ( req.param('message') != undefined ) {
			data.message = req.param('message'); // La bonne faille XHR !
		}
	res.render('index',{ data: dataForTemplate });
});

app.get('/naissance', function(req, res) {

  res.render('naissance',{ data: dataForTemplate });
});

app.get('/dedelavie', function(req, res) {
  res.render('dedelavie',{ data: dataForTemplate });
});

app.get('/admin', function(req, res) {
  res.render('admin',{ data: dataForTemplate });
});

app.get('/roulette', function(req, res) {

	res.render('roulette',{
		data: dataForTemplate
	});
});

app.get('/tinder', function(req, res) {

	res.render('tinder',{ data: dataForTemplate });
});

app.listen(8080);
