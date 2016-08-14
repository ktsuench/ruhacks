/* Change this script so that it gets the name and count of images in the specified folder - done through call to nodejs backend*/
var landing = document.getElementById('landing');
var path = '../img/cover/';
var cover = ['eng1', 'eng2', 'image center1', 'image center2', 'mac', 'slc1', 'slc2', 'TRSM'];
var ext = '.jpg';
var index = 0;

//Switch the images every 10 seconds
var imageSlideshow = window.setInterval(function() {
	landing.setAttribute('style', 'background: url("' + path + cover[index++] + ext + '"); background-size: cover; background-position: 50% 80%; background-repeat: no-repeat;');
	index = index >= cover.length ? 0 : index;		
}, 10000);

//Preload images
window.setTimeout(function(){
    cover.slice(0, cover.length - 1).forEach( function(file, index) {
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