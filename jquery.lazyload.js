/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2008 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Revision: $Id$
 * Version:  1.3.0
 *
 */
(function($) {

    $.fn.lazyload = function(options) {
        var settings = {
            threshold    : 0,
            failurelimit : 0,
            event        : "scroll",
            effect       : "show"
        };
                
        if(options) {
            $.extend(settings, options);
        }

        /* Fire one scroll event per scoll. Not one scroll event per image. */
        var elements = this;
        if ("scroll" == settings.event) {
            $(window).bind("scroll", function(event) {
                var counter = 0;
                elements.each(function() {
                    if (!$.belowthefold(this, settings) &&
                        !$.rightoffold(this, settings)) {
                            $(this).trigger("appear");
                    } else {
                        if (counter++ > settings.failurelimit) {
                            return false;
                        }
                    }
                });
                /* Remove image from array so it is not looped next time. */
                var temp = $.grep(elements, function(element) {
                    return !element.loaded;
                });
                elements = $(temp);
            });
        }
        
        return this.each(function() {
            var self = this;
        
            /* TODO: use .data() instead of .attr() */
            $(self).attr("original", $(self).attr("src"));
            if ("scroll" != settings.event 
                         || $.belowthefold(self, settings) 
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
            
            /* When appear is triggered load original image. */
            $(self).one("appear", function() {
                if (!this.loaded) {
                    $("<img>")
                        .attr("src", $(self).attr("original"))
                        .bind("load", function() {
                            $(self)
                                .hide()
                                .attr("src", $(self).attr("original"))
                                [settings.effect](settings.effectspeed);
                            self.loaded = true;
                        });                    
                };
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if ("scroll" != settings.event) {
                $(self).bind(settings.event, function(event) {
                    if (!self.loaded) {
                        $(self).trigger("appear");
                    }
                });
            }
        });

    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100}) */

    $.belowthefold = function(element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };
    
    $.rightoffold = function(element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };
    
    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() */

    $.extend($.expr[':'], {
        "below-the-fold" : "$.belowthefold(a, {threshold : 0})",
        "above-the-fold" : "!$.belowthefold(a, {threshold : 0})",
        "right-of-fold"  : "$.rightoffold(a, {threshold : 0})",
        "left-of-fold"   : "!$.rightoffold(a, {threshold : 0})"
    });
    
})(jQuery);
