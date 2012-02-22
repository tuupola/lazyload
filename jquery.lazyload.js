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
 * Version:  1.7.0
 *
 */
(function($, window) {

    $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var alternate_container = false;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : true,
            appear          : null,
            load            : null
        };

        var checkImages = function(check_window) {
          var counter = 0;
          var window_settings = {
            container: window,
            threshold: 0
          };

          elements.each(function() {
              var $this = $(this);
              if (settings.skip_invisible && !$this.is(":visible")) {return;}

              if ($this.loaded ||
                  $.abovethetop(this, settings) ||
                  $.leftofbegin(this, settings) ||
                  (check_window && (
                    $.abovethetop(this, window_settings) ||
                    $.leftofbegin(this, window_settings)
                  ))) {
                      /* Nothing. */
              } else if (!(
                  $.belowthefold(this, settings) ||
                  $.rightoffold(this, settings) ||
                  (check_window && (
                    $.belowthefold(this, window_settings) ||
                    $.rightoffold(this, window_settings)
                  )))) {
                      $this.trigger("appear");
              } else {
                  if (++counter > settings.failure_limit) {
                      return false;
                  }
              }
          });
        };

        if (options) {
            /* Maintain BC for a couple of version. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit; 
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed; 
                delete options.effectspeed;
            }

            if (options.container && options.container !== window) {
              alternate_container = true;
            }

            $.extend(settings, options);
        }

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $(settings.container).bind(settings.event, function(event) {
                return checkImages(alternate_container);
            });

            if (alternate_container) {
              $(window).bind(settings.event, function(event) {
                return checkImages(alternate_container);
              });
            }
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                var elements_left;

                if (!this.loaded) {
                    if (settings.appear) {
                        elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {
                            var elements_left, temp;

                            $self.hide()
                                .attr("src", $self.data(settings.data_attribute))
                                [settings.effect](settings.effect_speed);
                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.data(settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function(event) {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function(event) {
            checkImages(alternate_container);
        });

        /* Force initial check if images should appear. */
        checkImages(alternate_container);

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.height() + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };
    
    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };
        
    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };
    
    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
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
