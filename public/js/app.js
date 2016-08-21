/*global angular */

angular
.module('app', ['ngRoute', /*'ngLoadScript',*/ 'app.controllers', 'app.services'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'pages/landing',
        controller: 'landingCtrl as landing'
    })
    /*.when('/', {
        templateUrl: 'pages/home',
        controller: 'homeCtrl as home'
    })*/
    /*.when('/apply', {
        templateUrl: 'pages/apply',
        controller: 'ApplyCtrl as apply'
    })*/
    .otherwise({
    	redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
}]);