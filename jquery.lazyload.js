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

        if(options) $.extend(settings, options);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (settings.event === SCROLL) {
            $(settings.container).bind(SCROLL, function(event) {

                var counter = 0;
                elements.each(function() {
                    if ($.abovethetop(this, settings) ||
                        $.leftofbegin(this, settings)) {
                            /* Nothing. */
                    } else if (!$.belowthefold(this, settings) &&
                        !$.rightoffold(this, settings)) {
                            $(this).trigger(APPEAR);
                    } else if (counter++ > settings.failurelimit) {
                        return false;
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
            if (!$(self).attr(ORIGINAL)) {
                $(self).attr(ORIGINAL, $(self).attr(SRC));
            }

            if ( settings.event !== SCROLL ||
                    !$(self).attr(SRC) ||
                    settings.placeholder == $(self).attr(SRC) ||
                    ($.abovethetop(self, settings) ||
                     $.leftofbegin(self, settings) ||
                     $.belowthefold(self, settings) ||
                     $.rightoffold(self, settings) )) {

                if (settings.placeholder) {
                    $(self).attr(SRC, settings.placeholder);
                } else {
                    $(self).removeAttr(SRC);
                }
                self.loaded = false;
            } else {
                self.loaded = true;
            }

            /* When appear is triggered load original image. */
            $(self).one(APPEAR, function() {
                if (!this.loaded) {
                    $("<img />").bind("load", function() {
                        $(self)
                            .hide()
                            .attr(SRC, $(self).attr(ORIGINAL))
                            [settings.effect](settings.effectspeed);
                        self.loaded = true;
                    })
                    .attr(SRC, $(self).attr(ORIGINAL));
                } else {
                    $(self).attr(SRC, $(self).attr(ORIGINAL));
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

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold = (!settings.container || settings.container === window)
                 ? $(window).height() + $(window).scrollTop()
                 : $(settings.container).offset().top + $(settings.container).height();

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold = (!settings.container || settings.container === window)
                 ? $(window).width() + $(window).scrollLeft()
                 : $(settings.container).offset().left + $(settings.container).width();

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold = (!settings.container || settings.container === window)
                 ? $(window).scrollTop()
                 : $(settings.container).offset().top;

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold = (!settings.container || settings.container === window)
                 ? $(window).scrollLeft()
                 : $(settings.container).offset().left;

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };
    
    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() */

    $.extend($.expr[':'], {
        "below-the-fold" : "$.belowthefold(a, {threshold : 0, container: window})",
        "above-the-fold" : "!$.belowthefold(a, {threshold : 0, container: window})",
        "right-of-fold"  : "$.rightoffold(a, {threshold : 0, container: window})",
        "left-of-fold"   : "!$.rightoffold(a, {threshold : 0, container: window})"
    });

})(jQuery,window);
