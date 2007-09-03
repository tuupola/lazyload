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
            threshold : 0
        };
        
        if(options) {
            $.extend(settings, options);
        };

        return this.each(function() {
            var self = this;
            
            $(self).attr("original", $(self).attr("src"));
            if ($.belowthefold(self, settings)) {
                $(self).removeAttr("src");                
            }

            $(window).bind("scroll", function(event) {
                if (!$(self).attr("src") && $.abovethefold(self, settings)) {

                    $(self).attr("src", $(self).attr("original"));                
                };
            });
        });
    };

    $.belowthefold = function(element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    }

    $.abovethefold = function(element, settings) {
        return !$.belowthefold(element, settings);
    }
    
})(jQuery);

