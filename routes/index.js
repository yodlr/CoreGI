var cache = require('memory-cache');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {title: 'CoreGI'});
});

router.get('/api', function(req, res) {
  res.json({
    machines: 'Enumerate the current hosts in the cluster.',
    units: 'List the current state of units in the cluster.',
    unitFiles: 'List the units that exist in the cluster.'
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

router.get('/api/unitFiles', function(req, res) {
  var unitFiles = cache.get('unitFiles') || [];
  res.json(unitFiles);
});

router.get('/api/keys', function(req, res) {
  var keys = cache.get('keys') || [];
  res.json(keys);
});

module.exports = router;
