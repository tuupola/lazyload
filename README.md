# Lazy Load Plugin for jQuery
Lazy Load delays loading of images in long web pages. Images outside of viewport wont be loaded before user scrolls to them. This is opposite of image preloading.

Using Lazy Load on long web pages containing many large images makes the page load faster. Browser will be in ready state after loading visible images. In some cases it can also help to reduce server load.

Lazy Load is inspired by [YUI ImageLoader](http://developer.yahoo.com/yui/imageloader/) Utility by Matt Mlinac.

## How to Use?
Lazy Load depends on jQuery. Include them both in end of your HTML code:

```html
<script src="jquery.js"></script>

<script src="jquery.lazyload.js"></script>
```

You must alter your HTML code. Put the place holder image into src attribute. Demo pages use 1×1 pixel grey gif. URL of the real image must be put into data-original attribute. It is good idea to give Lazy Loaded image a specific class. This way you can easily control which images plugin is binded to. Note that you should have width and height attributes in your image tag.

```html
<img class="lazy" src="img/grey.gif" data-original="img/example.jpg" width="640" heigh="480" />
```

Then in your code do:
```javascript
$("img.lazy").lazyload();
```

This causes all images of class lazy to be lazy loaded. 

More information on [Lazy Load](http://www.appelsiini.net/projects/lazyload) project page.

## License
All code licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php). All images licensed under [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/deed.en_US). In other words you are basically free to do whatever you want. Just don't remove my name from the source.

## Changelog

### 1.8.3
* Proper fix for [#48](https://github.com/tuupola/jquery_lazyload/pull/48). If image did not have width and height set Webkit browsers needed initial scroll for images to display. ([@sc-aboudreau](https://github.com/sc-aboudreau))

### 1.8.2
* Workaround for bug [#30](https://github.com/tuupola/jquery_lazyload/issues/30) IOS5 Safari did not load images when navigating with back button.

### 1.8.1
* Fix bug [#48](https://github.com/tuupola/jquery_lazyload/pull/48). In some cases initial scroll was needed for images to load. ([Nick George](https://github.com/Izzmo))
* Fix bug [#42](https://github.com/tuupola/jquery_lazyload/pull/42). Reset internal failure counter when image is found. Makes counter logic more intuitive. ([Josep del Rio](https://github.com/joseprio))
* Fix bug [#52](https://github.com/tuupola/jquery_lazyload/pull/42). Fix `:in-viewport` convenience method. ([Jonathan Palardy](https://github.com/jpalardy))

### 1.8.0
* Allow different elements to use different containers. ([Rob Walch](https://github.com/robwalch))

### 1.7.1
* Fix bug [#18](https://github.com/tuupola/jquery_lazyload/pull/18). Document was always scrolled to top issue on IE 7 and Chrome 17 if using jQuery 1.6 or older. ([Ross Allen](https://github.com/ssorallen))
* General code speedup ([Valentin Zwick](https://github.com/vzwick))

### 1.7.0
* Optimized viewport selectors. Around 25% [speed increase](http://jsperf.com/lazyload-1-7-0) compared to [1.6.0](http://jsperf.com/lazyload-1-6-0).
* Add `data_attribute` parameter. Allows custom naming of original data attribute. ([Bryan Chow](https://github.com/bryanchow))
* Track window resize event. ([Simon Baynes](https://github.com/baynezy))
* Add `appear` event. This function is called when image appears to viewport but before it is loaded.
* Add `load` event. This function is called when image is loaded. ([Nick Larson](https://github.com/ifightcrime))
* Renamed `effectspeed` parameter to `effect_speed`. Old version will still works couple of versions. This parameter was previously undocumented.
* Fix `failure_limit` bug [#19](https://github.com/tuupola/jquery_lazyload/issues/19). ([Brandon](https://github.com/Brandon0))

### 1.6.0
* Rename original attribute to `data-original` to be HTML5 friendly.
* Remove all code regarding placeholder and automatically removing `src` attribute. It does not work with modern browsers. Must use `data-original` attribute instead.
* Add support for James Padolseys [scrollstop event](http://james.padolsey.com/javascript/special-scroll-events-for-jquery/). Use when you have hundreds of images.
* Add `skip_invisible` parameter. When true plugin will skip invisible images. ([Valentin Zwick](https://github.com/vzwick))
* Renamed `failurelimit` parameter to `failure_limit`. Old version will still work couple of versions.

### 1.5.0
* Support for removing the src attribute already in HTML. This is not a drop in solution but gives additional speed for those who need it. (Jeremy Pollock)

### 1.4.0
* When scrolling down quickly do not load the images above the top. (Bart Bruil)

### 1.3.2
* Support for scrolling within a container.
* Fixed IE not loading images. 