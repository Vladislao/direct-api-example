/**
 * Created by Vlad on 12/7/13.
 */
'use strict';

var direct = angular.module('direct', ['ngRoute', 'ui.bootstrap']);

direct.config(function ($routeProvider) {

    $routeProvider.
        when('/', {
            controller: 'BannersController',
            templateUrl: '/template/banners.html'
        }).
        otherwise({ redirectTo: '/' });
});