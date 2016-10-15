/*global angular */

angular
.module('app.controllers')
.controller('dashCtrl', ['mailingListService', function dashCtrl(mailingListService) {
    var _ctrl = this;

    _ctrl.subscribers = {
        list: [],
        delete: function(subscriber) {
            mailingListService.delete(subscriber).then(function(res) {
                _ctrl.subscribers.list.splice(_ctrl.subscribers.list.indexOf(subscriber), 1);
            }, function(res) {
                console.log('Failed to delete subscriber.');
                console.log(res.status + ' ' + res.statusText);
            });
        }
    };

    /**
     * @todo move this
     */
    mailingListService.get().then(function(res) {
        _ctrl.subscribers.list = res.data;
    }, function(res) {
        console.log('Failed to get subscribers.');
        console.log(res.status + ' ' + res.statusText);
    });
}]);