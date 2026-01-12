/**
 * Codex Styles Module
 * Handles dynamic styling logic (CSS variables/theming)
 * Static styles are now loaded via content.css
 */

(function() {
  'use strict';

  var Codex = window.Codex;
  var STYLE_ID = 'codex-styles';

  /**
   * Inject styles into the page
   * @deprecated logic moved to manifest content_scripts css
   * Kept for compatibility if other modules call it, but now a no-op for static CSS
   */
  function inject() {
    // Styles are now injected via Manifest V3 'css' property
    Codex.utils.log('Static styles handled by manifest');
  }

  /**
   * Remove injected styles
   * @deprecated
   */
  function remove() {
    // Cannot remove manifest-injected styles easily
    Codex.utils.log('Styles managed by browser');
  }

  /**
   * Update CSS variables for theming
   */
  function setTheme(theme) {
    var root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--codex-bg', '#1e293b');
      root.style.setProperty('--codex-text', '#f8fafc');
      root.style.setProperty('--codex-primary', '#3b82f6');
    } else {
      root.style.setProperty('--codex-bg', '#ffffff');
      root.style.setProperty('--codex-text', '#1e293b');
      root.style.setProperty('--codex-primary', '#2563eb');
    }
  }

  // Register module
  Codex.modules.styles = {
    inject: inject,
    remove: remove,
    setTheme: setTheme
  };

  Codex.utils.log('Styles module loaded');
})();
