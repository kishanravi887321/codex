/**
 * Codex GeeksForGeeks (GFG) Extractor
 * Platform-specific extractor for GeeksForGeeks
 */

(function() {
  'use strict';

  var Codex = window.Codex;

  /**
   * Helper function to get tags from GFG accordion sections
   * @param {string} keyword - The keyword to search for (e.g., "Company Tags", "Topic Tags")
   * @returns {Array} Array of tag strings
   */
  function getGfgAccordionTags(keyword) {
    try {
      var strongs = Array.from(document.querySelectorAll("strong"));
      var target = strongs.find(function(el) { 
        return el.innerText.includes(keyword); 
      });
      if (target) {
        // Find the accordion title container
        var container = target.closest('[class*="title"]'); 
        if (container && container.nextElementSibling) {
          var links = container.nextElementSibling.querySelectorAll("a");
          return Array.from(links).map(function(l) { return l.innerText.trim(); });
        }
      }
    } catch(e) {
      Codex.utils.log('Error extracting GFG accordion tags:', e);
    }
    return [];
  }

  /**
   * Extract problem data from GFG page
   * @returns {Object} Problem data object
   */
  function extract() {
    var data = {
      number: null,
      name: null,
      url: window.location.href,
      topics: [],
      solved: false,
      difficulty: null,
      platform: 'gfg',
      companyTags: [],
      timestamp: new Date().toISOString()
    };

    // Extract problem name from GFG using specific selector
    var titleElement = document.querySelector("[class*='problems_header_content__title'] h3") ||
                       document.querySelector('h3.problems_header_content__title__L2cB2') ||
                       document.querySelector('.problems_header_content__title') ||
                       document.querySelector('.problem-title') ||
                       document.querySelector('h1') ||
                       document.querySelector('.problem-name');

    if (titleElement) {
      data.name = titleElement.innerText.trim();
    }

    // Extract from URL as fallback
    if (!data.name) {
      var urlMatch = window.location.pathname.match(/\/problems\/([^\/]+)/);
      if (urlMatch) {
        // Convert slug to title case
        data.name = urlMatch[1]
          .replace(/-/g, ' ')
          .replace(/\b\w/g, function(l) { return l.toUpperCase(); });
      }
    }

    // Extract difficulty from GFG using specific selector
    var difficultyElement = document.querySelector("[class*='problems_header_description'] strong") ||
                            document.querySelector('.problems_header_content__difficulty__FJgoD') ||
                            document.querySelector('.problem-difficulty') ||
                            document.querySelector('[class*="difficulty"]') ||
                            document.querySelector('.diff-badge');

    if (difficultyElement) {
      var diffText = difficultyElement.innerText.trim().toLowerCase();
      if (diffText.includes('basic') || diffText.includes('school')) {
        data.difficulty = 'Easy';
      } else if (diffText.includes('easy')) {
        data.difficulty = 'Easy';
      } else if (diffText.includes('medium')) {
        data.difficulty = 'Medium';
      } else if (diffText.includes('hard')) {
        data.difficulty = 'Hard';
      }
    }

    // Extract Topic Tags from GFG accordion
    var topicTags = getGfgAccordionTags("Topic Tags");
    if (topicTags.length > 0) {
      data.topics = topicTags;
    }

    // Fallback: Extract topics/tags from other selectors
    if (data.topics.length === 0) {
      var topicElements = document.querySelectorAll('.problems_tag_container__kWANg a, .problem-tag, [class*="tag"], .topic-tag');
      if (topicElements && topicElements.length > 0) {
        var topics = [];
        for (var i = 0; i < topicElements.length; i++) {
          var text = topicElements[i].innerText.trim();
          if (text.length > 0 && text.length < 50 && topics.indexOf(text) === -1) {
            topics.push(text);
          }
        }
        data.topics = topics;
      }
    }

    // Alternative topic extraction - look for topic pills
    if (data.topics.length === 0) {
      var altTopicElements = document.querySelectorAll('.problemPage_tags__PIjp2 a, .tag__zcXM3');
      if (altTopicElements.length > 0) {
        var topics = [];
        for (var j = 0; j < altTopicElements.length; j++) {
          var text = altTopicElements[j].innerText.trim();
          if (text.length > 0 && text.length < 50 && topics.indexOf(text) === -1) {
            topics.push(text);
          }
        }
        data.topics = topics;
      }
    }

    // Extract Company Tags from GFG accordion
    var companyTags = getGfgAccordionTags("Company Tags");
    if (companyTags.length > 0) {
      data.companyTags = companyTags;
    }

    // Check if problem is solved on GFG
    var solvedIndicator = document.querySelector('.solved-status') ||
                          document.querySelector('.completed-badge') ||
                          document.querySelector('[class*="solved"]') ||
                          document.querySelector('.problems_solved_status__3TZQS') ||
                          document.querySelector('.solved-badge');

    if (solvedIndicator) {
      var solvedText = solvedIndicator.innerText.toLowerCase();
      if (solvedText.includes('solved') || solvedText.includes('completed')) {
        data.solved = true;
      }
    }

    // Alternative solved check - look for green checkmark or success status
    if (!data.solved) {
      var successIcon = document.querySelector('.problems_header_content__solvedStamp__34d4b') ||
                        document.querySelector('[class*="solvedStamp"]');
      if (successIcon) {
        data.solved = true;
      }
    }

    // GFG doesn't have question numbers, so we leave it null
    data.number = null;

    Codex.utils.log('GFG Extracted data:', data);
    return data;
  }

  /**
   * Check if current page is a GFG problem page
   * @returns {boolean}
   */
  function isProblemPage() {
    var hostname = window.location.hostname;
    var pathname = window.location.pathname;
    
    return (hostname.includes('geeksforgeeks.org') || hostname.includes('gfg')) &&
           (pathname.includes('/problems/') || 
            pathname.includes('/problem/') ||
            pathname.includes('/practice/'));
  }

  /**
   * Get problem slug from URL
   * @returns {string|null}
   */
  function getProblemSlug() {
    var match = window.location.pathname.match(/\/problems?\/([^\/]+)/);
    return match ? match[1] : null;
  }

  // Register platform extractor
  Codex.extractors = Codex.extractors || {};
  Codex.extractors.gfg = {
    name: 'GeeksForGeeks',
    extract: extract,
    isProblemPage: isProblemPage,
    getProblemSlug: getProblemSlug
  };

  Codex.utils.log('GFG extractor loaded');
})();
