/*global angular */

angular
.module('app.services', [])
.factory('authService', ['$http', function dashService($http) {
    return {
        // auth login info
        auth: function(loginData) {
            return $http.post('/2017/api/auth', loginData);
        },
        logout: function() {
            return $http.get('/2017/api/logout');
        }
    }
}]);