(function($) {
    
    $.fn.belowthefold = function(options) {
        var settings = {
            adjust     : 0
        };

        if(options) {
            $.extend(settings, options);
        };

        return this.each(function() {
            var self = this;

            $(self).attr("original", $(self).attr("src"));
            if ($.belowthefold(self)) {
                $(self).attr("src", "");                
            }

            $(document).bind("scroll", function(event) {
                if ($.abovethefold(self)) {
                    $(self).attr("src", $(self).attr("original"));                
                };
            });

        });
    };

    $.belowthefold = function(element, options) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top;
    }

    $.abovethefold = function(element, options) {
        return !$.belowthefold(element, options);
    }
    
})(jQuery);

