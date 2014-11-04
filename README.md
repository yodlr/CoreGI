CoreOS-UI
=========

WebUI for monitoring CoreOS clusters including fleet and etcd


CoreOs UI is an open source dashboard that gives insight into your CoreOS cluster. It is easy to install and can run as a standalone application or run in a docker container in your CoreOS cluster. Currently it only supports a few fleet features, with plans to add new features including etcd. CoreOS UI currently supports the [following](#current-features) features.

#### Getting Started

For an example service file, see `services/core-os-ui.service` or use the following command: 

`docker run --name coreos-ui -p 3000:3000 -e FLEET_BINARY=/usr/bin/fleetctl -e FLEET_ENDPOINT=http://172.17.42.1:4001 speakit/coreos-ui`

`FLEET_BINARY`: Location of the binary file for fleet  
`FLEET_ENDPOINT`: URL for Etcd

#### Current Features

Fleet

* Machines
* Units
* Unit Files

REST

* http://<'dockerhost'>/api/machines
* http://<'dockerhost'>/api/units
* http://<'dockerhost'>/api/unitFiles

#### Upcoming Features

Etcd

* GET
* POST
* DEL

Fleet

* Destroy
* Load
* Start
* Status
* Stop
* Submit
* Unload

Built with:

* [Node.js](http://nodejs.org/)
* [AngularJS](https://angularjs.org/)
* [Bootstrap](http://getbootstrap.com/)
* [Docker](https://www.docker.com/)


