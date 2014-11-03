/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2014 Mika Tuupola
 * Contributors: Andrea Verlicchi
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.3-dev
 *
 */

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            show_on_appear  : false,
            appear          : null,
            load            : null,
            display         : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if (options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.on(settings.event, function() {
                return update();
            });
        }

	    /* Cycle every image in the set. */
        this.each(function() {

            var self = this;
            var $self = $(self);

            self.processed = false;

            /* When appear is triggered load original image. */
            $self.one("appear", function() {

                function setImageAndDisplay() {
                    /* Setting `src` in the original `img` */
                    var original = $self.data(settings.data_attribute);
                    if ($self.is("img")) {
                        $self.attr("src", original);
                    } else {
                        $self.css("background-image", "url('" + original + "')");
                    }
                }

                function removeFromArray() {
                    /* Remove image from array so it is not looped next time. */
                    self.processed = true;
                    var temp = $.grep(elements, function(element) {
                        return !element.processed;
                    });
                    elements = $(temp);
                }

                function callCallback(name) {
                    if (settings[name]) {
                        settings[name].call(self, elements.length, settings);
                    }
                }

                function showOnAppear() {
                    $self.one("load", function() {
                        callCallback("load");
                    });
                    removeFromArray();
                    setImageAndDisplay();
                    callCallback("display");
                }

                function showOnLoad() {
                    /* If no src attribute given use data:uri. */
                    if (!$self.attr("src")) {
                        $self.attr("src", settings.placeholder);
                    }
                    /* Creating a new `img` in a DOM fragment. */
                    $("<img />")
                        /* Listening to the load event on the DOM fragment's `img`. */
                        .one("load", function() {
                            /* Initially hide the img, to show it later, eventually with a show effect. */
                            $self.hide();
                            removeFromArray();
                            setImageAndDisplay();
                            /* Executing effect for effect_speed, and calling display callback. */
                            $self[settings.effect](settings.effect_speed);
                            callCallback("display");
                            callCallback("load");
                        })
                        /* Start loading the image source (reading from data attribute). */
                        .attr("src", $self.data(settings.data_attribute));
                }

                if (!self.processed) {

	                /* Calling the settings.appear function if declared. */
	                if (settings.appear) {
	                    settings.appear.call(self, elements.length, settings);
	                }

                    /* Forking behaviour depending on show_on_appear (true value is ideal for progressive jpeg). */
                    if (settings.show_on_appear) {
                        showOnAppear();
                    } else {
                        showOnLoad();
                    }
                }
            });
        
	        /* When wanted event is triggered load original image by triggering appear. */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.on(settings.event, function() {
                    if (!self.processed) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.on("resize", function() {
            update();
        });

        /* Force initial check if images should appear. */
        $(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);
