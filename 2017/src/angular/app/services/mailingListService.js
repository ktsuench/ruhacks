/*global angular */

angular
.module('app.services')
.factory('mailingListService', ['$http', function mailingListService($http){
    return {
        // call to get all subscribers
        get : function() {
            return $http.get('/2017/api/mailingList');
        },

        // call to POST and submit a new subscriber
        create : function(subscriber) {
            return $http.post('/2017/api/mailingList', subscriber);
        },

        // call to DELETE a subscriber
        delete : function(subscriber) {
            return $http.delete('/2017/api/mailingList/', {params: {email: subscriber.email}});
        }
    }       
}]);