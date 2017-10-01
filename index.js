var port = 5000;
var path = require('path');
var express = require('express');
var app = express();

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var server = require('http').createServer(app);
var data  = {
	message : "",
	chocards : {}
};

var bdd_tinder = require('./data/fiche_chocards.js');
var bdd_profils = require('./data/profil_chocards.js');

//---------------------------------------------------------------------------
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(session({
//     store: new RedisStore(options),
//     secret: 'keyboard cat'
// }));
//app.set('trust proxy', 1) // trust first proxy

app.use(session({
  secret: 'chocards-cookie',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));
/*
{ 
//   		secure: false,
//   		code_profil: "",
//   		code_pecho: ""
//   	 }
*/

//app.use('/img', express.static(__dirname + '/img')); 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/css', express.static(__dirname + '/node_modules/jquery-ui/dist/css')); 
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts')); // redirect bootstrap JS

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

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