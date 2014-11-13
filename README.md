CoreGI
=========

WebUI for monitoring CoreOS clusters including fleet and etcd

![CoreGI](https://raw.githubusercontent.com/astilabs/CoreGI/master/site/img/coregi_logo.png)

### What is CoreGI

CoreGI came out of our need for a one-stop dashboard for viewing the status of the applications running in our CoreOS clusters, monitoring etcd keys, and managing rolling software updates. We're pro cli-tools, but have found that simple web-apps provide improved visibility into complex systems.

### CoreGI runs in CoreOS

CoreGI is created to be as simple as possible and deploying CoreGI is as easy as running a docker container. CoreGI can also be installed into a __CoreOS cluster__ using a CoreOS service file. Take a look at our CoreOS [service file][coregi_service] for an example. CoreGI can also be ran as an application using Node.js by using environment variables to change the default options, see [Getting Started](#getting-started).

### Getting Started

##### CoreOS

```
$ fleetctl submit services/coregi.service
$ fleetctl start coregi.service
```

CoreGI will listen on port 3000 by default.
This can be modified in the CoreOS service file by using `-p` flag, see [service file][coregi_service].

##### Docker

```
$ docker run --name coregi -p 3000:3000 speakit/coregi:latest
```

##### Node.js

To change default options, set the environment variables, see [options](#coregi-options).
Example with custom option:

```
$ FLEET_BINARY=/usr/local/bin/fleetctl npm start
```

### CoreGI Options

CoreGI default options.

```javascript
//options
var config = {
  fleetctl: {
    //Location of the binary file for fleetctl
    binary: process.env.FLEET_BINARY || '/usr/bin/fleetctl',
    //URL for etcd
    endpoint: process.env.FLEET_ENDPOINT || 'http://172.17.42.1:4001'
  },
  etcd: {
    host: process.env.ETCD_HOST || '172.17.42.1',
    port: process.env.ETCD_PORT || 4001
  }
};

//express listen port
app.set('port', process.env.PORT || 3000);
```

### CoreGI Features

CoreGI currently supports querying Fleet for listing of __machines__, __units__, and __unit-files__.
CoreGI also exposes a __REST API__ with the following endpoints:

* http://<'dockerhost'>/api/machines
* http://<'dockerhost'>/api/units
* http://<'dockerhost'>/api/unitFiles

#### Upcoming Features

Some of the soon to come features include: __unit logs__, __unit status__, __start/stop/load/unload/submit/destroy unit files__, and adding __etcd__ key monitoring (and eventually __create/edit/delete__).
CoreGI will also be adding features to do __rolling deployment of services__.


#### CoreGI is built with:

* [Node.js](http://nodejs.org/)
* [AngularJS](https://angularjs.org/)
* [Bootstrap](http://getbootstrap.com/)
* [Docker](https://www.docker.com/)



[coregi_service]: https://github.com/astilabs/CoreGI/blob/master/services/coregi.service

