/**
 * Codex - Problem Topic Extractor
 * Main Content Script - Entry Point
 * 
 * This is the main orchestrator that initializes all modules
 * and coordinates the extension functionality.
 */

(function() {
  'use strict';

  // Wait for all modules to load
  function waitForModules(callback) {
    var checkInterval = setInterval(function() {
      if (window.Codex && 
          window.Codex.modules.extractor && 
          window.Codex.modules.styles &&
          window.Codex.ui.panel &&
          window.Codex.ui.icon) {
        clearInterval(checkInterval);
        callback();
      }
    }, 10);
    
    // Timeout after 5 seconds
    setTimeout(function() {
      clearInterval(checkInterval);
    }, 5000);
  }

  /**
   * Initialize the Codex extension
   */
  function init() {
    var Codex = window.Codex;
    
    Codex.utils.log('Initializing Codex...');
    
    // Check if already initialized
    if (document.getElementById('codex-floating-icon')) {
      Codex.utils.log('Already initialized');
      return;
    }

    // Check if body exists
    if (!document.body) {
      Codex.utils.log('Body not ready, retrying...');
      setTimeout(init, 100);
      return;
    }

    // Inject styles
    Codex.modules.styles.inject();

    // Create UI elements
    var icon = Codex.ui.icon.create();
    var panel = Codex.ui.panel.create();

    // Add to DOM
    document.body.appendChild(icon);
    document.body.appendChild(panel);

    // Initialize dragging with click callback
    Codex.ui.icon.initDragging(icon, panel, function() {
      handleIconClick(panel);
    });

    // Close panel on outside click
    document.addEventListener('click', function(e) {
      if (!icon.contains(e.target) && !panel.contains(e.target)) {
        Codex.ui.panel.hide(panel);
      }
    });

    // Listen for messages from popup
    setupMessageListener();

    Codex.utils.log('Codex initialized successfully');
  }

  /**
   * Handle icon click - extract data and show panel
   */
  function handleIconClick(panel) {
    var Codex = window.Codex;
    var isVisible = panel.style.display !== 'none' && panel.style.display !== '';
    
    if (isVisible) {
      Codex.ui.panel.hide(panel);
    } else {
      // Extract data (lazy loading)
      var data = Codex.modules.extractor.extract();
      Codex.ui.panel.render(panel, data);
      Codex.ui.panel.show(panel);
    }
  }

  /**
   * Setup message listener for popup communication
   */
  function setupMessageListener() {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'extractProblemData') {
          var data = window.Codex.modules.extractor.extract();
          sendResponse(data);
        }
        return true;
      });
    }
  }

  // Start initialization after modules are loaded
  waitForModules(function() {
    setTimeout(init, 500);
  });
})();
