/**
 * Codex API Module
 * Handles communication with the backend
 */

(function() {
  'use strict';

  var Codex = window.Codex;
  // TODO: Verify this endpoint with your backend routes
  var API_BASE_URL = 'https://cp.saksin.online/api/v1'; 

  /**
   * Get the extension token from storage
   */
  function getToken() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['codex_token'], function(result) {
        resolve(result.codex_token);
      });
    });
  }

  /**
   * Save problem to the backend
   * @param {Object} problemData 
   */
  async function saveProblem(problemData) {
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('NOT_AUTHENTICATED');
      }

      // Prepare payload
      const payload = {
        problemNumber: problemData.number,
        title: problemData.name,
        slug: Codex.modules.extractor.getProblemSlug(),
        difficulty: problemData.difficulty,
        tags: problemData.topics,
        url: problemData.url,
        isSolved: problemData.solved
      };

      const response = await fetch(`${API_BASE_URL}/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid/revoked
          chrome.storage.local.remove('codex_token');
          throw new Error('TOKEN_EXPIRED');
        }
        const err = await response.text();
        throw new Error(`API_ERROR: ${err}`);
      }

      return await response.json();

    } catch (error) {
      Codex.utils.log('API Error:', error);
      throw error;
    }
  }

  // Register module
  Codex.modules.api = {
    saveProblem: saveProblem
  };

})();