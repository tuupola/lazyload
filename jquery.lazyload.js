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
        // if (navigator.userAgent.match(/Android|iPad/)) return this;

        var FALSE = !1
          , ORIGINAL = 'original'
          , SCROLL = 'scroll'
          , SRC = 'src'
          , TRUE = !FALSE
          , elements = this
          , settings = { threshold: 0
                       , container: window
                       , failurelimit: 0
                       , event: SCROLL
                       , effect: "show"
                       , namespace: '.lazyload'
                       };
                       
        if(options) $.extend(settings, options);
       
        var container = $(settings.container)
          , namespace = settings.namespace
          , event = settings.event + namespace
          , appear = 'appear' + namespace;
        
        var isInViewport = function (element) {
            element = $(element);
            if (!element.length) return false;

            var threshold = settings.threshold;

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
        
        // based on :
        // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
        if (navigator.userAgent.match(/Android|iPad/)) isInViewport = function (e) {
            if (!e) return false;

            var top = 0
            , left = 0
            , width = e.offsetWidth
            , height = e.offsetHeight;

            do {
                e.offsetParent;
                top += e.offsetTop;
                left += e.offsetLeft;
            } while(e = e.offsetParent)

            return top < (window.pageYOffset + window.innerHeight)
                && left < (window.pageXOffset + window.innerWidth)
                && (top + height) > window.pageYOffset
                && (left + width) > window.pageXOffset;
        };

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (settings.event === SCROLL) {
            container.bind(event, function () {
                var counter = 0;
                elements.each(function() {
                    //alert(isInViewport($(this)) + "|" + isInViewport2(this))
                    if (isInViewport(this)) {
                        $(this).trigger(appear);
                    } else if (settings.failurelimit && (counter++ > settings.failurelimit)) {
                        return FALSE;
                    }
                });
                /* Remove image from array so it is not looped next time. */
                elements = $($.grep(elements, function(e) {
                    if (e.loaded) $(e).removeData(ORIGINAL);
                    return !e.loaded;
                }));
                
                if (!elements.length) container.unbind(namespace);
            });
        }

        this.each(function() {
            var self = this;

            /* Save original only if it is not defined in HTML. */
            if (!$(self).data(ORIGINAL)) {
                $(self).data(ORIGINAL, $(self).attr(SRC));
            }
            
            if (isInViewport($(self))) {
                self.loaded = TRUE;
            } else if ( settings.event !== SCROLL 
              || !$(self).attr(SRC) 
              || settings.placeholder === $(self).attr(SRC) 
              || (!isInViewport($(self)))) {

                settings.placeholder
                ? $(self).attr(SRC, settings.placeholder)
                : $(self).removeAttr(SRC);
                
                self.loaded = FALSE;
            }

            /* When appear is triggered load original image. */
            $(self).one(appear, function() {
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
                $(self).bind(event, function(event) {
                    if (!self.loaded) $(self).trigger(appear);
                });
            }
        });

        /* Force initial check if images should appear. */
        container.trigger(event);

        return this;
    };
})(jQuery,window);
