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
 * Version:  1.5.1
 *
 */
(function ($,window) {

    $.fn.lazyload = function(options) {
        // $.offset.top() reports wrong position after scroll
        // http://bugs.jquery.com/ticket/6446
        var fixedOffset = function (e) {
            var result = $(e).offset();
            if ( /; CPU.*OS (?:3_2|4_0)/i.test(navigator.userAgent)
              && 'getBoundingClientRect' in document.documentElement) {
                result.top -= window.scrollY;
                result.left -= window.scrollX;
            }
            return result;
        };
        
        var FALSE = !1
          , ORIGINAL = 'original'
          , SRC = 'src'
          , TRUE = !FALSE
          , elements = this
          , settings = { threshold: 0
                       , container: window
                       , effect: 'show'
                       , namespace: '.lazyload'
                       };
                       
        if(options) $.extend(settings, options);
       
        var container = $(settings.container)
          , namespace = settings.namespace
          , APPEAR = 'appear' + namespace
          , RESIZE = 'resize' + namespace
          , SCROLL = 'scroll' + namespace;
        
        var isInViewport = function (element) {
            element = $(element);
            if (!element.length) return false;

            var threshold = settings.threshold
              , offset;

            if (container[0] === window) {
                var bottom = container.height() + container.scrollTop()
                  , left = container.scrollLeft()
                  , right = container.width() + container.scrollLeft()
                  , top = container.scrollTop();
            } else {
                offset = fixedOffset(container);
                var bottom = offset.top + container.height()
                  , left = offset.left
                  , right = offset.left + container.width()
                  , top = offset.top;
            }
            
            offset = fixedOffset(element);
            var elementBottom = offset.top + element.height()
              , elementLeft = offset.left
              , elementRight = offset.left + element.width()
              , elementTop = offset.top;
              
            return (elementTop + threshold) <= bottom
                && (elementLeft + threshold) <= right
                && (elementBottom - threshold) >= top
                && (elementRight - threshold) > left;
        };

        elements.each(function () {
            var e = this;
            
            // skip visible images
            if (isInViewport($(e)) && !$(e).attr(ORIGINAL)) {
                e.loaded = TRUE;
                return;
            }

            // Save original or src attribute
            $(e).data(ORIGINAL, $(e).attr(ORIGINAL) || $(e).attr(SRC));
            
            if ( !$(e).attr(SRC)
              || settings.placeholder === $(e).attr(SRC) 
              || (!isInViewport($(e)))) {

                settings.placeholder
                ? $(e).attr(SRC, settings.placeholder)
                : $(e).removeAttr(SRC);
                
                e.loaded = FALSE;
            }

            // When appear is triggered load original image.
            $(e).one(APPEAR, function() {
                if (this.loaded) return;
                $("<img />").load(function() {
                    $(e).hide()
                        .attr(SRC, $(e).data(ORIGINAL))
                        [settings.effect](settings.effectSpeed)
                        .removeData(ORIGINAL);
                    e.loaded = TRUE;
                }).attr(SRC, $(e).data(ORIGINAL));
            });
        });
        
        container.bind(SCROLL+' '+RESIZE, function () {
            var counter = 0;
            elements.each(function() {
                var e = this;
                if (isInViewport(e) && !e.loaded) $(e).trigger(APPEAR);
            });
            
            // Remove image from array so it is not looped next time.
            elements = $($.grep(elements, function(e) {
                return !e.loaded;
            }));
            
            // stop binding if every elements are loaded
            if (!elements.length) container.unbind(namespace);
        })
        // trigger event once loaded
        .trigger(SCROLL);

        return this;
    };
})(jQuery,window);
