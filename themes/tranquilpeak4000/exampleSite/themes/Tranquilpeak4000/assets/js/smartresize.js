(function($, sr) {
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  /**
   * Debounce function to limit the rate at which a function can fire
   * @param {Function} func - The function to debounce
   * @param {number} threshold - The delay in milliseconds
   * @param {boolean} execAsap - Whether to execute immediately
   * @returns {Function} The debounced function
   */
  var debounce = function(func, threshold, execAsap) {
    var timeout;

    /**
     * Debounced function that limits execution rate
     * @returns {void}
     */
    return function debounced(...args) {
      var obj = this;

      /**
       * Delayed execution function
       * @returns {void}
       */
      function delayed() {
        if (!execAsap) {
          func.apply(obj, args);
        }

        timeout = null;
      }

      if (timeout) {
        clearTimeout(timeout);
      }
      else if (execAsap) {
        func.apply(obj, args);
      }

      timeout = setTimeout(delayed, threshold || 100);
    };
  };

  jQuery.fn[sr] = function(fn) {
    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
  };
})(jQuery, 'smartresize');
