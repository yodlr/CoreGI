var service = angular.module('coreosServices', ['ngResource']);

service.factory('coreosService', ['$rootScope', '$resource', '$timeout',
  function($rootScope, $resource, $timeout) {

    // $resource endpoints
    var machinesService = $resource('/api/machines/:machine', {}, {
      get: {method:'GET', isArray: true}
    });

    var unitsService = $resource('/api/units/:unit', {}, {
      get: {method:'GET', isArray: true}
    });

    var unitFilesService = $resource('/api/unitFiles/:unitFile', {}, {
      get: {method:'GET', isArray: true}
    });

    // vars
    var machinesList = [];
    var unitsList = [];
    var unitFilesList = [];

    // refresh data
    var refreshMachines = function refreshMachines() {
      machinesService.query(function(data) {
        angular.copy(data, machinesList);
      });
      $timeout(refreshMachines, 3000);
    };
    refreshMachines();

    var refreshUnits = function refreshUnits() {
      unitsService.query(function(data) {
        angular.copy(data, unitsList);
      });
      $timeout(refreshUnits, 3000);
    };
    refreshUnits();

    var refreshUnitFiles = function refreshUnitFiles() {
      unitFilesService.query(function(data) {
        angular.copy(data, unitFilesList);
      });
      $timeout(refreshUnitFiles, 3000);
    };
    refreshUnitFiles();

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
      }
    };
  }
]);