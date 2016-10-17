/*global angular */

angular
.module('app.services')
.factory('mailApiService', ['$http', function mailingListService($http){
    return {
        // call to get all subscribers
        get : function() {
            return $http.get('/api/mail/get');
        },

        // call to POST and submit a new subscriber
        send : function(mail) {
            return $http.post('/api/mail/send', mail);
        },

        // call to DELETE a subscriber
        delete : function(mail) {
            return $http.delete('/api/mail/delete', {params: {email: mail}});
        }
    }       
}]);