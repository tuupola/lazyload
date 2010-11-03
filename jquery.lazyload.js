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
        if (navigator.userAgent.match(/Android|iPad/)) return this;

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
                       
       if(options) $.extend(settings, options);
                       
       /* Convenience methods in jQuery namespace.           */
       /* Use as  belowthefold(element, {threshold : 100, container : window}) */
       
        var isInViewport = function (element) {
            if (!element.length) return false;

            var container = $(settings.container)
              , threshold = settings.threshold;

            if (container[0] === window) {
                var bottom = container.height() + container.scrollTop()
                  , left = container.scrollLeft()
                  , right = container.width() + container.scrollLeft()
                  , top = container.scrollTop();
            } else {
                var bottom = container.offset().top + container.height()
                  , left = container.offset().left
                  , right = container.offset().left + container.width()
                  , top = container.offset().top;
            }

            var elementBottom = element.offset().top + element.height()
              , elementLeft = element.offset().left
              , elementRight = element.offset().left + element.width()
              , elementTop = element.offset().top;
              
            return (elementTop + threshold) <= bottom
                && (elementLeft + threshold) <= right
                && (elementBottom - threshold) >= top
                && (elementRight - threshold) > left;
        };
       

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (settings.event === SCROLL) {
            $(settings.container).bind(SCROLL, function () {
                var counter = 0;
                elements.each(function() {
                    if (isInViewport($(this))) {
                        $(this).trigger(APPEAR);
                    } else if (counter++ > settings.failurelimit) {
                        return FALSE;
                    }
                });
                /* Remove image from array so it is not looped next time. */
                elements = $($.grep(elements, function(element) {
                    return !element.loaded;
                }));
            });
        }

        this.each(function() {
            var self = this;

            /* Save original only if it is not defined in HTML. */
            if (!$(self).data(ORIGINAL)) {
                $(self).data(ORIGINAL, $(self).attr(SRC));
            }

            if ( settings.event !== SCROLL 
              || !$(self).attr(SRC) 
              || settings.placeholder == $(self).attr(SRC) 
              || (!isInViewport($(self)))) {

                settings.placeholder
                ? $(self).attr(SRC, settings.placeholder)
                : $(self).removeAttr(SRC);
                
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
