/*global angular */

angular
.module('app.services', [])
.factory('dashService', ['$http', function dashService($http){
    return {
        // auth login info
        auth : function(loginData) {
            return $http.post('/api/auth', loginData);
        },
        checkAuth : function(){
        	return $http.get('/api/auth');
        },
        logout : function() {
        	return $http.get('api/logout');
        }
    }       
}]);