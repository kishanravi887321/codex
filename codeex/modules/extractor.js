/**
 * Codex Extractor Module
 * Universal extractor that delegates to platform-specific extractors
 * Supports: LeetCode, GeeksForGeeks, InterviewBit
 */

(function() {
  'use strict';

  var Codex = window.Codex;
  
  // Initialize extractors registry if not exists
  Codex.extractors = Codex.extractors || {};

  /**
   * Detect current platform based on URL
   * @returns {string|null} Platform identifier
   */
  function detectPlatform() {
    var hostname = window.location.hostname.toLowerCase();
    
    if (hostname.includes('leetcode')) {
      return 'leetcode';
    } else if (hostname.includes('geeksforgeeks') || hostname.includes('gfg')) {
      return 'gfg';
    } else if (hostname.includes('interviewbit')) {
      return 'interviewbit';
    }
    
    return null;
  }

  /**
   * Get the appropriate extractor for current platform
   * @returns {Object|null} Platform extractor
   */
  function getExtractor() {
    var platform = detectPlatform();
    if (platform && Codex.extractors[platform]) {
      return Codex.extractors[platform];
    }
    return null;
  }

  /**
   * Extract problem data from the current page
   * Delegates to platform-specific extractor
   * @returns {Object} Problem data object
   */
  function extractProblemData() {
    var extractor = getExtractor();
    
    if (extractor && typeof extractor.extract === 'function') {
      var data = extractor.extract();
      Codex.utils.log('Extracted data from ' + extractor.name + ':', data);
      return data;
    }
    
    // Fallback empty data if no extractor found
    Codex.utils.log('No extractor found for current platform');
    return {
      number: null,
      name: null,
      url: window.location.href,
      topics: [],
      solved: false,
      difficulty: null,
      platform: 'unknown',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check if current page is a problem page
   * @returns {boolean}
   */
  function isProblemPage() {
    var extractor = getExtractor();
    if (extractor && typeof extractor.isProblemPage === 'function') {
      return extractor.isProblemPage();
    }
    return false;
  }

  /**
   * Get problem slug from URL
   * @returns {string|null}
   */
  function getProblemSlug() {
    var extractor = getExtractor();
    if (extractor && typeof extractor.getProblemSlug === 'function') {
      return extractor.getProblemSlug();
    }
    return null;
  }

  /**
   * Get current platform name
   * @returns {string}
   */
  function getCurrentPlatform() {
    return detectPlatform() || 'unknown';
  }

  /**
   * Get list of supported platforms
   * @returns {Array<string>}
   */
  function getSupportedPlatforms() {
    return Object.keys(Codex.extractors);
  }

  // Register module
  Codex.modules.extractor = {
    extract: extractProblemData,
    isProblemPage: isProblemPage,
    getProblemSlug: getProblemSlug,
    detectPlatform: detectPlatform,
    getCurrentPlatform: getCurrentPlatform,
    getSupportedPlatforms: getSupportedPlatforms,
    getExtractor: getExtractor
  };

  Codex.utils.log('Universal Extractor module loaded');
})();
