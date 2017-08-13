/*global angular */

angular
.module('app.controllers')
.controller('mainCtrl', ['$window', 'mailingListService', function mainCtrl($window, mailingListService) {
    var _ctrl = this;
    _ctrl.showNav = false;
    _ctrl.email = '';
    _ctrl.result = {
        'class': '',
        'show': false,
        'text': ''
    }
    _ctrl.subscribeDisabled = false;

    _ctrl.init = function() {
        $window.showNav = false;
         
        $window.onscroll = function () {
            if ($window.showNav === false) {
                var val = 1 - ($window.outerHeight - $window.scrollY) / $window.outerHeight;
                var nav = document.getElementById("ru-nav-scroll");

                if (nav.hasAttribute("style")) {
                    nav.removeAttribute("style");
                }

                nav.setAttribute("style", "background: rgba(0, 76, 155, " + val +");");
            }
        }
    };

    // Show nav
    _ctrl.toggleNav = function() {
        _ctrl.showNav = !_ctrl.showNav;
        $window.showNav = _ctrl.showNav;

        var val = 1 - ($window.outerHeight - $window.scrollY) / $window.outerHeight;
        var nav = document.getElementById("ru-nav-scroll");

        if (nav.hasAttribute("style")) {
            nav.removeAttribute("style");
        }

        if (_ctrl.showNav) {
            nav.setAttribute("style", "background: rgba(0, 76, 155, 1);");
        } else {
            nav.setAttribute("style", "background: rgba(0, 76, 155, " + val +");");
        }
    }

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