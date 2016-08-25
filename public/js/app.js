/*global angular */

angular
.module('app', ['ngRoute', 'app.controllers', 'app.services'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'pages/landing',
        controller: 'landingCtrl as landing'
    })
    .when('/login', {
        templateUrl: 'pages/login',
        controller: 'loginCtrl as login'
    })
    .when('/home', {
        templateUrl: 'pages/home',
        controller: 'homeCtrl as home'
    })
    .otherwise({
    	redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
}]);