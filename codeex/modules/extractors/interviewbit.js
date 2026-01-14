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
      companyTags: [],
      timestamp: new Date().toISOString()
    };

    // Extract problem name from InterviewBit using specific selectors
    var titleElement = document.querySelector('h1.p-tile__title') ||
                       document.querySelector('.problem-title') ||
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

    // Extract difficulty from InterviewBit using specific selector
    var difficultyElement = document.querySelector('.p-difficulty-level') ||
                            document.querySelector('.problem-difficulty') ||
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

    // Extract company tags from InterviewBit (Asked In companies)
    var companyLinks = document.querySelectorAll('.p-tile__company-list a.p-similar-question__tag-name');
    if (companyLinks && companyLinks.length > 0) {
      var companies = [];
      companyLinks.forEach(function(a) {
        try {
          var url = new URL(a.href);
          var q = url.searchParams.get('q');
          if (q && companies.indexOf(q) === -1) {
            companies.push(q);
          }
        } catch (e) {
          // Fallback: try to get text content
          var companyName = a.innerText.trim();
          if (companyName && companies.indexOf(companyName) === -1) {
            companies.push(companyName);
          }
        }
      });
      data.companyTags = companies;
    }

    // Alternative company tag extraction
    if (data.companyTags.length === 0) {
      var altCompanyElements = document.querySelectorAll('.company-tag, .asked-in-company, [class*="company"] a');
      if (altCompanyElements && altCompanyElements.length > 0) {
        var companies = [];
        for (var c = 0; c < altCompanyElements.length; c++) {
          var companyText = altCompanyElements[c].innerText.trim();
          if (companyText && companyText.length < 50 && companies.indexOf(companyText) === -1) {
            companies.push(companyText);
          }
        }
        data.companyTags = companies;
      }
    }

    // Extract topics from InterviewBit breadcrumb (primary method based on actual page structure)
    var breadcrumbLinks = document.querySelectorAll('.ib-breadcrumb__item--link, a.ib-breadcrumb__item');
    if (breadcrumbLinks && breadcrumbLinks.length > 0) {
      var topics = [];
      for (var b = 0; b < breadcrumbLinks.length; b++) {
        var text = breadcrumbLinks[b].innerText.trim();
        // Filter out generic items like "Programming", "Home" - keep specific topics like "Linked Lists"
        if (text.length > 0 && text.length < 50 && 
            !text.toLowerCase().includes('home') &&
            !text.toLowerCase().includes('programming') &&
            topics.indexOf(text) === -1) {
          topics.push(text);
        }
      }
      data.topics = topics;
    }

    // Fallback: Extract topics/tags from other selectors
    if (data.topics.length === 0) {
      var topicElements = document.querySelectorAll('.topic-tag, .problem-tags a, .tag-container .tag, [class*="topic"] a');
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

    // Fallback: Extract from generic breadcrumb navigation
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
    var solvedIndicator = document.querySelector('.solved-status') ||
                          document.querySelector('.completed-badge') ||
                          document.querySelector('[class*="solved"]') ||
                          document.querySelector('.problem-solved') ||
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

    // InterviewBit doesn't have question numbers, so we leave it null
    // The backend should handle null questNumber for InterviewBit
    data.number = null;

    Codex.utils.log('InterviewBit Extracted data:', data);
    return data;
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
