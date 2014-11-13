var coregi = require('./coregi');

var config = {
  fleetctl: {
    binary: process.env.FLEET_BINARY || '/usr/bin/fleetctl',
    endpoint: process.env.FLEET_ENDPOINT || 'http://172.17.42.1:4001'
  },
  etcd: {
    host: process.env.ETCD_HOST || '172.17.42.1',
    port: process.env.ETCD_PORT || 4001
  }
};

coregi.init(config, function(err) {
  coregi.start();
});
