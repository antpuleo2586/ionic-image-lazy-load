ionic-image-lazy-load
=====================

Forked from https://github.com/paveisistemas/ionic-image-lazy-load

## Demo
http://codepen.io/mvidailhet/pen/yNOGzY
http://codepen.io/pavei/pen/oFpCy

## Quick Start

Download the file JS *ionic-image-lazy-load.js*, save on your project and load it on your *index.html*.


```html
<script src="path/to/ionic-image-lazy-load.js"></script>
```

Load into your module:

```javascript
angular.module('yourapp',
              ['ionic', 'ionicLazyLoad'])
```

Set the `lazy-scroll` directive on your `<ion-content>` tag, that will listen to the scroll event:

``` html
<ion-content lazy-scroll>
```

And set the `image-lazy-src` directive on the image attribute instead of `src`:

```html
 <img image-lazy-src="{{item.thumbnail}}">
```

NEW: set a default image incase the original fails, via the `default-image-on-fail` directive on the image attribute:

```html
 <img default-image-on-fail="images/default.jpg" image-lazy-src="{{item.thumbnail}}">
```


You can also use it as a background-image for an element by setting the `image-lazy-background-image` paramameter to true:
``` html
<div image-lazy-src="{{item.thumbnail}}" image-lazy-background-image="true"></div>
```

You can also set an option to auto call `$ionicScrollDelegate.resize()` when the image `load` (default value is `false`):

```html
 <img image-lazy-src="{{item.thumbnail}}" lazy-scroll-resize="true">
```

To show a ionic spinner while the image is loading, just specify a ionic spinner type (list is here: http://ionicframework.com/docs/api/directive/ionSpinner/):

```html
 <img image-lazy-src="{{item.thumbnail}}" image-lazy-loader="lines">
```
Note: the styling of the loader position is up to you. The directive adds this html:

```html
<div class="image-loader-container">
    <ion-spinner class="image-loader" icon="#spinnerStyle#"></ion-spinner>
</div>
```

You can set a distance from the bottom or right side of the screen where the image will start loading.
This will allow to start loading the image 100px below the bottom of the screen:

``` html
 <img image-lazy-src="{{item.thumbnail}}" image-lazy-distance-from-bottom-to-load="100">
```

This will allow to start loading the image 100px before the right side of the screen:
```html
 <img image-lazy-src="{{item.thumbnail}}" image-lazy-distance-from-right-to-load="100">
```
