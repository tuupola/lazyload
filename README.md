# [WIP] Lazy Load Remastered

Lazy Load delays loading of images in long web pages. Images outside of viewport will not be loaded before user scrolls to them. This is opposite of image preloading.

This is a modern vanilla JavaScript version of the original [Lazy Load](https://github.com/tuupola/jquery_lazyload) plugin. It uses [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to observe when the image enters the browsers viewport. Original code was inspired by [YUI ImageLoader](https://yuilibrary.com/yui/docs/imageloader/) utility by Matt Mlinac. New version loans heavily from a [blog post](https://deanhume.com/Home/BlogPost/lazy-loading-images-using-intersection-observer/10163) by Dean Hume.

## Basic Usage

By default Lazy Load assumes the URL of the original high resolution image can be found in `data-src` attribute. You can also include an optional low resolution placeholder in the `src` attribute.

```html
<img class="lazyload" data-src="img/example.jpg" width="765" height="574">
<img class="lazyload" src="img/example-thumb.jpg" data-src="img/example.jpg" width="765" height="574">
```

With the HTML in place you can then initialize the plugin using the factory method. If you do not pass any settings or image elements it will lazyload all images with class `lazyload`.

```js
lazyload();
```

If you prefer you can explicitly pass the image elements to the factory. Use this for example if you use different class name.

```js
let images = document.querySelectorAll(".branwdo");
lazyload(images);
```

If you prefer you can also use the plain old constructor.

```js
let images = document.querySelectorAll(".branwdo");
new LazyLoad(images);
```

## Additional API

To use the additional API you need to assign the plugin instance to a variable.

```js
let lazy = lazyload();
```

To force loading of all images use `loadimages()`.

```js
lazy->loadImages();
```

To destroy the plugin and stop lazyloading use `destroy()`.

```js
lazy->destroy();
```

Note that `destroy()` does not load the out of viewport images. If you also
want to load the images use `loadAndDestroy()`.

```js
lazy->loadAndDestroy();
```

Additional API is not avalaible with the jQuery wrapper.

## jQuery Wrapper

If you use jQuery there is a wrapper which you can use with the familiar old syntax. Note that to provide BC it uses `data-original` by default. This should be a drop in replacement for the previous version of the plugin.

```html
<img class="lazyload" data-original="img/example.jpg" width="765" height="574">
<img class="lazyload" src="img/example-thumb.jpg" data-original="img/example.jpg" width="765" height="574">
```

```js
$("img.lazyload").lazyload();
```

## Cookbook

### Blur Up Images

Low resolution placeholder ie. the "blur up" technique. You can see this in action [in this blog entry](https://appelsiini.net/2017/trilateration-with-n-points/). Scroll down to see blur up images.

```html
<img class="lazyload"
     src="thumbnail.jpg"
     data-src="original.jpg"
     width="1024" height="768" />
```

```html
<div class="lazyload"
     style="background-image: url('thumbnail.jpg')"
     data-src="original.jpg" />
```

### Responsive Images

Lazyloaded [Responsive images](https://www.smashingmagazine.com/2014/05/responsive-images-done-right-guide-picture-srcset/) are supported via `data-srcset`. If browser does not support `srcset` and there is no polyfill the image from `data-src` will be shown.

```html
<img class="lazyload"
     src="thumbnail.jpg"
     data-src="large.jpg"
     data-srcset="small.jpg 480w, medium.jpg 640w, large.jpg 1024w"
     width="1024" height="768" />
```

```html
<img class="lazyload"
     src="thumbnail.jpg"
     data-src="normal.jpg"
     data-srcset="normal.jpg 1x, retina.jpg 2x"
     width="1024" height="768" />
```


### Inlined Placeholder Image

To reduce the amount of request you can use data uri images as the placeholder.

```html
<img src="data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs="
     data-src="original.jpg"
     width="1024" height="768" />
```

## Install

This is still work in progress. There are no releases yet. In the meanwhile you can use rawgit.

```
$ wget https://rawgit.com/tuupola/jquery_lazyload/2.x/lazyload.js
```

# License

All code licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php). All images licensed under [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/deed.en_US). In other words you are basically free to do whatever you want. Just don't remove my name from the source.

