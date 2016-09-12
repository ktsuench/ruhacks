/*global angular */

angular
.module('app', ['ngRoute', 'app.controllers', 'app.services'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'pages/home',
        controller: 'homeCtrl as home'
    })
    .when('/login', {
        templateUrl: 'pages/login',
        controller: 'dashCtrl as dash'
    })
    .when('/dash', {
        templateUrl: 'pages/dash',
        controller: 'dashCtrl as dash'
    })
    .otherwise({
    	redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
}]);