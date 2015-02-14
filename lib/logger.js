var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');

var prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

var config = {
  name: 'coregi',
  streams: [
    {
      level: 'debug',
      type: 'raw',
      stream: prettyStdOut
    },
    {
      type: 'file',
      level:'info',
      path: 'coregi.log'
    }
  ],
  serializers: bunyan.stdSerializers
};

module.exports = function() {
  return bunyan.createLogger(config);
};
