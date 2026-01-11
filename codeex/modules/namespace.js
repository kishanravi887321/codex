/**
 * Codex Namespace
 * Global namespace for the Codex extension
 * All modules attach to this namespace
 */

(function() {
  'use strict';

  // Create global namespace
  window.Codex = window.Codex || {
    version: '1.0.0',
    config: {
      debug: false,
      animationsEnabled: true,
      lazyLoading: true
    },
    modules: {},
    utils: {},
    ui: {}
  };

  // Utility: Safe console log (only in debug mode)
  window.Codex.utils.log = function() {
    if (window.Codex.config.debug) {
      console.log.apply(console, ['[Codex]'].concat(Array.prototype.slice.call(arguments)));
    }
  };

  // Utility: Check if element exists
  window.Codex.utils.elementExists = function(selector) {
    return document.querySelector(selector) !== null;
  };

  // Utility: Wait for element
  window.Codex.utils.waitForElement = function(selector, timeout) {
    timeout = timeout || 5000;
    return new Promise(function(resolve, reject) {
      var element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      var observer = new MutationObserver(function(mutations, obs) {
        var el = document.querySelector(selector);
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(function() {
        observer.disconnect();
        reject(new Error('Element not found: ' + selector));
      }, timeout);
    });
  };

  // Utility: Debounce function
  window.Codex.utils.debounce = function(func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  };

  window.Codex.utils.log('Namespace initialized');
})();
