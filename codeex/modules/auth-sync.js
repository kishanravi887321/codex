/**
 * Codex Auth Sync
 * Runs on cp.saksin.online to sync authentication state
 */
(function() {
  'use strict';

  // Function to sync token from LocalStorage to Chrome Extension Storage
  function syncToken() {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Save to extension storage
        chrome.storage.local.set({ 'codex_jwt': token }, function() {
          console.log('[Codex] Token synced successfully');
        });
      } else {
        // Clear if logged out
        chrome.storage.local.remove('codex_jwt');
      }
    } catch (e) {
      console.error('[Codex] Error syncing token:', e);
    }
  }

  // Sync immediately when script loads
  syncToken();

  // Listen for storage changes (e.g. login/logout events)
  window.addEventListener('storage', function(e) {
    if (e.key === 'accessToken') {
      syncToken();
    }
  });
  
  // Also hook into pushState/replaceState to detect client-side navigation logins
  // (Optional, but helpful for SPAs)
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (key === 'accessToken') {
      syncToken();
    }
  };
})();