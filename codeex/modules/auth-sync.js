/**
 * Codex Auth Sync
 * Runs on cp.saksin.online to sync authentication state
 * AND triggers visual feedback
 */
(function() {
  'use strict';

  // Wait for Codex namespace and modules
  function waitForCodex(callback) {
    var checkInterval = setInterval(function() {
      if (window.Codex && 
          window.Codex.modules.styles && 
          window.Codex.ui.icon) {
        clearInterval(checkInterval);
        callback();
      }
    }, 50);
    
    // Safety timeout
    setTimeout(function() {
      clearInterval(checkInterval);
    }, 5000);
  }

  // Initialize visual elements for auth feedback
  function initAuthFeedback() {
    try {
      if (document.getElementById('codex-floating-icon')) return;

      // Inject styles
      window.Codex.modules.styles.inject();

      // Create Icon (but hidden initially? No, request implies visible interaction)
      var icon = window.Codex.ui.icon.create();
      document.body.appendChild(icon);
      
      // Position it bottom right like normal
      // (Icon module handles default styles)
      
    } catch (e) {
      console.error('[Codex] Failed to init auth feedback UI', e);
    }
  }

  // Function to sync token from LocalStorage to Chrome Extension Storage
  function syncToken() {
    try {
      // We now look for a specific, long-lived token dedicated to the extension
      const extToken = localStorage.getItem('extensionToken');

      if (extToken) {
        // Save only this specific token
        chrome.storage.local.set({ 
          'codex_token': extToken
        }, function() {
          console.log('[Codex] Extension token synced successfully');
          
          // Trigger Animation
          waitForCodex(function() {
            initAuthFeedback();
            setTimeout(() => {
                if (window.Codex && window.Codex.ui && window.Codex.ui.icon) {
                  window.Codex.ui.icon.triggerAuthSuccess();
                }
            }, 100);
          });
        });
      } else {
        // Only clear if the specific extension token is gone
        // This allows independent lifecycle from the main website session if desired
        chrome.storage.local.remove('codex_token');
      }
    } catch (e) {
      console.error('[Codex] Error syncing token:', e);
    }
  }

  // Sync immediately when script loads
  // Use window load to ensure modules injected by manifest are ready
  window.addEventListener('load', syncToken);
  
  // Also try immediately in case load already happened
  if (document.readyState === 'complete') {
    syncToken();
  }

  // Listen for storage changes (e.g. login/logout events)
  window.addEventListener('storage', function(e) {
    if (e.key === 'extensionToken') {
      syncToken();
    }
  });
  
  // Also hook into pushState/replaceState
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (key === 'extensionToken') {
      syncToken();
    }
  };
})();