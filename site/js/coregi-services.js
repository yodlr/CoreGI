var coregiServices = angular.module('coregiServices', ['ngResource']);

coregiServices.factory('coregiService', ['$rootScope', '$resource', '$timeout',
  function($rootScope, $resource, $timeout) {

    // $resource endpoints
    var machinesService = $resource('/api/machines/:machine', {}, {
      get: {method: 'GET', isArray: true}
    });

    var unitsService = $resource('/api/units/:unit', {}, {
      get: {method: 'GET', isArray: true},
      start: {method: 'PUT', isArray: false, params: {unit: '@unit', action: 'start'}},
      stop: {method: 'PUT', isArray: false, params: {unit: '@unit', action: 'stop'}},
      destroy: {method: 'DELETE', isArray: false, params: {unit: '@unit', action: 'destroy'}}
    });

    var unitFilesService = $resource('/api/unitFiles/:unitFile', {}, {
      get: {method: 'GET', isArray: true}
    });

    var keysService = $resource('/api/keys/:key', {}, {
      get: {method: 'GET', isArray: true}
    });

    // vars
    var machinesList = [];
    var unitsList = [];
    var unitFilesList = [];
    var keysList = [];
    var keysBranchList = [];

    // refresh data
    var refreshMachines = function refreshMachines() {
      machinesService.query(function(data) {
        if(!angular.equals(machinesList, data)) {
          angular.copy(data, machinesList);
        }
      });
      $timeout(refreshMachines, 3000);
    };
    refreshMachines();

    var refreshUnits = function refreshUnits() {
      unitsService.query(function(data) {
        if(!angular.equals(unitsList, data)) {
          angular.copy(data, unitsList);
        }
      });
      $timeout(refreshUnits, 3000);
    };
    refreshUnits();

    var refreshUnitFiles = function refreshUnitFiles() {
      unitFilesService.query(function(data) {
        if(!angular.equals(unitFilesList, data)) {
          angular.copy(data, unitFilesList);
        }
      });
      $timeout(refreshUnitFiles, 3000);
    };
    refreshUnitFiles();

    var refreshKeys = function refreshKeys() {
      keysService.query(function(data) {
        if(!angular.equals(keysList, data)) {
          angular.copy(data, keysList);
          keysBranchList = traverseTree();
        }
      });
      $timeout(refreshKeys, 3000);
    };
    refreshKeys();

    var traverseTree = function(callback) {
      var etcdTree = angular.copy(keysList, etcdTree);
      var etcdRootBranch;
      var results = [];

      var recurseBranch = function recurseBranch(branch, depth) {
        var nodes;
        var node;
        //callback(branch, depth);
        results.push(branch);
        if(branch.nodes) {
          nodes = branch.nodes;
          for(var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            recurseBranch(node, depth+1);
          }
        }
      };

      for(var y = 0; y < etcdTree.length; y++) {
        etcdRootBranch = etcdTree[y];
        recurseBranch(etcdRootBranch, 1);
      }
      return results;
    };

    // exports
    return {
      getMachinesList: function getMachinesList() {
        return machinesList;
      },
      getUnitsList: function getUnitsList() {
        return unitsList;
      },
      getUnitFilesList: function getUnitFilesList() {
        return unitFilesList;
      },
      getKeysList: function getKeysList() {
        return keysList;
      },
      getKeysBranchList: function getKeysBranchList() {
        return keysBranchList;
      },
      startUnit: function startUnit(unit) {
        unitsService.start(unit, function(data) {
        });
      },
      stopUnit: function stopUnit(unit) {
        unitsService.stop(unit, function(data) {
        });
      },
      destroyUnit: function destroyUnit(unit) {
        unitsService.destroy(unit, function(data) {
        });
      }
    };
  }
]);
