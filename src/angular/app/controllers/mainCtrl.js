/*global angular */

angular
.module('app.controllers')
.controller('mainCtrl', ['mailingListService', function mainCtrl(mailingListService) {
    var _ctrl = this;
    _ctrl.email = '';
    _ctrl.result = {
        'class': '',
        'show': false,
        'text': ''
    }
    _ctrl.subscribeDisabled = false;

    _ctrl.init = function() {};

    // Submit user's email to database
    _ctrl.subscribe = function() {
        if(typeof _ctrl.email === 'undefined' || _ctrl.email === '') {
            _ctrl.result.class = 'has-error';
            _ctrl.result.text = 'Please provide your email.';
            _ctrl.result.show = true;
        } else {
            _ctrl.subscribeDisabled = true;
            mailingListService.create({'email': _ctrl.email}).then(
                function(res){
                    var msg = res.data.result == 'added' ? 'Thanks, we will email you soon! :)' : 'You have already subscribed.';

                    _ctrl.result.class = 'has-success';
                    _ctrl.result.text = msg;
                    _ctrl.result.show = true;
                    _ctrl.subscribeDisabled = false;
                },
                function(res){
                    console.log('Failed to add email to mailing list');

                    _ctrl.result.class = 'has-error';
                    _ctrl.result.text = 'Sorry we are unable to subscribe you. Try again later. :(';
                    _ctrl.result.show = true;
                    _ctrl.subscribeDisabled = false;
                }
            );
        }
    };
}]);