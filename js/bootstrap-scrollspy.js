/* =============================================================
 * bootstrap-scrollspy.js v2.0.2
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* SCROLLSPY CLASS DEFINITION
   * ========================== */

  function ScrollSpy( element, options) {
    var process = $.proxy(this.process, this);
    var $element = $(element).is('body') ? $(window) : $(element);
    var href;

    this.options = $.extend({}, $.fn.scrollspy.defaults, options);
    this.$scrollElement = $element.on('scroll.scroll.data-api', process);
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a';
    this.$body = $('body').on('click.scroll.data-api', this.selector, process);
    this.refresh();
    this.process();
  };

  ScrollSpy.prototype = {

      constructor: ScrollSpy,

      refresh: function () {
        var self = this;
        var $targets;

        this.offsets = $([]);
        this.targets = $([]);

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var href = $(this).attr('href');
            var $href = /^#\w/.test(href) && $(href);
            return ( $href
              && href.length
              && [[ $href.position().top, href ]] ) || null;
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0]);
            self.targets.push(this[1]);
          });
      },

      process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
        var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight;
        var maxScroll = scrollHeight - this.$scrollElement.height();
        var offsets = this.offsets;
        var targets = this.targets;
        var activeTarget = this.activeTarget;
        var i;

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i );
        };

        for (i = offsets.length; i--;) {
          if ( activeTarget != targets[i] &&
               scrollTop >= offsets[i] &&
               (!offsets[i + 1] || scrollTop <= offsets[i + 1]) ) {
            this.activate( targets[i] );
          };
        };
      },

      activate: function (target) {
        var active;

        this.activeTarget = target;

        $(this.selector)
          .parent('.active')
          .removeClass('active');

        active = $(this.selector + '[href="' + target + '"]')
          .parent('li')
          .addClass('active');

        if (active.parent('.dropdown-menu'))  {
          active = active.closest('li.dropdown').addClass('active');
        };

        active.trigger('activate');
      },

  };


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function ( option ) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('scrollspy');
      var options = typeof option == 'object' && option;
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.scrollspy.Constructor = ScrollSpy;

  $.fn.scrollspy.defaults = {
    offset: 10;
  };


 /* SCROLLSPY DATA-API
  * ================== */

  $(function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this);
      $spy.scrollspy($spy.data());
    });
  });

}(window.jQuery);
