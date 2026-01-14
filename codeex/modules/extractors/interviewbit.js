/**
 * Codex InterviewBit Extractor
 * Platform-specific extractor for InterviewBit
 */

(function() {
  'use strict';

  var Codex = window.Codex;

  /**
   * Extract problem data from InterviewBit page
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
      platform: 'interviewbit',
      timestamp: new Date().toISOString()
    };

    // Extract problem name from InterviewBit
    // InterviewBit problem titles are usually in h1 or specific classes
    var titleElement = document.querySelector('.problem-title') ||
                       document.querySelector('h1.heading') ||
                       document.querySelector('.problem-name-container h1') ||
                       document.querySelector('.problem-header h1') ||
                       document.querySelector('h1');

    if (titleElement) {
      data.name = titleElement.innerText.trim();
    }

    // Extract from breadcrumb or URL as fallback
    if (!data.name) {
      var breadcrumb = document.querySelector('.breadcrumb-item.active') ||
                       document.querySelector('.breadcrumb li:last-child');
      if (breadcrumb) {
        data.name = breadcrumb.innerText.trim();
      }
    }

    // Extract from URL as last resort
    if (!data.name) {
      var urlMatch = window.location.pathname.match(/\/problems\/([^\/]+)/);
      if (urlMatch) {
        data.name = urlMatch[1]
          .replace(/-/g, ' ')
          .replace(/\b\w/g, function(l) { return l.toUpperCase(); });
      }
    }

    // Extract difficulty from InterviewBit
    var difficultyElement = document.querySelector('.problem-difficulty') ||
                            document.querySelector('.difficulty-label') ||
                            document.querySelector('[class*="difficulty"]') ||
                            document.querySelector('.level');

    if (difficultyElement) {
      var diffText = difficultyElement.innerText.trim().toLowerCase();
      if (diffText.includes('easy') || diffText.includes('beginner')) {
        data.difficulty = 'Easy';
      } else if (diffText.includes('medium') || diffText.includes('intermediate')) {
        data.difficulty = 'Medium';
      } else if (diffText.includes('hard') || diffText.includes('advanced')) {
        data.difficulty = 'Hard';
      }
    }

    // InterviewBit also uses star ratings for difficulty
    if (!data.difficulty) {
      var starsContainer = document.querySelector('.problem-stars') ||
                           document.querySelector('[class*="star"]');
      if (starsContainer) {
        var filledStars = starsContainer.querySelectorAll('.filled, .fa-star:not(.fa-star-o)').length;
        if (filledStars <= 2) data.difficulty = 'Easy';
        else if (filledStars <= 4) data.difficulty = 'Medium';
        else data.difficulty = 'Hard';
      }
    }

    // Extract topics/tags from InterviewBit
    var topicElements = document.querySelectorAll('.topic-tag') ||
                        document.querySelectorAll('.problem-tags a') ||
                        document.querySelectorAll('.tag-container .tag') ||
                        document.querySelectorAll('[class*="topic"] a');

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

    // Extract from breadcrumb navigation as alternative
    if (data.topics.length === 0) {
      var categoryElements = document.querySelectorAll('.breadcrumb a, .category-link');
      if (categoryElements.length > 0) {
        var topics = [];
        for (var j = 0; j < categoryElements.length; j++) {
          var text = categoryElements[j].innerText.trim();
          // Filter out generic navigation items
          if (text.length > 0 && text.length < 50 && 
              !text.toLowerCase().includes('home') &&
              !text.toLowerCase().includes('problems') &&
              topics.indexOf(text) === -1) {
            topics.push(text);
          }
        }
        data.topics = topics;
      }
    }

    // Check if problem is solved on InterviewBit
    var solvedIndicator = document.querySelector('.problem-solved') ||
                          document.querySelector('.solved-indicator') ||
                          document.querySelector('[class*="solved"]') ||
                          document.querySelector('.status-solved');

    if (solvedIndicator) {
      data.solved = true;
    }

    // Alternative solved check - look for checkmark icons
    if (!data.solved) {
      var checkIcon = document.querySelector('.fa-check-circle.text-success') ||
                      document.querySelector('.problem-status .completed') ||
                      document.querySelector('[class*="complete"]');
      if (checkIcon) {
        data.solved = true;
      }
    }

    // Check for "Solved" text in problem header area
    if (!data.solved) {
      var headerArea = document.querySelector('.problem-header') ||
                       document.querySelector('.problem-info');
      if (headerArea && headerArea.innerText.toLowerCase().includes('solved')) {
        data.solved = true;
      }
    }

    // Generate a pseudo number from problem name hash (InterviewBit doesn't always have numbers)
    if (data.name && !data.number) {
      data.number = 'IB-' + hashCode(data.name);
    }

    Codex.utils.log('InterviewBit Extracted data:', data);
    return data;
  }

  /**
   * Simple hash function for generating pseudo IDs
   */
  function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString().substring(0, 6);
  }

  /**
   * Check if current page is an InterviewBit problem page
   * @returns {boolean}
   */
  function isProblemPage() {
    var hostname = window.location.hostname;
    var pathname = window.location.pathname;
    
    return hostname.includes('interviewbit.com') &&
           (pathname.includes('/problems/') || 
            pathname.includes('/coding-interview-questions/'));
  }

  /**
   * Get problem slug from URL
   * @returns {string|null}
   */
  function getProblemSlug() {
    var match = window.location.pathname.match(/\/problems\/([^\/]+)/);
    if (!match) {
      match = window.location.pathname.match(/\/coding-interview-questions\/([^\/]+)/);
    }
    return match ? match[1] : null;
  }

  // Register platform extractor
  Codex.extractors = Codex.extractors || {};
  Codex.extractors.interviewbit = {
    name: 'InterviewBit',
    extract: extract,
    isProblemPage: isProblemPage,
    getProblemSlug: getProblemSlug
  };

  Codex.utils.log('InterviewBit extractor loaded');
})();
