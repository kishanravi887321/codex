// Content script for Codex - Problem Topic Extractor
// This script runs on LeetCode pages to extract problem data and topics

(function() {
  'use strict';

  // Extract complete problem data from the page using semantic selectors
  function extractProblemData() {
    const data = {
      number: null,
      name: null,
      url: null,
      topics: []
    };

    // Extract question info using semantic selector (future-proof)
    const questionAnchor = document.querySelector('a[href^="/problems/"]');
    
    if (questionAnchor) {
      const fullText = questionAnchor.innerText.trim();
      const href = questionAnchor.getAttribute('href');
      
      // Build full URL
      data.url = 'https://leetcode.com' + href;
      
      // Parse question number and name (format: "85. Maximal Rectangle")
      if (fullText.includes('.')) {
        const [number, ...nameParts] = fullText.split('.');
        data.number = number.trim();
        data.name = nameParts.join('.').trim();
      } else {
        data.name = fullText;
      }
    }

    // Extract topics using semantic selector (future-proof)
    const topicElements = document.querySelectorAll('a[href^="/tag/"]');
    const topics = Array.from(topicElements)
      .map(el => el.innerText.trim())
      .filter(topic => topic.length > 0);
    
    // Remove duplicates
    data.topics = [...new Set(topics)];

    return data;
  }

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractProblemData') {
      const data = extractProblemData();
      sendResponse(data);
    }
    return true; // Keep the message channel open for async response
  });

  // Optional: Log when content script is loaded (for debugging)
  console.log('[Codex] Content script loaded on:', window.location.href);
})();
