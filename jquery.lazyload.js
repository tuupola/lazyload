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
            placeholder : "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
        };
                
        if(options) {
            $.extend(settings, options);
        };

        return this.each(function() {
            var self = this;
            
            $(self).attr("original", $(self).attr("src"));
            if ($.belowthefold(self, settings)) {
                $(self).attr("src", settings.placeholder);                
                self.loaded = false;
            }

            $(window).bind("scroll", function(event) {
                if (!self.loaded && $.abovethefold(self, settings)) {
                    $(self).attr("src", $(self).attr("original"));   
                    self.loaded = true;             
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

