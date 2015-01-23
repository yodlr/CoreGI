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

    $scope.$watchCollection(coregiService.getUnitsList, function(unitsList) {
      if(unitsList) {
        $scope.unitsList = unitsList;
      }
    });

    $scope.start = function start(unit) {
      if(unit.active === 'active') {
        coregiService.stopUnit(unit);
      }
      else {
        coregiService.startUnit(unit);
      }
    };

    $scope.destroy = function destroy(unit) {
      coregiService.destroyUnit(unit);
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
