/**
 * Created by Vlad on 12/7/13.
 */
'use strict';

direct.controller('NavbarController', function NavbarController($scope, $location, typeService) {

    $scope.routeIs = function (routeName) {
        return $location.path() === routeName;
    };

    $scope.typeService = typeService;
    $scope.setType = function(type){
        typeService.type = type;
    };
});