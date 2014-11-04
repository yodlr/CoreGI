var coreosui = require('./coreosui');

var config = {
  fleetctl: {
    binary: process.env.FLEET_BINARY || '/usr/bin/fleetctl',
    endpoint: process.env.FLEET_ENDPOINT || 'http://172.17.42.1:4001'
  }
};

coreosui.init(config, function(err) {
  coreosui.start();
});
