var port = 5000;
var path = require('path');
var express = require('express');
var app = express();

var server = require('http').createServer(app);
var data  = null;

//---------------------------------------------------------------------------
server.listen( port, function( ) {		
  console.log( 'it is listening at port %d', port );
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/img', express.static(__dirname + '/img')); 
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts')); // redirect bootstrap JS

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

app.get('/', function(req, res) {

	//var html = new EJS({url: 'index.ejs'}).render(data);
	res.render('index',data)

    //res.setHeader('Content-Type', 'text/html');
});

app.get('/naissance', function(req, res) {

	res.render('naissance',data)
	//var html = new EJS({url: 'naissance.ejs'}).render(data);
    //res.end('ici l\'oeuf');
});

app.get('/tinder', function(req, res) {

	res.render('tinder',data)
	//var html = new EJS({url: 'tinder.ejs'}).render(data);
 	//res.render('index', { data: data });

    //res.end('Ici tinder');
});

app.listen(8080);