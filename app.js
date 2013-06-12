
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    io = require('socket.io-client'),
    path = require('path');

var app = express();
var lastBBO = { bid : 0, ask : 0 };

// Point a socket to Mt. Gox's streaming API
var socket = io.connect('https://socketio.mtgox.com/mtgox');
socket.on('message', function(message) {
  if (message.channel_name == "ticker.BTCUSD") {
    lastBBO.bid = message.ticker.buy.value;
    lastBBO.ask = message.ticker.sell.value;
  }
});

// Open route to display in browser
app.get('/bbo.json', function(req, res) {
  res.json(lastBBO);
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
