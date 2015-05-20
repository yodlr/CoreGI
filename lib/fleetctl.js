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

  var fleet = this;
  fleet.fc = new Fleetctl(config);
  fleet.canListMachines = true;
  fleet.canListUnits = true;
  fleet.canListUnitFiles = true;

  callback(null);
};

api.startCron = function startCron(callback) {
  var fleet = this;
  new CronJob('*/5 * * * * *', function() {
    if(fleet.canListMachines) {
      log.debug('canListMachines CronJob fired, making request');
      fleet.canListMachines = false;
      api.listMachines(function() {
        fleet.canListMachines = true;
      });
    }
    else {
      log.warn('canListMachines CronJob fired but last request still pending');
    }
  }, null, true);

  new CronJob('*/5 * * * * *', function() {
    if(fleet.canListUnits) {
      log.debug('canListUnits CronJob fired, making request');
      fleet.canListUnits = false;
      api.listUnits(function() {
        fleet.canListUnits = true;
      });
    }
    else {
      log.warn('canListUnits CronJob fired but last request still pending');
    }
  }, null, true);

  new CronJob('*/5 * * * * *', function() {
    if(fleet.canListUnitFiles) {
      log.debug('canListUnitFiles CronJob fired, making request');
      fleet.canListUnitFiles = false;
      api.listUnitFiles(function() {
        fleet.canListUnitFiles = true;
      });
    }
    else {
      log.warn('canListUnitFiles CronJob fired but last request still pending');
    }
  }, null, true);

  callback(null);
};

api.listMachines = function listMachines(callback) {
  var fleet = this;
  fleet.fc.list_machines(function(err, machines){
    if(err) {
      log.error({err: err}, 'Error - Fleetctl: listMachines');
      cache.del('machines');
    }
    else if(machines) {
      log.debug({data: machines}, 'Fleetctl: listMachines');
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
      cache.del('units');
    }
    else if(units) {
      log.debug({data: units}, 'Fleetctl: listUnits');
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
      cache.del('unitFiles');
    }
    else if(unitFiles) {
      log.debug({data: unitFiles}, 'Fleetctl: listUnitFiles');
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
    log.info({unit: unit.unit}, 'Fleetctl: start');
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
    log.info({unit: unit.unit}, 'Fleetctl: stop');
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
    log.info({unit: unit.unit}, 'Fleetctl: destroy');
    callback(null);
  });
};
