/*global angular */

angular
.module('app.services', [])
.factory('mailingListService', ['$http', function mailingListService($http){
    return {
        // call to get all subscribers
        get : function() {
            return $http.get('/api/mailingList');
        },

        // call to POST and submit a new subscriber
        create : function(subscriber) {
            return $http.post('/api/mailingList', subscriber);
        },

        // call to DELETE a subscriber
        delete : function(subscriber) {
            return $http.delete('/api/mailingList/', noteData);
        }
    }       
}]);