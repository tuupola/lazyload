/*!
 * Lazy Load - JavaScript plugin for lazy loading images
 *
 * Copyright (c) 2007-2017 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   https://appelsiini.net/projects/lazyload
 *
 * Version: 2.0.0-beta.2
 *
 */

(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = factory(root);
    } else if (typeof define === "function" && define.amd) {
        define([], factory(root));
    } else {
        root.LazyLoad = factory(root);
    }
}) (typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    "use strict";

    const defaults = {
        src: "data-src",
        srcset: "data-srcset",
        selector: ".lazyload"
    };

    /**
    * Merge two or more objects. Returns a new object.
    * @private
    * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
    * @param {Object}   objects  The objects to merge together
    * @returns {Object}          Merged values of defaults and options
    */
    const extend = function ()  {

        let extended = {};
        let deep = false;
        let i = 0;
        let length = arguments.length;

        /* Check if a deep merge */
        if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
            deep = arguments[0];
            i++;
        }

        /* Merge the object into the extended object */
        let merge = function (obj) {
            for (let prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    /* If deep merge and property is an object, merge properties */
                    if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        /* Loop through each object and conduct a merge */
        for (; i < length; i++) {
            let obj = arguments[i];
            merge(obj);
        }

        return extended;
    };

    function LazyLoad(images, options) {
        this.settings = extend(defaults, options || {});
        this.images = images || document.querySelectorAll(this.settings.selector);
        this.observer = null;
        this.init();
    }

    LazyLoad.prototype = {
        init: function() {

            let self = this;
            let observerConfig = {
                root: null,
                rootMargin: "0px",
                threshold: [0]
            };
            
         var io=(root.IntersectionObserver?root.IntersectionObserver:this.IntersectionObserver); 
         
         this.observer = new io(function(entries) {
                entries.forEach(function (entry) {
                    if (entry.intersectionRatio > 0) {
                        self.observer.unobserve(entry.target);
                        let src = entry.target.getAttribute(self.settings.src);
                        let srcset = entry.target.getAttribute(self.settings.srcset);
                        if ("img" === entry.target.tagName.toLowerCase()) {
                            if (src) {
                                entry.target.src = src;
                            }
                            if (srcset) {
                                entry.target.srcset = srcset;
                            }
                        } else {
                            entry.target.style.backgroundImage = "url(" + src + ")";
                        }
                    }
                });
            }, observerConfig);

            this.images.forEach(function (image) {
                self.observer.observe(image);
            });
        },

        loadAndDestroy: function () {
            if (!this.settings) { return; }
            this.loadImages();
            this.destroy();
        },

        loadImages: function () {
            if (!this.settings) { return; }

            let self = this;
            this.images.forEach(function (image) {
                let src = image.getAttribute(self.settings.src);
                let srcset = image.getAttribute(self.settings.srcset);
                if ("img" === image.tagName.toLowerCase()) {
                    if (src) {
                        image.src = src;
                    }
                    if (srcset) {
                        image.srcset = srcset;
                    }
                } else {
                    image.style.backgroundImage = "url(" + src + ")";
                }
            });
        },

        destroy: function () {
            if (!this.settings) { return; }
            this.observer.disconnect();
            this.settings = null;
        }
    };

    
  LazyLoad.prototype.IntersectionObserver=function (callback,options_in){
 
      var o={ 	
         root:window,
         rootMargin:null, //Margin around the root. Can have values similar to the css margin property: "10px 20px 30px 40px" (t
         threshold:null, //  indicate at what % of visiblity of the target [0, 0.25, 0.5, 0.75, 1]

         offset:1, //Смешение срабатывания[-1 весь объект, >0 часть что сверху на столько пикселей]
         offsetTop:options_in && options_in.offset?options_in.offset:100, //Увеличение верхней границы экрана для срабатывания
         offsetBottom:options_in && options_in.offset?options_in.offset:100, //Увеличение нижней границы экрана для срабатывания
      };
      $.extend(o,options_in);	
      o.root=o.root?o.root:window;



      var observe_objects=[];

      this.observe=function(object){
         observe_objects[observe_objects.length]=object;         
      }

      this.unobserve=function(object){
         var objects=[];
         observe_objects.forEach(function (each_object) {
            if (each_object!=object) 
               objects[objects.length]=each_object;         
         });           
         observe_objects=objects;
      }
      
      var check_viewport=function(){
         var root_scroll_top=$(o.root).scrollTop()-o.offsetTop;
         var root_height=$(o.root).height()+o.offsetTop+o.offsetBottom;

         /*
   		entry.time;               // a DOMHightResTimeStamp indicating when the intersection occurred.
        entry.rootBounds;         // a DOMRectReadOnly for the intersection observer's root.
        entry.boundingClientRect; // a DOMRectReadOnly for the intersection observer's target.
        entry.intersectionRect;   // a DOMRectReadOnly for the visible portion of the intersection observer's target.
        entry.intersectionRatio;  // the number for the ratio of the intersectionRect to the boundingClientRect.
        entry.target;             // the Element whose intersection with the intersection root changed.
*/           

         observe_objects.forEach(function(each_object) {
            var object=each_object;
            var $object=$(each_object);

            var object_height=$object.height();            
            var object_top=$object.offset().top;            
 
            if (object_top+object_height<root_scroll_top+root_height && object_top>root_scroll_top ||
            	object_top<root_scroll_top+root_height && object_top+object_height>root_scroll_top+root_height ||
               object_top<root_scroll_top && object_top+object_height>root_scroll_top
               ){ 
               
               var ret={};
               ret.intersectionRatio=1;
               ret.target=object;
               callback([ret]);
            }
         });

      }

      $(o.root).off('scroll.IntersectionObserver, load.IntersectionObserver, resize.IntersectionObserver').on('scroll.IntersectionObserver, load.IntersectionObserver, resize.IntersectionObserver',check_viewport)       
      check_viewport();
   }  

    
    root.lazyload = function(images, options) {
        return new LazyLoad(images, options);
    };

    if (root.jQuery) {
        const $ = root.jQuery;
        $.fn.lazyload = function (options) {
            options = options || {};
            options.attribute = options.attribute || "data-src";
            new LazyLoad($.makeArray(this), options);
            return this;
        };
    }

    return LazyLoad;
});
