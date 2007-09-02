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
                $(self).attr("src", "");                
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

