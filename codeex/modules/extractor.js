/**
 * Codex Extractor Module
 * Handles extraction of problem data from LeetCode pages
 */

(function() {
  'use strict';

  var Codex = window.Codex;

  /**
   * Extract problem data from the current page
   * @returns {Object} Problem data object
   */
  function extractProblemData() {
    var data = {
      number: null,
      name: null,
      url: null,
      topics: [],
      solved: false,
      difficulty: null,
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

    Codex.utils.log('Extracted data:', data);
    return data;
  }

  /**
   * Check if current page is a problem page
   * @returns {boolean}
   */
  function isProblemPage() {
    return window.location.pathname.includes('/problems/') && 
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

  // Register module
  Codex.modules.extractor = {
    extract: extractProblemData,
    isProblemPage: isProblemPage,
    getProblemSlug: getProblemSlug
  };

  Codex.utils.log('Extractor module loaded');
})();
