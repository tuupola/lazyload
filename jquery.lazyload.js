/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Revision: $Id$
 *
 */
(function($) {

    $.fn.lazyload = function(options) {
        var settings = {
            threshold : 0,
            failurelimit : 0
        };
                
        if(options) {
            $.extend(settings, options);
        };

        /* Fire one scroll event per scoll. Not one scroll event per image. */
        var elements = this;
        if (!settings.event) {
            $(window).bind("scroll", function(event) {
                var counter = 0;
                elements.each(function() {
                    if (!$.belowthefold(this, settings) 
                        && !$.rightoffold(this, settings)) {
                            $(this).attr("src", $(this).attr("original"));
                            this.loaded = true;
                    } else {
                        if (counter++ > settings.failurelimit) {
                            return false;
                        };
                    }
                });
                /* Remove image from array so it is not looped next time. */
                var temp = $.grep(elements, function(element) {
                    return !element.loaded;
                });
                elements = $(temp);
            });
        };

        return this.each(function() {
            var self = this;
        
            /* TODO: why to use attr? Possible memory leak. */
            $(self).attr("original", $(self).attr("src"));
            if (settings.event || $.belowthefold(self, settings) 
                               || $.rightoffold(self, settings)) {
                if (settings.placeholder) {
                    $(self).attr("src", settings.placeholder);                    
                } else {
                    $(self).removeAttr("src");
                }
                self.loaded = false;
            } else {
                self.loaded = true;
            }

            if (settings.event) {
                $(self)[settings.event](function(event) {
                    if (!self.loaded) {
                        $(self).attr("src", $(self).attr("original"));   
                        self.loaded = true;
                    };
                });
            };
        });

    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100}) */

    $.belowthefold = function(element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    }
    
    $.rightoffold = function(element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    }
    
    /* Custom selectors for your convenience.   */
    /* Use as $("img:belowthefold").something() */

    $.extend($.expr[':'], {
        belowthefold : "$.belowthefold(a, {threshold : 0})",
        abovethefold : "!$.belowthefold(a, {threshold : 0})",
        rightoffold  : "$.rightoffold(a, {threshold : 0})",
        leftoffold   : "!$.rightoffold(a, {threshold : 0})"
    });
    
})(jQuery);

