# Lazy Load Plugin for jQuery

Lazy Load delays loading of images in long web pages. Images outside of viewport wont be loaded before user scrolls to them. This is opposite of image preloading.

Using Lazy Load on long web pages containing many large images makes the page load faster. Browser will be in ready state after loading visible images. In some cases it can also help to reduce server load.

Lazy Load is inspired by [YUI ImageLoader](http://developer.yahoo.com/yui/imageloader/) Utility by Matt Mlinac.

## How to Use?

Lazy Load depends on jQuery. Include them both in end of your HTML code:

```html
<script src="jquery.js" type="text/javascript"></script>
<script src="jquery.lazyload.js" type="text/javascript"></script>
```

You must alter your HTML code. URL of the real image must be put into data-original attribute. It is good idea to give Lazy Loaded image a specific class. This way you can easily control which images plugin is binded to. Note that you should have width and height attributes in your image tag.

```html
<img class="lazy" data-original="img/example.jpg" width="640" height="480">
```

then in your code do:

```js
$("img.lazy").lazyload();
```

This causes all images of class lazy to be lazy loaded.

More information on [Lazy Load](http://www.appelsiini.net/projects/lazyload) project page.

## Install

You can install with [bower](http://bower.io/) or [npm](https://www.npmjs.com/).


```sh
$ bower install jquery.lazyload
$ npm install jquery-lazyload
```

## API

```js
$('img.lazy').lazyload({
  threshold       : 0,                // images to load earlier use threshold parameter
  failure_limit   : 0,                // the maximum failure limit before giving up
  event           : "scroll",         // custom event type
  effect          : "show",           // can also be 'fadeIn', etc.
  container       : window,           // img containers
  data_attribute  : "original",       // custom data-* attribute name
  skip_invisible  : false,            // dealing With Invisible Images
  skip_all        : false,            // donot load all the imgs, useful when only watch the callback events.
  appear          : null,             // callback before loading the img
  load            : null,             // callback after loading the img
  placeholder     : "data:base644..." // placeholder img
})
```

# License

All code licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php). All images licensed under [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/deed.en_US). In other words you are basically free to do whatever you want. Just don't remove my name from the source.

