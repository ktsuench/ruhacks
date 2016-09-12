/*global angular */

angular
.module('app.controllers', [])
.controller('dashCtrl', ['mailingListService', 'dashService', '$window', function dashCtrl(mailingListService, dashService, $window) {
    var _ctrl = this;
    
    _ctrl.init = function(page) {
        dashService.checkAuth().then(
            function(res){
                if(res.data.authenticated && page == 'login'){
                    $window.location.assign('dash');
                }else if(!res.data.authenticated && page == 'dash'){
                    $window.location.assign('login');
                }
            },
            function(res){
                console.log(res.status + ' ' + res.statusText);
            }
        );
    }

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
                        if(res.data.valid){
                            $window.location.assign('dash');
                            _ctrl.login.err.text = 'Transferring you to dashboard';
                        } else {
                            _ctrl.login.err.text = 'Wrong username/password';
                        }
                        _ctrl.login.err.show = true;
                    },
                    function(res){
                        console.log('Failed to log in.');
                        console.log(res.status + ' ' + res.statusText);
                        _ctrl.login.err.text = 'Sorry unable to log you in at the moment. Try again later. :(';
                        _ctrl.login.err.show = true;
                    }
                );
            }
        },
        logout: function() {
            dashService.logout().then(
                function(res){
                    console.log('Logged out');
                    $window.location.assign('');
                },
                function(res){
                    console.log('Failed to log out');
                    console.log(res.status + ' ' + res.statusText);
                }
            );
        }
    }

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

    mailingListService.get().then(function(res) {
        _ctrl.subscribers.list = res.data;
    }, function(res) {
        console.log('Failed to get subscribers.');
        console.log(res.status + ' ' + res.statusText);
    });
}]);