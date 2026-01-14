/**
 * Codex LeetCode Extractor
 * Platform-specific extractor for LeetCode
 */

(function() {
  'use strict';

  var Codex = window.Codex;

  /**
   * Extract problem data from LeetCode page
   * @returns {Object} Problem data object
   */
  function extract() {
    var data = {
      number: null,
      name: null,
      url: null,
      topics: [],
      solved: false,
      difficulty: null,
      platform: 'leetcode',
      timestamp: new Date().toISOString()
    };

    // Extract question info using semantic selector
    var titleAnchor = document.querySelector('div.text-title-large a[href^="/problems/"]');
    
    if (titleAnchor) {
      var fullText = titleAnchor.innerText.trim();
      var href = titleAnchor.getAttribute('href');
      
      data.url = 'https://leetcode.com' + href;
      
      // Parse question number and name (format: "85. Maximal Rectangle")
      var match = fullText.match(/^(\d+)\.\s+(.*)$/);
      if (match) {
        data.number = match[1];
        data.name = match[2];
      } else {
        data.name = fullText;
      }
    }

    // Extract topics using semantic selector
    var topicElements = document.querySelectorAll('a[href^="/tag/"]');
    var topics = [];
    for (var i = 0; i < topicElements.length; i++) {
      var text = topicElements[i].innerText.trim();
      if (text.length > 0 && topics.indexOf(text) === -1) {
        topics.push(text);
      }
    }
    data.topics = topics;

    // Check solved status - search for div with exact "Solved" text
    var allDivs = document.querySelectorAll('div');
    for (var j = 0; j < allDivs.length; j++) {
      if (allDivs[j].innerText.trim() === 'Solved') {
        data.solved = true;
        break;
      }
    }

    // Extract difficulty if available
    var difficultyElement = document.querySelector('[class*="difficulty"]');
    if (difficultyElement) {
      var diffText = difficultyElement.innerText.trim().toLowerCase();
      if (diffText.includes('easy')) data.difficulty = 'Easy';
      else if (diffText.includes('medium')) data.difficulty = 'Medium';
      else if (diffText.includes('hard')) data.difficulty = 'Hard';
    }

    // Alternative difficulty extraction
    if (!data.difficulty) {
      var diffSpans = document.querySelectorAll('span');
      for (var k = 0; k < diffSpans.length; k++) {
        var spanText = diffSpans[k].innerText.trim().toLowerCase();
        if (spanText === 'easy' || spanText === 'medium' || spanText === 'hard') {
          data.difficulty = spanText.charAt(0).toUpperCase() + spanText.slice(1);
          break;
        }
      }
    }

    return data;
  }

  /**
   * Check if current page is a LeetCode problem page
   * @returns {boolean}
   */
  function isProblemPage() {
    return window.location.hostname.includes('leetcode') &&
           window.location.pathname.includes('/problems/') && 
           !window.location.pathname.includes('/problemset/');
  }

  /**
   * Get problem slug from URL
   * @returns {string|null}
   */
  function getProblemSlug() {
    var match = window.location.pathname.match(/\/problems\/([^\/]+)/);
    return match ? match[1] : null;
  }

  // Register platform extractor
  Codex.extractors = Codex.extractors || {};
  Codex.extractors.leetcode = {
    name: 'LeetCode',
    extract: extract,
    isProblemPage: isProblemPage,
    getProblemSlug: getProblemSlug
  };

  Codex.utils.log('LeetCode extractor loaded');
})();
