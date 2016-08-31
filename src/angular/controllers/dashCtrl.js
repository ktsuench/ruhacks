/*global angular */

angular
.module('app.controllers')
.controller('dashCtrl', function dashCtrl(mailingListService, dashService) {
    var _ctrl = this;

    _ctrl.login = {
        err: {
            show: false,
            text: ''
        },
        auth: function() {
            var userCheck = typeof _ctrl.login.user === 'undefined' || _ctrl.login.user === '';
            var passCheck = typeof _ctrl.login.pass === 'undefined' || _ctrl.login.pass === '';

            if(userCheck || passCheck) {
                if(userCheck && passCheck) {
                    _ctrl.login.err.text = 'Please provide your username and password.';
                } else if (userCheck) {
                    _ctrl.login.err.text = 'Please provide your username.';
                } else if (passCheck) {
                    _ctrl.login.err.text = 'Please provide your password.';
                }
                _ctrl.login.err.show = true;
            } else {
                dashService.auth({'username': _ctrl.login.user, 'pass': _ctrl.login.pass}).then(
                    function(res){
                        if(res.valid) {
                            _ctrl.login.err.text = 'You may continue';
                        } else {
                            _ctrl.login.err.text = 'Wrong username/password';
                        }
                        _ctrl.login.err.show = true;
                    },
                    function(res){
                        console.log('Failed to log in.');
                        _ctrl.login.err.text = 'Sorry unable to log you in at the moment. Try again later. :(';
                        _ctrl.login.err.show = true;
                    }
                );
            }
        }
    }

    _ctrl.subscribers = {

    }
});