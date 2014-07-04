argv = {};
lib = require('./lib');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connectAssets = require('connect-assets');

DAO = require('../lib/dao.js');
_ = require('underscore');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(connectAssets());
app.use(function(req,res,next){
	console.log(req.headers['user-agent']);
	next();
});

app.get('/', lib('mw/load_depth'), lib('mw/load_markets'), lib('mw/to_view')('markets'));
app.get('/arbs/:market', lib('mw/load_arbs'), lib('mw/to_view')('arbs'));
app.get('/depth/:market', lib('mw/load_depth'), lib('mw/to_view')('market_depth'));


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
app.use(function(err, req, res, next) {
		console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//module.exports = app;

//var debug = require('debug')('my-application');
//var app = require('../app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
