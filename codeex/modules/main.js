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
          window.Codex.modules.feedback &&
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
      handleIconClick();
    });

    // Close panel removed as we are not using panel mostly
    // But keep panel module for potential future use or fallback
  }

  /**
   * Handle icon click - Silent Sync Mode
   */
  async function handleIconClick() {
    var Codex = window.Codex;
    
    // 1. Extract Data
    var data = Codex.modules.extractor.extract();
    
    // Check if data is valid
    if (!data || !data.name) {
      Codex.utils.log('No problem data found');
      Codex.modules.feedback.showError(false); // Quick error shake
      return;
    }

    try {
      // 2. Send to Backend
      // Feedback: Maybe a small "Loading" spin? 
      // For now, prompt implies just "trigger API call" and then "play animation based on result"
      // If latency is high, user might think nothing happened.
      // Let's assume fast API, or we could add a "pending" state.
      
      const result = await Codex.modules.api.saveProblem(data);
      
      // 3. Handle Result
      if (result && result.status === 'updated') { 
        // Logic pending: How does API signal update?
        // Assuming result object has a status or we infer it.
        // For now, if "isUpdated" flag or 200 vs 201 check.
        // Let's assume the API returns { status: "updated" } or { status: "created" }
        Codex.modules.feedback.showUpdate();
      } else {
        Codex.modules.feedback.showSuccess();
      }
      
    } catch (error) {
      console.error('Save failed:', error);
      
      // Check specific error types from api.js
      if (error.message === 'TOKEN_EXPIRED' || error.message === 'NOT_AUTHENTICATED') {
        Codex.modules.feedback.showError(true); // Show Reconnect
      } else {
        Codex.modules.feedback.showError(false); // Generic error
      }
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
