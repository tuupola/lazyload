/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.5.0
 *
 */
(function ($,window) {

    $.fn.lazyload = function(options) {

        // Does not work on mobiles so we return
        if (navigator.userAgent.match(/Android|iPhone|iPod|iPad/)) return this;

        var APPEAR = 'appear'
          , FALSE = !1
          , ORIGINAL = 'original'
          , SCROLL = 'scroll'
          , SRC = 'src'
          , TRUE = !FALSE
          , elements = this
          , settings = { threshold: 0
                       , failurelimit: 0
                       , event: SCROLL
                       , effect: "show"
                       , container: window
                       };
                       
       /* Convenience methods in jQuery namespace.           */
       /* Use as  belowthefold(element, {threshold : 100, container : window}) */

       var belowthefold = function(element) {
           var fold = (!settings.container || settings.container === window)
                    ? $(window).height() + $(window).scrollTop()
                    : $(settings.container).offset().top + $(settings.container).height();

           return fold <= $(element).offset().top - settings.threshold;
       };

       var rightoffold = function(element) {
           var fold = (!settings.container || settings.container === window)
                    ? $(window).width() + $(window).scrollLeft()
                    : $(settings.container).offset().left + $(settings.container).width();

           return fold <= $(element).offset().left - settings.threshold;
       };

       var abovethetop = function(element) {
           var fold = (!settings.container || settings.container === window)
                    ? $(window).scrollTop()
                    : $(settings.container).offset().top;

           return fold >= $(element).offset().top + settings.threshold  + $(element).height();
       };

       var leftofbegin = function(element) {
           var fold = (!settings.container || settings.container === window)
                    ? $(window).scrollLeft()
                    : $(settings.container).offset().left;

           return fold >= $(element).offset().left + settings.threshold + $(element).width();
       };
           
        if(options) $.extend(settings, options);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (settings.event === SCROLL) {
            $(settings.container).bind(SCROLL, function(event) {
                var counter = 0;
                elements.each(function() {
                    if (abovethetop(this, settings) ||
                        leftofbegin(this, settings)) {
                            /* Nothing. */
                    } else if (!belowthefold(this, settings) &&
                        !rightoffold(this, settings)) {
                            $(this).trigger(APPEAR);
                    } else if (counter++ > settings.failurelimit) {
                        return FALSE;
                    }
                });
                /* Remove image from array so it is not looped next time. */
                var temp = $.grep(elements, function(element) {
                    return !element.loaded;
                });
                elements = $(temp);
            });
        }

        this.each(function() {
            var self = this;

            /* Save original only if it is not defined in HTML. */
            if (!$(self).data(ORIGINAL)) {
                $(self).data(ORIGINAL, $(self).attr(SRC));
            }

            if ( settings.event !== SCROLL ||
                    !$(self).attr(SRC) ||
                    settings.placeholder == $(self).attr(SRC) ||
                    (abovethetop(self, settings) ||
                     leftofbegin(self, settings) ||
                     belowthefold(self, settings) ||
                     rightoffold(self, settings) )) {

                if (settings.placeholder) {
                    $(self).attr(SRC, settings.placeholder);
                } else {
                    $(self).removeAttr(SRC);
                }
                self.loaded = FALSE;
            } else {
                self.loaded = TRUE;
            }

            /* When appear is triggered load original image. */
            $(self).one(APPEAR, function() {
                if (!this.loaded) {
                    $("<img />").bind("load", function() {
                        $(self)
                            .hide()
                            .attr(SRC, $(self).data(ORIGINAL))
                            [settings.effect](settings.effectspeed);
                        self.loaded = TRUE;
                    })
                    .attr(SRC, $(self).data(ORIGINAL));
                } else {
                    $(self).attr(SRC, $(self).data(ORIGINAL));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (settings.event !== SCROLL) {
                $(self).bind(settings.event, function(event) {
                    if (!self.loaded) $(self).trigger(APPEAR);
                });
            }
        });

        /* Force initial check if images should appear. */
        $(settings.container).trigger(settings.event);

        return this;
        
        
    };

})(jQuery,window);
