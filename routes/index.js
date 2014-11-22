var cache = require('memory-cache');
var express = require('express');
var fleetctl = require('../lib/fleetctl');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {title: 'CoreGI'});
});

router.get('/api', function(req, res) {
  res.json({
    machines: 'Enumerate the current hosts in the cluster.',
    units: 'List the current state of units in the cluster.',
    unitFiles: 'List the units that exist in the cluster.',
    start: 'Instruct systemd to start one or more units in the cluster, first submitting and loading if necessary.',
    stop: 'Instruct systemd to stop one or more units in the cluster.',
    destroy: 'Destroy one or more units in the cluster.'
  });
});

router.get('/api/machines', function(req, res) {
  var machines = cache.get('machines') || [];
  res.json(machines);
});

router.get('/api/units', function(req, res) {
  var units = cache.get('units') || [];
  res.json(units);
});

router.get('/api/units/:unit', function(req, res) {
  var units = cache.get('units') || [];
  var unit = {error: 'unit not found'};
  for(var index in units) {
    if(units[index].unit === req.params.unit) {
      unit = units[index];
      break;
    }
  }
  if(unit.error) {
    res.status(404).json(unit);
  }
  else {
    res.json(unit);
  }
});

router.put('/api/units/:unit', function(req, res) {
  if(req.params && req.query) {
    if(req.query.action === 'start') {
      fleetctl.start(req.params, function(err) {
        if(err) {
          res.status(400).json({error: 'error starting unit'});
        }
        else {
          res.status(200).end();
        }
      });
    }
    else if(req.query.action === 'stop') {
      fleetctl.stop(req.params, function(err) {
        if(err) {
          res.status(400).json({error: 'error stopping unit'});
        }
        else {
          res.status(200).end();
        }
      });
    }
    else {
      res.status(400).json({error: 'unknown action'});
    }
  }
  else {
    res.status(400).json({error: 'no unit provided'});
  }
});

router.delete('/api/units/:unit', function(req, res) {
  if(req.params && req.query) {
    fleetctl.destroy(req.params, function(err) {
      if(err) {
        res.status(400).json({error: 'error destroying unit'});
      }
      else {
        res.status(200).end();
      }
    });
  }
  else {
    res.status(400).json({error: 'no unit provided'});
  }
});

router.get('/api/unitFiles', function(req, res) {
  var unitFiles = cache.get('unitFiles') || [];
  res.json(unitFiles);
});

router.get('/api/keys', function(req, res) {
  var keys = cache.get('keys') || [];
  res.json(keys);
});

module.exports = router;
