var coregiControllers = angular.module('coregiControllers', []);

coregiControllers.controller('NavbarCtrl',  ['$rootScope', '$scope', '$route',
  function($rootScope, $scope, $route) {

    $scope.isActive = function isActive(tab) {
      if($route.current) {
        return $route.current.activetab === tab || $route.current.params.page === tab;
      }
    };
  }
]);

coregiControllers.controller('MachinesCtrl',  ['$rootScope', '$scope', 'coregiService',
  function($rootScope, $scope, coregiService) {

    $scope.$watchCollection(coregiService.getMachinesList, function(machinesList) {
      if(machinesList) {
        $scope.machinesList = machinesList;
      }
    });

  }
]);

coregiControllers.controller('UnitsCtrl',  ['$rootScope', '$scope', 'coregiService',
  function($rootScope, $scope, coregiService) {
    var changedUnits = {};

    $scope.$watchCollection(coregiService.getUnitsList, function(unitsList) {
      if(unitsList) {
        $scope.unitsList = unitsList;

        for(var c in changedUnits) {
          var found = false;
          for(var i in $scope.unitsList) {
            if(changedUnits[c].unit == $scope.unitsList[i].unit) {
              found = true;
              break;
            }
          }
          if(!found) {
            delete changedUnits[c];
          }
        }

        for(var u in $scope.unitsList) {
          if(changedUnits[$scope.unitsList[u].unit]) {
            if($scope.unitsList[u].active === changedUnits[$scope.unitsList[u].unit].active) {
              $scope.unitsList[u].active = 'busy';
              delete changedUnits[$scope.unitsList[u].unit];
            }
          }
        }
      }
    });

    $scope.start = function start(unit) {
      if(unit.active === 'active') {
        coregiService.stopUnit(unit);
        changedUnits[unit.unit] = angular.copy(unit);
        unit.active = 'busy';
      }
      else {
        coregiService.startUnit(unit);
        changedUnits[unit.unit] = angular.copy(unit);
        unit.active = 'busy';
      }
    };

    $scope.destroy = function destroy(unit) {
      coregiService.destroyUnit(unit);
      changedUnits[unit.unit] = angular.copy(unit);
      unit.active = 'busy';
    };

  }
]);

coregiControllers.controller('UnitFilesCtrl',  ['$rootScope', '$scope', 'coregiService',
  function($rootScope, $scope, coregiService) {

    $scope.$watchCollection(coregiService.getUnitFilesList, function(unitFilesList) {
      if(unitFilesList) {
        $scope.unitFilesList = unitFilesList;
      }
    });

  }
]);

coregiControllers.controller('EtcdCtrl',  ['$rootScope', '$scope', 'coregiService',
  function($rootScope, $scope, coregiService) {

    $scope.$watchCollection(coregiService.getKeysList, function(keysList) {
      if(keysList) {
        $scope.keysList = keysList;
      }
    });

    $scope.$watchCollection(coregiService.getKeysBranchList, function(keysBranchList) {
      if(keysBranchList) {
        $scope.keysBranchList = keysBranchList;
      }
    });

  }
]);
