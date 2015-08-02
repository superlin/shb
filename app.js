var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

var exphbs = require('express-handlebars');
var cookieSession = require('cookie-session');

var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({ filename: 'data/search.log' })
    ]
 });
 
 var logger2 = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({ filename: 'data/pvuv.log' })
    ]
 });

app.engine('.hbs', exphbs({extname: '.hbs'}));

app.set('view engine', '.hbs');

app.use(express.static(__dirname + '/public'));

var pv = {};
var uv = {};

setInterval(function () {
  logger2.info(JSON.stringify(pv));
  logger2.info(JSON.stringify(uv));
}, 20*60*1000);

app.use(function (req, res, next) {
  var key = 'pv-' + new Date().toISOString().slice(0,13);
  var val = pv[key] || 0;
  pv[key] = val + 1;
  next();
});

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(function (req, res, next) {
  if (req.session.isNew) {
    var key = 'uv-' + new Date().toISOString().slice(0,13);
    var val = pv[key] || 0;
    uv[key] = val + 1;
  }
  next();
})

app.get('/', function(req, res){
  res.render('index');
});

app.get('/search', function(req, res){
  logger.info(req.query.txt, {ip: req.ip});
  res.send('ok');
});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});