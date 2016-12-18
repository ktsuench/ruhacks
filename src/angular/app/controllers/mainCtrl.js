/*global angular */

angular
.module('app.controllers', [])
.controller('mainCtrl', ['mailingListService', function mainCtrl(mailingListService, $window) {
    var _ctrl = this;
    _ctrl.email = '';
    _ctrl.result = {
        'class': '',
        'show': false,
        'text': ''
    }

    _ctrl.init = function() {};

    // Submit user's email to database
    _ctrl.subscribe = function() {
        if(typeof _ctrl.email === 'undefined' || _ctrl.email === '') {
            _ctrl.result.class = 'has-error';
            _ctrl.result.text = 'Please provide your email.';
            _ctrl.result.show = true;
        } else {
            mailingListService.create({'email': _ctrl.email}).then(
                function(res){
                    var msg = res.data.result == 'added' ? 'Thanks, we\'ll email you soon! :)' : 'You\'ve aleady subscribed.';

                    _ctrl.result.class = 'has-success';
                    _ctrl.result.text = msg;
                    _ctrl.result.show = true;
                },
                function(res){
                    console.log('Failed to add email to mailing list');

                    _ctrl.result.class = 'has-error';
                    _ctrl.result.text = 'Sorry we\'re unable to subscribe you. Try again later. :(';
                    _ctrl.result.show = true;
                }
            );
        }
    };
}]);