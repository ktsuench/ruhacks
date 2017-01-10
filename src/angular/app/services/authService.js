/*global angular */

angular
.module('app.services', [])
.factory('authService', ['$http', function dashService($http) {
    return {
        // auth login info
        auth: function(loginData) {
            return $http.post('/api/auth', loginData);
        },
        logout: function() {
            return $http.get('api/logout');
        }
    }
}]);