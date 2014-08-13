/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.3
 *
 */
 /*
 * Modifications by mont@foray.com 2013-10-22
 * 
 * Changes are commented in-line.
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
            appear          : null,
            load            : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;
      
            /* mont@foray.com - 2013-10-22
             * For large numbers of images the fold methods were very expensive due
             * to repeatedly fetching the same values from the window/container.
             * These values are now calculated once and passed into the fold methods.
             */
            var belowFold;
            var rightFold;
            var aboveFold;
            var leftFold;

            if (settings.container === undefined || settings.container === window) {
                belowFold = $window.height() + $window.scrollTop();
                rightFold = $window.width() + $window.scrollLeft();
                aboveFold = $window.scrollTop();
                leftFold = $window.scrollLeft();
            }
            else {
                var containerOffset = $(settings.container).offset();
                belowFold = containerOffset.top + $(settings.container).height();
                rightFold = containerOffset.left + $(settings.container).width();
                aboveFold = containerOffset.top;
                leftFold = containerOffset.left;
            }

            /* mont@foray.com - 2013-10-22
             * To avoid looping through all elements the relative position in the scroll area is determined.  
             * This only supports either vertical or horizontal scrolling, not both.
             * If a container has not been set then the window is assumed to be scrolling vertically
             */
            var scrollPosition;
            var scrollMax;
            var percentScrolled = 0;

            if (settings.container === undefined || settings.container === window) {
                scrollPosition = $window.scrollTop();
                scrollMax = $window.scrollHeight();
            }
            else if ($(settings.container).css('overflow-x') == 'hidden') { // Scroll vertically
                scrollPosition = $(settings.container).scrollTop();
                scrollMax = settings.container[0].scrollHeight;
            }
            else { // Scrolling horizontally
                scrollPosition = $(settings.container).scrollLeft();
                scrollMax = settings.container[0].scrollWidth;
            }

            if (scrollPosition != 0) percentScrolled = scrollPosition / scrollMax;

            var elementsSelector = elements.selector;

            /* mont@foray.com - 2013-10-22
             * Filtering the elemets for only those that are visible is much   
             * faster than checking each individually.
             */
            var tempElements;

            if (settings.skip_invisible) tempElements = elements.filter(':visible');
            else tempElements = elements;

            if (tempElements.length == 0) return;

            var startElement = Math.floor(tempElements.length * percentScrolled);

            /* mont@foray.com - 2013-10-22
             * Since the code is jumping ahead rather than looping through all 
             * elements it must check backwards from the startElement.  This will 
             * find partially displayed elements at the top.
             */            
            for (var index = startElement -1; index >= 0; index--) {
                var $element = tempElements.eq([index]);

                if (!$.abovethetop(aboveFold, $element, settings.threshold) &&
                    !$.leftofbegin(leftFold, $element, settings.threshold) &&
                    !$.belowthefold(belowFold, $element, settings.threshold) &&
                    !$.rightoffold(rightFold, $element, settings.threshold)) // Visible
                {
                    $element.trigger("appear");
                    continue;
                }

                break; // Found a not visible element, so stop.
            }

            /* mont@foray.com - 2013-10-22
             * Check forwards from the startElement.  After displaying elements 
             * stop at the first not visible element
             */
            for (var index = startElement; index < tempElements.length; index++) {
                var $element = $(tempElements[index]);

                if ($.abovethetop(aboveFold, $element, settings.threshold) || $.leftofbegin(leftFold, $element, settings.threshold)) continue; // Not visible
                else if (!$.belowthefold(belowFold, $element, settings.threshold) && !$.rightoffold(rightFold, $element, settings.threshold)) // Visible
                {
                    $element.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                }
                else { // Found a not visible element after visible ones, therefore stop looking.
                    if (++counter > settings.failure_limit) break;
                }
            }
        }

        if(options) {
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
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            var $srcAttr = $self.attr("src");

            if ($srcAttr === undefined || $srcAttr === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }
            
            /* When appear is triggered load original image. */
            $self.one("appear", function () {
                if (this.loaded) return;

                if (settings.appear) {
                    var elements_left = elements.length;
                    settings.appear.call(self, elements_left, settings);
                }

                $("<img />")
                    .bind("load", function () {
                        var original = $self.attr("data-" + settings.data_attribute);
                        $self.hide();
                        if ($self.is("img")) {
                            $self.attr("src", original);
                        } else {
                            $self.css("background-image", "url('" + original + "')");
                        }
                        $self[settings.effect](settings.effect_speed);

                        self.loaded = true;

                        /* mont@foray.com - 2013-10-22
                         * Removing displayed elements from the array was slow and is no longer necessary due to jumping ahead in Update().
                         */            

                        if (settings.load) {
                            var elements_left = elements.length;
                            settings.load.call(self, elements_left, settings);
                        }
                    })
                    .attr("src", $self.attr("data-" + settings.data_attribute));
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });
              
        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });
        
        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    /* mont@foray.com - 2013-10-22
     * All of the fold methods were modified due to the high cost of re-calcualting
     * the fold value.
     */
    $.belowthefold = function (fold, $element, threshold) {
        return fold <= $element.offset().top - threshold;
    };
    
    $.rightoffold = function (fold, $element, threshold) {
        return fold <= $element.offset().left - threshold;
    };
        
    $.abovethetop = function (fold, $element, threshold) {
        var elementTop = $element.offset().top;
        
        if (fold < elementTop + threshold) return false;

        return fold >= elementTop + threshold  + $element.height();
    };
    
    $.leftofbegin = function (fold, $element, threshold) {
        var elementLeft = $element.offset().left;

        if (fold < elementLeft + threshold) return false;

        return fold >= elementLeft + threshold + $element.width();
    };

    $.inviewport = function (element, settings) {
        var belowFold;
        var rightFold;
        var aboveFold;
        var leftFold;

        if (settings.container === undefined || settings.container === window)
        {
            belowFold = $window.height() + $window.scrollTop();
            rightFold = $window.width() + $window.scrollLeft();
            aboveFold = $window.scrollTop();
            leftFold = $window.scrollLeft();
        }
        else
        {
            var containerOffset = $(settings.container).offset();
            belowFold = containerOffset.top + $(settings.container).height();
            rightFold = containerOffset.left + $(settings.container).width();
            aboveFold = containerOffset.top;
            leftFold = containerOffset.left;
        }

        return !$.rightoffold(rightFold, element, settings) && !$.leftofbegin(leftfold, element, settings) &&
               !$.belowthefold(belowFold, element, settings) && !$.abovethetop(aboveFold, element, settings);
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
