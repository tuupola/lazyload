# [WIP] Lazy Load Remastered

Lazy Load delays loading of images in long web pages. Images outside of viewport will not be loaded before user scrolls to them. This is opposite of image preloading.

This is a modern vanilla JavaScript version of the original [Lazy Load](https://github.com/tuupola/jquery_lazyload) plugin. It uses [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to observe when the image enters the browsers viewport. Original code was inspired by [YUI ImageLoader](https://yuilibrary.com/yui/docs/imageloader/) utility by Matt Mlinac. New version loans heavily from a [blog post](https://deanhume.com/Home/BlogPost/lazy-loading-images-using-intersection-observer/10163) by Dean Hume.

## Basic Usage

By default Lazy Load assumes the URL of the original high resolution image can be found in `data-src` attribute. You can also include an optional low resolution placeholder in the `src` attribute.

```html
<img data-src="img/example.jpg" width="765" height="574">
<img src="img/example-thumb.jpg" data-src="img/example.jpg" width="765" height="574">
```

With the HTML in place you can then initialize the plugin using the factory method.

```js
let images = document.querySelectorAll("[data-src]");
let lazy = lazyload(images);
```

If you prefer you can also use the plain old constructor.

```js
let images = document.querySelectorAll("[data-src]");
let lazy = new LazyLoad(images);
```

## jQuery Wrapper

If you use jQuery there is a wrapper which you can use with the familiar old syntax. Note that to provide BC it uses `data-original` by default. This should be a drop in replacement for the previous version of the plugin.

```html
<img class="lazy" data-original="img/example.jpg" width="765" height="574">
<img class="lazy" src="img/example-thumb.jpg" data-original="img/example.jpg" width="765" height="574">
```

```js
$(".lazy").lazyload();
```

## Install

This is still work in progree. There are no releases yet. In the meanwhile you can use rawgit.

```
$ wget https://rawgit.com/tuupola/jquery_lazyload/2.x/lazyload.js
```

# License

All code licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php). All images licensed under [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/deed.en_US). In other words you are basically free to do whatever you want. Just don't remove my name from the source.

