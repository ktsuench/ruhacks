/*global angular */

angular
.module('app.controllers', [])
.controller('landingCtrl', function landingCtrl(mailingListService) {
    var _ctrl = this;
    _ctrl.showModal = false;
    _ctrl.email = '';
    _ctrl.result = {
        'class': '',
        'text': '',
        'show': false
    }

    // Start background slideshow and fix layout of landing page
    _ctrl.init = function() {        
        /* Change this script so that it gets the name and count of images in the specified folder - done through call to nodejs backend*/
        var landing = document.getElementById('landing');
        var path = '../img/cover/';
        var cover = ['eng1', 'eng2', 'holding_a_laptop','image_center', 'img_3828', 'mac', 'slc', 'TRSM'];
        var ext = '.jpg';
        var startingIndex = 3;
        var index = startingIndex;

        //Switch the images every 10 seconds
        var imageSlideshow = window.setInterval(function() {
            landing.setAttribute('style', 'background: url("' + path + cover[index++] + ext + '"); background-size: cover; background-position: 50% 80%; background-repeat: no-repeat;');
            index = index >= cover.length ? 0 : index;
        }, 10000);

        //Preload images
        window.setTimeout(function(){
            var coverCopy = cover.slice(0);
            coverCopy.splice(startingIndex - 1, 1);
            coverCopy.forEach( function(file, index) {
                //Append images to document to send request to server
                var image = document.createElement('img');
                image.setAttribute('id', file);
                image.setAttribute('src', path + file + ext);
                image.setAttribute('style', 'display: none;');
                document.body.appendChild(image);

                //Once loaded, remove the image
                image = document.getElementById(file);
                image.onload = function(){
                    document.body.removeChild(image);
                }
            });
        }, 1000);
        
        // Fix layout of landing page
        var doc = document.getElementById('top');

        doc.setAttribute('style', 'align-items: center; display: flex; flex-direction: row; justify-content: center;');
    };

    // Toggle modal
    _ctrl.toggleSubscribe = function() {
        _ctrl.showModal = !_ctrl.showModal;
    };

    // Submit user's email to database
    _ctrl.subscribe = function() {
        if(typeof _ctrl.email === 'undefined' || _ctrl.email === '') {
            _ctrl.result.class = 'has-error';
            _ctrl.result.text = 'Please provide your email.';
            _ctrl.result.show = true;
        } else {
            mailingListService.create({'email': _ctrl.email}).then(
                function(res){
                    _ctrl.result.class = 'has-success';
                    _ctrl.result.text = 'Thanks, we\'ll email you soon! :)';
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
});