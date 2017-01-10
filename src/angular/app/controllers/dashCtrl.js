/*global angular */

angular
.module('app.controllers')
.controller('dashCtrl', ['mailingListService', /*'mailApiService',*/ 'authService', '$window', function dashCtrl(mailingListService, /*mailApiService,*/ authService, $window) {
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

    _ctrl.subscribers = {
        init: function() {
            mailingListService.get().then(function(res) {
                _ctrl.subscribers.list = res.data;
            }, function(res) {
                console.log('Failed to get subscribers.');
                console.log(res.status + ' ' + res.statusText);
            });
        },
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

    /*_ctrl.mail = {
        init: function() {
            _ctrl.mail.get();
        },
        list: [],
        currentTab: 1,
        showSend: false,
        showStorage: true,
        notTrash: true,
        form: {
            err: {
                class: '',
                show: false,
                text: ''
            }
        },
        get: function() {
            mailApiService.get().then(function(res) {
                _ctrl.mail.list = res.data;
            }, function(res) {
                console.log('Failed to get mail.');
                console.log(res.status + ' ' + res.statusText);
            });
        },
        send: function() {
            var mailForm = _ctrl.mail.form;
            var emptySender = typeof mailForm.sender === 'undefined' || mailForm.sender.trim() === '';
            var emptyRecipient = typeof mailForm.recipient === 'undefined' || mailForm.recipient.trim() === '';
            var emptySubject = typeof mailForm.subject === 'undefined' || mailForm.subject.trim() === '';
            var emptyBody = typeof mailForm.body === 'undefined' || mailForm.body.trim() === '';
            var emptyAttachments = typeof mailForm.attachments === 'undefined';
            var invalidAttachments = typeof mailForm.attachments === 'undefined' || mailForm.attachments.size > 1024 * 1024 * 25 ;

            if(emptySender || emptyRecipient || emptySubject || emptyBody) {
                if(emptySender && emptyRecipient && emptySubject && emptyBody) {
                    mailForm.err.text = 'Cannot send an empty email!';
                } else {
                    mailForm.err.text = ''
                    if (emptySender) { mailForm.err.text += 'Please provide your email address you are sending from. '; }
                    if (emptyRecipient) { mailForm.err.text += 'Please provide recipient email addresses. '; }
                    if (emptySubject) { mailForm.err.text += 'Please provide subject for email. '; }
                    if (emptyBody) { mailForm.err.text += 'Please provide body of email. '; }
                    if (!emptyAttachments && invalidAttachments) { mailForm.err.text += 'Max size for attachments is 25 MB. ' }
                }

                mailForm.err.show = true;
            } else {
                var emptyCC = typeof mailForm.carbonCopy === 'undefined' || mailForm.carbonCopy.trim() === '';
                var emptyBCC = typeof mailForm.blindCarbonCopy === 'undefined' || mailForm.blindCarbonCopy.trim() === '';

                var email = {
                    'from': mailForm.sender,
                    'to': mailForm.recipient,
                    'subject': mailForm.subject,
                    'text': mailForm.body
                }

                if(!emptyCC) { email.cc = mailForm.carbonCopy; }
                if(!emptyBCC) { email.bcc = mailForm.blindCarbonCopy; }
                if(!invalidAttachments) { email.attachment = mailForm.attachments.files; }

                mailApiService.send(email).then(
                    function(res){
                        console.log('Mail was successfully sent');
                        
                        mailForm.err.class = 'has-success';
                        mailForm.err.show = true;
                        mailForm.err.text = 'Mail was successfully sent.';
                    },
                    function(res){
                        console.log('Failed to send mail');
                        console.log(res.status + ' ' + res.statusText);

                        mailForm.err.class = 'has-error';
                        mailForm.err.show = true;
                        mailForm.err.text = 'Unable to send mail. Try again later. :(';
                    }
                );
            }

        },
        delete: function(mail) {
            mailApiService.delete(mail).then(function(res) {
                _ctrl.mail.list.splice(_ctrl.mail.list.indexOf(mail), 1);
            }, function(res) {
                console.log('Failed to delete mail.');
                console.log(res.status + ' ' + res.statusText);
            });
        },
        changeTab: function(tab) {
            _ctrl.mail.currentTab = tab;
            if(tab > 0) {
                _ctrl.mail.showSend = false;
                _ctrl.mail.showStorage = true;
            } else {
                _ctrl.mail.showSend = true;
                _ctrl.mail.showStorage = false;
            }
        }
    }

    _ctrl.user = {
        init: function() {
            _ctrl.mail.get();
        },
        list: [],
        currentTab: 1,
        showSend: false,
        showStorage: true,
        form: {
            err: {
                class: '',
                show: false,
                text: ''
            }
        },
        get: function() {
            mailApiService.get().then(function(res) {
                _ctrl.mail.list = res.data;
            }, function(res) {
                console.log('Failed to get mail.');
                console.log(res.status + ' ' + res.statusText);
            });
        },
        create: function() {
            var userForm = _ctrl.user.form;
            var emptyName = typeof userForm.name === 'undefined' || userForm.name.trim() === '';
            var emptyEmail = typeof userForm.email === 'undefined' || userForm.email.trim() === '';
            var emptyPass = typeof userForm.pass === 'undefined' || userForm.pass.trim() === '';
            var passConfirmCheck = typeof userForm.passConfirm === 'undefined' || userForm.passConfirm.trim() === '';
            var passSameCheck = !(emptyPass || passConfirmCheck) ? userForm.pass === userForm.passConfirm : true ;

            if(emptyName || emptyEmail || emptyPass || passConfirmCheck || passSameCheck) {
                if(emptyName && emptyEmail && emptyPass && passConfirmCheck) {
                    userForm.err.text = 'Cannot create an empty user!';
                } else {
                    if (emptyName) { userForm.err.text = 'Please provide name for user. '; }
                    if (emptyEmail) { userForm.err.text = 'Please provide email address. '; }
                    if (emptyPass) { userForm.err.text = 'Please provide password. '; }
                    if (passConfirmCheck) { userForm.err.text = 'Please confirm password. '; }
                    if (passSameCheck) { userForm.err.text = 'Passwords do not match!'; }
                }

                userForm.err.show = true;
            } else {
                userApiService.create({
                    'name': userForm.name,
                    'email': userForm.email,
                    'pass': userForm.pass
                }).then(
                    function(res){
                        var msg = res.data.exists ? 'User exists.' : 'User created.';

                        if(res.data.exists){
                            $window.location.assign('dash/user');
                            userForm.err.text = msg;
                        } else {
                            userForm.err.text = 'Wrong username/password';
                        }
                        userForm.err.show = true;
                    },
                    function(res){
                        console.log('Failed to log in.');
                        console.log(res.status + ' ' + res.statusText);
                        userForm.err.text = 'Sorry unable to create a new user at the moment. Try again later. :(';
                        userForm.err.show = true;
                    }
                );
            }

            if(typeof _ctrl.mail.form.sender === 'undefined' || _ctrl.email === '') {
                _ctrl.result.class = 'has-error';
                _ctrl.result.text = 'Please provide your email.';
                _ctrl.result.show = true;
            } else {
                userApiService.send({'email': _ctrl.email}).then(
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
        },
        delete: function(user) {
            userApiService.delete(user).then(function(res) {
                _ctrl.user.list.splice(_ctrl.user.list.indexOf(user), 1);
            }, function(res) {
                console.log('Failed to delete user.');
                console.log(res.status + ' ' + res.statusText);
            });
        },
        changeTab: function(tab) {
            _ctrl.user.currentTab = tab;
            if(tab > 0) {
                _ctrl.user.showSend = false;
                _ctrl.user.showStorage = true;
            } else {
                _ctrl.user.showSend = true;
                _ctrl.user.showStorage = false;
            }
        }
    }*/
}]);