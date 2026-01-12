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
          window.Codex.modules.api &&
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

    // Inject styles (now handled by manifest content.css mostly)
    // Codex.modules.styles.inject();

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
   * Handle icon click - extract data and UPSERT silently
   */
  async function handleIconClick(panel) {
    var Codex = window.Codex;
    
    // Animate click press
    var icon = document.getElementById('codex-floating-icon');
    if (icon) {
      icon.style.transform = 'scale(0.9)';
      setTimeout(function() { icon.style.transform = 'scale(1)'; }, 100);
    }

    try {
      // 1. Extract Data
      var data = Codex.modules.extractor.extract();
      
      if (!data || !data.name) {
        Codex.utils.log('No problem data found');
        return;
      }

      // 2. Call API (Silent Upsert)
      try {
        var result = await Codex.modules.api.upsertProblem(data);
        
        // 3. Play Success Animation
        if (result.success) {
          Codex.ui.icon.showSuccess(result.action); // 'created' or 'updated'
        } else {
          Codex.ui.icon.showError();
        }
      } catch (apiError) {
        Codex.utils.log('API Error:', apiError);
        // Play Error Animation
        Codex.ui.icon.showError();
      }

    } catch (err) {
      console.error('[Codex] Click handler error:', err);
      Codex.ui.icon.showError();
    }
    
    /* Panel Logic Disabled for Silent Mode
    var isVisible = panel.style.display !== 'none' && panel.style.display !== '';
    if (isVisible) {
      Codex.ui.panel.hide(panel);
    } else {
      var data = Codex.modules.extractor.extract();
      Codex.ui.panel.render(panel, data);
      Codex.ui.panel.show(panel);
    }
    */
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
