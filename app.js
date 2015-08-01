var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

var exphbs = require('express-handlebars');

app.engine('.hbs', exphbs({extname: '.hbs'}));

app.set('view engine', '.hbs');

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
  console.log('log');
  next();
});

app.get('/', function(req, res){
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});