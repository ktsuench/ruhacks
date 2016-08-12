/*global angular */

angular
.module('app', ['ngRoute', 'main'/*, 'apply'*/])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'pages/home',
        controller: 'MainCtrl as main'
    })
    /*.when('/apply', {
        templateUrl: 'pages/apply',
        controller: 'ApplyCtrl as apply'
    })*/
    .otherwise({
    	redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
}]);