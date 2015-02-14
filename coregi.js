var async = require('async');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var etcd = require('./lib/etcd');
var fleetctl = require('./lib/fleetctl');
var favicon = require('serve-favicon');
var http = require('http');
var path = require('path');
var routes = require('./routes');

var coregi = module.exports = {};

coregi.init = function init(config, callback) {
  if(!config) {
    callback(new Error('Cannot initialize CoreGI. No config provided'));
  }
  if(!config.fleetctl) {
    callback(new Error('Cannot initialize CoreGI. No fleetctl config provided'));
  }
  coregi.config = config;

  coregi.app = express();

  // view engine setup
  coregi.app.set('views', path.join(__dirname, 'site/views'));
  //app.set('view engine', 'hbs');
  coregi.app.set('view engine', 'html');
  coregi.app.engine('html', require('hbs').__express);

  coregi.app.use(favicon(__dirname + '/site/img/favicon.ico'));
  coregi.app.use(bodyParser.json());
  coregi.app.use(bodyParser.urlencoded({extended: true}));
  coregi.app.use(cookieParser());
  coregi.app.use(express.static(path.join(__dirname, 'site')));

  // set express port
  coregi.app.set('port', process.env.PORT || 3000);

  // error handlers
  coregi.app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

  // express routes
  coregi.app.use('/', routes);

  // init modules
  async.waterfall([
    function(callback) {
      fleetctl.init(coregi.config.fleetctl, callback);
    },
    function(callback) {
      etcd.init(coregi.config.etcd, callback);
    }
  ], function(err) {
    if(err) {
      console.log('Error: Starting CoreGI', err);
      callback(new Error({err: err}, 'Error: Starting CoreGI'));
    }
    else {
      callback(null);
    }
  });
};

coregi.start = function start() {
  // load modules
  async.waterfall([
    function(callback) {
      fleetctl.startCron(callback);
    },
    function(callback) {
      etcd.startCron(callback);
    },
    function(callback) {
      http.createServer(coregi.app).listen(coregi.app.get('port'), callback);
    },
    function(callback) {
      console.log('[CoreGI] Express server listening on port '+coregi.app.get('port'));
    }
  ], function(err) {
    if(err) {
      console.log('Error: Starting CoreGI', err);
    }
  });
};
