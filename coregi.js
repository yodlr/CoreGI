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
  var ui = this;

  if(!config) {
    callback(new Error('Cannot initialize CoreGI. No config provided'));
  }
  if(!config.fleetctl) {
    callback(new Error('Cannot initialize CoreGI. No fleetctl config provided'));
  }
  ui.config = config;

  ui.app = express();

  // view engine setup
  ui.app.set('views', path.join(__dirname, 'site/views'));
  //app.set('view engine', 'hbs');
  ui.app.set('view engine', 'html');
  ui.app.engine('html', require('hbs').__express);

  ui.app.use(favicon(__dirname + '/site/img/favicon.ico'));
  ui.app.use(bodyParser.json());
  ui.app.use(bodyParser.urlencoded({extended: true}));
  ui.app.use(cookieParser());
  ui.app.use(express.static(path.join(__dirname, 'site')));

  // set express port
  ui.app.set('port', process.env.PORT || 3000);

  // error handlers
  ui.app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

  // express routes
  ui.app.use('/', routes);

  // init modules
  async.waterfall([
    function(callback) {
      fleetctl.init(ui.config.fleetctl, callback);
    },
    function(callback) {
      etcd.init(ui.config.etcd, callback);
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
  var ui = this;

  // load modules
  async.waterfall([
    function(callback) {
      fleetctl.start(callback);
    },
    function(callback) {
      etcd.start(callback);
    },
    function(callback) {
      http.createServer(ui.app).listen(ui.app.get('port'), callback);
    },
    function(callback) {
      console.log('[CoreGI] Express server listening on port '+ui.app.get('port'));
    }
  ], function(err) {
    if(err) {
      console.log('Error: Starting CoreGI', err);
    }
  });
};
