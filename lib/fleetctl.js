var async = require('async');
var cache = require('memory-cache');
var CronJob = require('cron').CronJob;
var Fleetctl = require('fleetctl');

var api = module.exports = {};

api.init = function init(config, callback) {
  if(!config) {
    callback(new Error('Cannot create fleetctl. No config provided'));
  }
  if(!config.binary) {
    callback(new Error('Cannot create fleetctl. No binary location provided'));
  }
  if(!config.endpoint) {
    callback(new Error('Cannot create fleetctl. No endpoint provided'));
  }

  var fleet = this;
  fleet.fc = new Fleetctl({
    binary: config.binary,
    endpoint: config.endpoint
  });

  callback(null);
};

api.start = function start(callback) {
  new CronJob('*/5 * * * * *', function() {
    api.listMachines();
  }, null, true);

  new CronJob('*/5 * * * * *', function() {
    api.listUnits();
  }, null, true);

  new CronJob('*/5 * * * * *', function() {
    api.listUnitFiles();
  }, null, true);

  callback(null);
};

api.listMachines = function listMachines() {
  var fleet = this;
  fleet.fc.list_machines(function(err, machines){
    if(err) {
      console.log('Error: machines', err);
    }
    cache.put('machines', machines);
  });
};

api.listUnits = function listUnits() {
  var fleet = this;
  fleet.fc.list_units(function(err, units){
    if(err) {
      console.log('Error: units', err);
    }
    cache.put('units', units);
  });
};

api.listUnitFiles = function listUnitFiles() {
  var fleet = this;
  fleet.fc.list_unit_files(function(err, unitFiles){
    if(err) {
      console.log('Error: unitFiles', err);
    }
    cache.put('unitFiles', unitFiles);
  });
};
