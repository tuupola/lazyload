(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory(root));
    } else if (typeof exports === "object") {
        module.exports = factory(root);
    } else {
        root.LazyLoad = factory(root);
    }
}) (typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    "use strict";

    const defaults = {
        attribute: "data-src",
        selector: "[data-src]"
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

            /* Without observers load everything and bail out early. */
            if (!root.IntersectionObserver) {
                this.load();
                return;
            }

            let self = this;
            let observerConfig = {
                root: null,
                rootMargin: "0px",
                threshold: [0]
            };

            this.observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0) {
                        self.observer.unobserve(entry.target);
                        let original = entry.target.getAttribute(self.settings.attribute);
                        if ("img" === entry.target.tagName.toLowerCase()) {
                            entry.target.src = original;
                        } else {
                            entry.target.style.backgroundImage = "url(" + original + ")";
                        }
                    }
                });
            }, observerConfig);

            this.images.forEach(image => {
                this.observer.observe(image);
            });
        },

        loadAndDestroy: function () {
            if (!this.settings) { return; }
            this.load();
            this.destroy();
        },

        load: function () {
            if (!this.settings) { return; }
            this.images.forEach(image => {
                image.src = image.getAttribute(this.settings.attribute);
            });
        },

        destroy: function () {
            if (!this.settings) { return; }
            console.log(this.settings);

            this.observer.disconnect();
            this.settings = null;
        }
    };

    root.lazyload = function(images, options) {
        return new LazyLoad(images, options);
    }

    /* TODO: jQuery support should be opt-in. */
    if(window.jQuery) {
        const $ = window.jQuery;
        $.fn.lazyload = function (options) {
            new LazyLoad($.makeArray(this), options);
            return this;
        };
    }

    return LazyLoad;
});
