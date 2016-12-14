/*global angular */

angular
.module('app.controllers')
.controller('headerCtrl', ['authService', function mainCtrl(authService) {
    var _ctrl = this;
    _ctrl.showNav = false;
    
    // Show nav
    _ctrl.toggleNav = function() {
        _ctrl.showNav = !_ctrl.showNav;
    }

    _ctrl.logout = function() {
        authService.logout().then(
            function (res) {
                console.log('Logged out');
                $window.location.assign('');
            },
            function(res) {
                console.log('Failed to log out');
                console.log(res.status + ' ' + res.statusText);
            }
        );
    }
}]);