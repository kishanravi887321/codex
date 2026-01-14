/**
 * Codex API Module
 * Handles communication with the backend
 */

(function() {
  'use strict';

  var Codex = window.Codex;
  var API_BASE_URL = 'https://cpbackend.saksin.online/api';
// var API_BASE_URL = 'http://localhost:3000/api';  // For local testing
    // API_BASE_URL = 'https://cp.saksin.online/api';
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
   * Upsert problem to the backend
   * @param {Object} problemData 
   * @returns {Promise<Object>} { success: boolean, status: 'created'|'updated' }
   */
  async function upsertProblem(problemData) {
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('NOT_AUTHENTICATED');
      }

      // Prepare payload based on make.txt
      const payload = {
        questName: problemData.name,
        questNumber: problemData.number,
        questLink: problemData.url,
        platform: problemData.platform || 'leetcode',
        difficulty: (problemData.difficulty || 'medium').toLowerCase(),
        topics: problemData.topics || [],
        status: problemData.solved ? 'solved' : 'unsolved',
        // Optional fields
        notes: '',
        bookmarked: false
      };

      const response = await fetch(`${API_BASE_URL}/quests/upsert`, {
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

      const data = await response.json();
      
      // Determine if created or updated based on response code or data
      // Assuming 201 for created, 200 for updated OR a specific field
      // If backend doesn't differentiate, default to 'updated' if successful
      // But user wants distinction. Check if data has 'isNew' or similar.
      // If status is 201 -> created.
      
      var status = 'updated';
      if (response.status === 201) status = 'created';
      if (data.status === 'created') status = 'created'; // Fallback check

      return {
        success: true,
        action: status,
        data: data
      };

    } catch (error) {
      Codex.utils.log('API Error:', error);
      throw error;
    }
  }

  // Register module
  Codex.modules.api = {
    upsertProblem: upsertProblem
  };

})();