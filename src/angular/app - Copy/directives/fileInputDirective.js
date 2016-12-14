/*global angular */

/*
Copyright (c) 2015 Vinicius Melquiades
Licensed under MIT (https://github.com/viniciusmelquiades/ng-file-input/blob/master/LICENSE)
*/

angular
.module('app.directives', [])
.directive('input', function fileInputDirective() {
    return {
        restrict: 'E',
        require: '?ngModel',
        link:  function link(scope, element, attrs, ngModel) {
            var fileTypeRegex = /^file$/i;

            if (ngModel && element[0].tagName === 'INPUT' && fileTypeRegex.test(attrs['type'])) {
                element.bind('change', function (event) {
                    if ('multiple' in attrs) {
                        ngModel.$setViewValue({'files': [], 'size': 0});

                        var files = Array.prototype.map.call(event.target.files, function (file) {
                            var reader = new FileReader();
                            reader.onload = function (loadComplete) {
                                ngModel.$modelValue.files.push({
                                    data: loadComplete.target.result,
                                    name: file.name
                                });

                                ngModel.$modelValue.size += file.size;
                            }
                            
                            reader.readAsDataURL(file);
                        });
                    } else {
                        var reader = new FileReader();
                        reader.onload = function (loadComplete) {
                            ngModel.$setViewValue({
                                data: loadComplete.target.result,
                                name: event.target.files[0].name
                            });
                        };

                        reader.readAsDataURL(changeEvent.target.files[0]);
                    }
                });
            }
        }
    }
});