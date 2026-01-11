// Content script for Codex - Problem Topic Extractor
// This script runs on LeetCode pages to extract problem topics

(function() {
  'use strict';

  // Extract topics from the page using semantic selectors
  function extractTopics() {
    // Use semantic selector - finds all links that start with /tag/
    // This is future-proof as it doesn't rely on CSS class names
    const topicElements = document.querySelectorAll('a[href^="/tag/"]');
    const topics = Array.from(topicElements)
      .map(el => el.innerText.trim())
      .filter(topic => topic.length > 0);
    
    // Remove duplicates and return
    return [...new Set(topics)];
  }

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractTopics') {
      const topics = extractTopics();
      sendResponse({ topics: topics });
    }
    return true; // Keep the message channel open for async response
  });

  // Optional: Log when content script is loaded (for debugging)
  console.log('[Codex] Content script loaded on:', window.location.href);
})();
