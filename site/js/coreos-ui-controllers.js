var coreosControllers = angular.module('coreosControllers', []);

coreosControllers.controller('NavbarCtrl',  ['$rootScope', '$scope', '$route',
  function($rootScope, $scope, $route) {

    $scope.isActive = function isActive(tab) {
      if($route.current) {
        return $route.current.activetab === tab || $route.current.params.page === tab;
      }
    };
  }
]);

coreosControllers.controller('MachinesCtrl',  ['$rootScope', '$scope', 'coreosService',
  function($rootScope, $scope, coreosService) {

    $scope.$watchCollection(coreosService.getMachinesList, function(machinesList) {
      if(machinesList) {
        $scope.machinesList = machinesList;
      }
    });

  }
]);

coreosControllers.controller('UnitsCtrl',  ['$rootScope', '$scope', 'coreosService',
  function($rootScope, $scope, coreosService) {

    $scope.$watchCollection(coreosService.getUnitsList, function(unitsList) {
      if(unitsList) {
        $scope.unitsList = unitsList;
      }
    });

  }
]);

coreosControllers.controller('UnitFilesCtrl',  ['$rootScope', '$scope', 'coreosService',
  function($rootScope, $scope, coreosService) {

    $scope.$watchCollection(coreosService.getUnitFilesList, function(unitFilesList) {
      if(unitFilesList) {
        $scope.unitFilesList = unitFilesList;
      }
    });

  }
]);
