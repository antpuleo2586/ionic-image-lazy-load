'use strict';
/**
 * Created by PAVEI on 30/09/2014.
 * Updated by Ross Martin on 12/05/2014
 * Updated by Davide Pastore on 04/14/2015
 * Updated by Michel Vidailhet on 05/12/2015
 * Updated by Rene Korss on 11/25/2015
 * Updated by Antonio Puleo on 19 July 2016
 */

angular.module('ionicLazyLoad', [])

    .directive('lazyScroll', ['$rootScope',
        function ($rootScope) {
            return {
                restrict: 'A',
                link: function ($scope, $element) {
                    var origEvent = $scope.$onScroll;
                    $scope.$onScroll = function () {
                        $rootScope.$broadcast('lazyScrollEvent');

                        if (typeof origEvent === 'function') {
                            origEvent();
                        }
                    };
                }
            };
        }])

    .directive('imageLazySrc', ['$document', '$timeout', '$ionicScrollDelegate', '$compile',
        function ($document, $timeout, $ionicScrollDelegate, $compile) {
            return {
                restrict: 'A',
                scope: {
                    lazyScrollResize: '@lazyScrollResize',
                    imageLazyBackgroundImage: '@imageLazyBackgroundImage',
                    imageLazySrc: '@'
                },
                link: function ($scope, $element, $attributes) {
                    if (!$attributes.imageLazyDistanceFromBottomToLoad) {
                        $attributes.imageLazyDistanceFromBottomToLoad = 0;
                    }
                    if (!$attributes.imageLazyDistanceFromRightToLoad) {
                        $attributes.imageLazyDistanceFromRightToLoad = 0;
                    }

                    var loader;
                    if ($attributes.imageLazyLoader) {
                        loader = $compile('<div class="image-loader-container"><ion-spinner class="image-loader" icon="' + $attributes.imageLazyLoader + '"></ion-spinner></div>')($scope);
                        $element.after(loader);
                    }

                    $scope.$watch('imageLazySrc', function (oldV, newV) {

                        if (loader) {
                            loader.remove();
                        }

                        if ($attributes.imageLazyLoader) {
                            loader = $compile('<div class="image-loader-container"><ion-spinner class="image-loader" icon="' + $attributes.imageLazyLoader + '"></ion-spinner></div>')($scope);
                            $element.after(loader);
                        }

                        var deregistration = $scope.$on('lazyScrollEvent', function () {

                            if (isInView()) {
                                loadImage();
                                deregistration();
                            }
                        });
                        $timeout(function () {
                            if (isInView()) {
                                loadImage();
                                deregistration();
                            }
                        }, 500);
                    });
                    var deregistration = $scope.$on('lazyScrollEvent', function () {

                        if (isInView()) {
                            loadImage();
                            deregistration();
                        }
                    });

                    function loadImage() {
                        // Bind "load" event
                        $element.bind('load', function (e) {

                            if ($attributes.imageLazyLoader) {
                                loader.remove();
                            }
                            if ($scope.lazyScrollResize === 'true') {
                                // Call the resize to recalculate the size of the screen
                                $ionicScrollDelegate.resize();
                            }
                            $element.unbind('load');
                        });

                        if ($scope.imageLazyBackgroundImage === 'true') {
                            var bgImg = new Image();
                            bgImg.onload = function () {
                                if ($attributes.imageLazyLoader) {
                                    loader.remove();
                                }
                                $element[0].style.backgroundImage = 'url(' + $attributes.imageLazySrc + ')'; // set style attribute on element (it will load image)
                                if ($scope.lazyScrollResize === 'true') {
                                    // Call the resize to recalculate the size of the screen
                                    $ionicScrollDelegate.resize();
                                }
                            };
                            bgImg.onerror = function () {

                                // Default image loaded on fail
                                if ($attributes.defaultImageOnFail) {
                                    if ($attributes.imageLazyLoader) {
                                        loader.remove();
                                    }

                                    $element[0].style.backgroundImage = 'url(' + $attributes.defaultImageOnFail + ')'; // set style attribute on element (it will load image)
                                    if ($scope.lazyScrollResize === 'true') {
                                        // Call the resize to recalculate the size of the screen
                                        $ionicScrollDelegate.resize();
                                    }
                                }
                            };
                            bgImg.src = $attributes.imageLazySrc;
                        } else {

                            // Attempt to load the src into an Image object
                            // Note: not actually using the Image object here, purely serving to test the src
                            var smImg = new Image();
                            smImg.onload = function () {
                                // If src valid, load
                                $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)
                            };
                            smImg.onerror = function () {

                                // If unsucessful, check if we can load the on fail default
                                // Default image loaded on fail
                                if ($attributes.defaultImageOnFail) {
                                    $element[0].src = $attributes.defaultImageOnFail; // set src attribute on element (it will load image)
                                }
                            };
                            smImg.src = $attributes.imageLazySrc;

                        }
                    }

                    function isInView() {
                        var clientHeight = $document[0].documentElement.clientHeight;
                        var clientWidth = $document[0].documentElement.clientWidth;
                        var imageRect = $element[0].getBoundingClientRect();
                        return (imageRect.top >= 0 && imageRect.top <= clientHeight + parseInt($attributes.imageLazyDistanceFromBottomToLoad))
                            && (imageRect.left >= 0 && imageRect.left <= clientWidth + parseInt($attributes.imageLazyDistanceFromRightToLoad));
                    }

                    // bind listener
                    // listenerRemover = scrollAndResizeListener.bindListener(isInView);

                    // unbind event listeners if element was destroyed
                    // it happens when you change view, etc
                    $element.on('$destroy', function () {
                        deregistration();
                    });

                    // explicitly call scroll listener (because, some images are in viewport already and we haven't scrolled yet)
                    $timeout(function () {
                        if (isInView()) {
                            loadImage();
                            deregistration();
                        }
                    }, 500);
                }
            };
        }]);
