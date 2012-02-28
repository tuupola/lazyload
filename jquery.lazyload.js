/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2012 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.7.2
 *
 */
(function($, window) {

    $window = $(window);
    var data = {
        settings: {
                threshold       : 0,
                failure_limit   : 0,
                event           : "scroll",
                effect          : "show",
                container       : window,
                data_attribute  : "original",
                skip_invisible  : true,
                appear          : null,
                load            : null
            }
    };

    var methods = {
        init:       function(options){
            var elements = this;
            data.elements = elements;
            if(options) {
                /* Maintain BC for a couple of versions. */
                if (undefined !== options.failurelimit) {
                    options.failure_limit = options.failurelimit; 
                    delete options.failurelimit;
                }
                if (undefined !== options.effectspeed) {
                    options.effect_speed = options.effectspeed; 
                    delete options.effectspeed;
                }

                $.extend(data['settings'], options);
            }
            
            /* Cache container as jQuery as object. */
            $container = (data['settings'].container === undefined ||
                          data['settings'].container === window) ? $window : $(data['settings'].container);

            /* Fire one scroll event per scroll. Not one scroll event per image. */
            if (0 === data['settings'].event.indexOf("scroll")) {
                $container.bind(data['settings'].event, function(event) {
                    return methods.update.apply(this);
                });
            }

            this.each(function() {
                var self = this;
                var $self = $(self);

                self.loaded = false;

                /* When appear is triggered load original image. */
                $self.one("appear", function() {
                    if (!this.loaded) {
                        if (data['settings'].appear) {
                            var elements_left = elements.length;
                            data['settings'].appear.call(self, elements_left, settings);
                        }
                        $("<img />")
                            .bind("load", function() {
                                $self
                                    .hide()
                                    .attr("src", $self.data(data['settings'].data_attribute))
                                    [data['settings'].effect](data['settings'].effect_speed);
                                self.loaded = true;

                                /* Remove image from array so it is not looped next time. */
                                var temp = $.grep(elements, function(element) {
                                    return !element.loaded;
                                });
                                elements = $(temp);

                                if (data['settings'].load) {
                                    var elements_left = elements.length;
                                    data['settings'].load.call(self, elements_left, data['settings']);
                                }
                            })
                            .attr("src", $self.data(data['settings'].data_attribute));
                    }
                });

                /* When wanted event is triggered load original image */
                /* by triggering appear.                              */
                if (0 !== data['settings'].event.indexOf("scroll")) {
                    $self.bind(data['settings'].event, function(event) {
                        if (!self.loaded) {
                            $self.trigger("appear");
                        }
                    });
                }
            });

            /* Check if something appears when window is resized. */
            $window.bind("resize", function(event) {
                methods.update.apply(this);
            });

            /* Force initial check if images should appear. */
            methods.update.apply(this);
            
            return this;
        },

        update:     function(){
            var counter = 0;
            
            if(data.elements !== undefined)
            {
                data.elements.each(function() {
                    var $this = $(this);
                    if (data.settings.skip_invisible && $this.is(":hidden")) {
                        return;
                    }
                    if ($.abovethetop(this, data.settings) ||
                        $.leftofbegin(this, data.settings)) {
                            /* Nothing. */
                    } else if (!$.belowthefold(this, data.settings) &&
                        !$.rightoffold(this, data.settings)) {
                            $this.trigger("appear");
                    } else {
                        if (++counter > data.settings.failure_limit) {
                            return false;
                        }
                    }
                });
            }
            return this;
        }
    }

    $.fn.lazyload = function( method ) {
        if ( methods[method] ) {
          return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }    
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.height() + $window.scrollTop();
        } else {
            fold = $container.offset().top + $container.height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };
    
    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $container.offset().left + $container.width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };
        
    $.abovethetop = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $container.offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };
    
    $.leftofbegin = function(element, settings) {
        var fold;
        
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $container.offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && 
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() */

    $.extend($.expr[':'], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0, container: window}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0, container: window}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0, container: window}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0, container: window}); },
        "in-viewport"    : function(a) { return !$.inviewport(a, {threshold : 0, container: window}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0, container: window}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0, container: window}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0, container: window}); }
    });

})(jQuery, window);
