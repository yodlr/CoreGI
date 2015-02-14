var async = require('async');
var cache = require('memory-cache');
var CronJob = require('cron').CronJob;
var Fleetctl = require('fleetctl');
var log = require('./logger')();

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
  fleet.canListMachines = true;
  fleet.canListUnits = true;
  fleet.canListUnitFiles = true;

  callback(null);
};

api.startCron = function startCron(callback) {
  var fleet = this;
  new CronJob('*/5 * * * * *', function() {
    if(fleet.canListMachines) {
      fleet.canListMachines = false;
      api.listMachines(function() {
        fleet.canListMachines = true;
      });
    }
  }, null, true);

  new CronJob('*/5 * * * * *', function() {
    if(fleet.canListUnits) {
      fleet.canListUnits = false;
      api.listUnits(function() {
        fleet.canListUnits = true;
      });
    }
  }, null, true);

  new CronJob('*/5 * * * * *', function() {
    if(fleet.canListUnitFiles) {
      fleet.canListUnitFiles = false;
      api.listUnitFiles(function() {
        fleet.canListUnitFiles = true;
      });
    }
  }, null, true);

  callback(null);
};

api.listMachines = function listMachines(callback) {
  var fleet = this;
  fleet.fc.list_machines(function(err, machines){
    if(err) {
      log.error({err: err}, 'Error - Fleetctl: listMachines');
    }
    if(machines) {
      log.debug({data: machines}, 'Etcd: listMachines');
      cache.put('machines', machines);
    }
    callback(null);
  });
};

api.listUnits = function listUnits(callback) {
  var fleet = this;
  fleet.fc.list_units(function(err, units){
    if(err) {
      log.error({err: err}, 'Error - Fleetctl: listUnits');
    }
    if(units) {
      log.debug({data: units}, 'Etcd: listUnits');
      cache.put('units', units);
    }
    callback(null);
  });
};

api.listUnitFiles = function listUnitFiles(callback) {
  var fleet = this;
  fleet.fc.list_unit_files(function(err, unitFiles){
    if(err) {
      log.error({err: err}, 'Error - Fleetctl: listUnitFiles');
    }
    if(unitFiles) {
      log.debug({data: unitFiles}, 'Etcd: listUnitFiles');
      cache.put('unitFiles', unitFiles);
    }
    callback(null);
  });
};

api.start = function start(unit, callback) {
  var fleet = this;
  if(!unit) {
    return callback('Error: no unit provided');
  }
  fleet.fc.start(unit.unit, {}, function(err) {
    if(err) {
      log.error({err: err, unit: unit.unit}, 'Error - Fleetctl: start');
    }
    log.debug({unit: unit.unit}, 'Etcd: start');
    callback(null);
  });
};

api.stop = function stop(unit, callback) {
  var fleet = this;
  if(!unit) {
    return callback('Error: no unit provided');
  }
  fleet.fc.stop(unit.unit, {}, function(err) {
    if(err) {
      log.error({err: err, unit: unit.unit}, 'Error - Fleetctl: stop');
    }
    log.debug({unit: unit.unit}, 'Etcd: stop');
    callback(null);
  });
};

api.destroy = function destroy(unit, callback) {
  var fleet = this;
  if(!unit) {
    return callback('Error: no unit provided');
  }
  fleet.fc.destroy(unit.unit, function(err) {
    if(err) {
      log.error({err: err, unit: unit.unit}, 'Error - Fleetctl: destroy');
    }
    log.debug({unit: unit.unit}, 'Etcd: destroy');
    callback(null);
  });
};
