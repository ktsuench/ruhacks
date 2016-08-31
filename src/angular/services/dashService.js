/*global angular */

angular
.module('app.services')
.factory('dashService', ['$http', function dashService($http){
    return {
        // auth login info
        auth : function(loginData) {
            return $http.post('/api/auth', loginData);
        }
    }       
}]);