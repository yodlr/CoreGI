var async = require('async');
var cache = require('memory-cache');
var CronJob = require('cron').CronJob;
var Etcd = require('node-etcd');

var api = module.exports = {};

api.init = function init(config, callback) {
  if(!config) {
    callback(new Error('Cannot create etcd. No config provided'));
  }
  if(!config.host) {
    callback(new Error('Cannot create etcd. No host provided'));
  }
  if(!config.port) {
    callback(new Error('Cannot create etcd. No port provided'));
  }

  var etcd = this;
  etcd.ec = new Etcd(config.host, config.port);
  etcd.cangetKeys = true;

  callback(null);
};

api.startCron = function startCron(callback) {
  var etcd = this;
  new CronJob('*/5 * * * * *', function() {
    if(etcd.cangetKeys) {
      etcd.cangetKeys = false;
      api.getKeys(function() {
        etcd.cangetKeys = true;
      });
    }
  }, null, true);

  callback(null);
};

api.getKeys = function getKeys(callback) {
  var etcd = this;
  etcd.ec.raw('GET', 'v2/keys/', null, {recursive: true}, function(err, keys) {
    if(err) {
      console.log('Error: getKeys', err);
    }
    if(keys && keys.node && keys.node.nodes) {
      cache.put('keys', keys.node.nodes);
    }
    callback(null);
  });
};
