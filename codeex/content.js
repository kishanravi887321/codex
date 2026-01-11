// Content script for Codex - Problem Topic Extractor
// This script runs on LeetCode pages to extract problem data and show floating icon

(function() {
  'use strict';

  console.log('[Codex] Content script starting...');

  // Extract complete problem data from the page using semantic selectors
  function extractProblemData() {
    var data = {
      number: null,
      name: null,
      url: null,
      topics: [],
      solved: false
    };

    // Extract question info using scoped selector (future-proof)
    var titleAnchor = document.querySelector(
      'div.text-title-large a[href^="/problems/"]'
    );
    
    if (titleAnchor) {
      var fullText = titleAnchor.innerText.trim();
      var href = titleAnchor.getAttribute('href');
      
      data.url = 'https://leetcode.com' + href;
      
      var match = fullText.match(/^(\d+)\.\s+(.*)$/);
      
      if (match) {
        data.number = match[1];
        data.name = match[2];
      } else {
        data.name = fullText;
      }
    }

    // Extract topics using semantic selector (future-proof)
    var topicElements = document.querySelectorAll('a[href^="/tag/"]');
    var topics = [];
    for (var i = 0; i < topicElements.length; i++) {
      var text = topicElements[i].innerText.trim();
      if (text.length > 0 && topics.indexOf(text) === -1) {
        topics.push(text);
      }
    }
    data.topics = topics;

    // Check if problem is solved (optimized - look for specific text near title)
    var solvedCheck = document.querySelector('div[class*="text-"]');
    if (solvedCheck) {
      var parent = solvedCheck.parentElement;
      if (parent && parent.textContent.indexOf('Solved') !== -1) {
        data.solved = true;
      }
    }
    // Fallback: check for green checkmark SVG near title
    if (!data.solved) {
      var titleArea = document.querySelector('div.text-title-large');
      if (titleArea && titleArea.parentElement) {
        var nearbyText = titleArea.parentElement.textContent;
        if (nearbyText && nearbyText.indexOf('Solved') !== -1) {
          data.solved = true;
        }
      }
    }

    return data;
  }

  // Render panel content
  function renderPanel(panel, data) {
    var hasData = data.name || data.topics.length > 0;
    
    if (!hasData) {
      panel.innerHTML = '<div style="padding: 20px; text-align: center; color: #64748b;"><p style="margin: 0; font-size: 14px;">No problem detected</p><p style="margin: 8px 0 0; font-size: 12px; color: #94a3b8;">Navigate to a LeetCode problem page</p></div>';
      return;
    }

    var topicsHtml = '';
    for (var i = 0; i < data.topics.length; i++) {
      topicsHtml += '<span style="display: inline-block; padding: 5px 10px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #bfdbfe; border-radius: 15px; font-size: 12px; font-weight: 500; color: #1d4ed8; margin: 3px;">' + data.topics[i] + '</span>';
    }

    var html = '<div style="padding: 14px 16px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);">' +
      '<div style="display: flex; align-items: center; gap: 8px;">' +
      '<svg width="20" height="20" viewBox="0 0 48 48" fill="none"><path d="M24 10L10 17L24 24L38 17L24 10Z" fill="white" opacity="0.95"/><path d="M10 24L24 31L38 24" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M10 31L24 38L38 31" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>' +
      '<span style="color: white; font-weight: 700; font-size: 16px;">Codex</span>' +
      '</div></div>';
    
    html += '<div style="padding: 14px 16px;">';
    
    if (data.name) {
      var solvedBadge = data.solved ? '<span style="font-size: 11px; font-weight: 600; color: #10b981; background: #d1fae5; padding: 3px 8px; border-radius: 4px; border: 1px solid #6ee7b7; margin-left: 6px;">✓ Solved</span>' : '';
      html += '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-bottom: 12px;">' +
        '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">' +
        '<div style="display: flex; align-items: center;"><span style="font-size: 12px; font-weight: 600; color: #2563eb; background: #eff6ff; padding: 3px 8px; border-radius: 4px; border: 1px solid #bfdbfe;">#' + (data.number || '?') + '</span>' + solvedBadge + '</div>' +
        '<a href="' + data.url + '" target="_blank" style="color: #64748b; text-decoration: none;">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11"/><path d="M15 3H21V9"/><path d="M10 14L21 3"/></svg></a></div>' +
        '<h3 style="margin: 0; font-size: 15px; font-weight: 600; color: #1e293b;">' + data.name + '</h3></div>';
    }
    
    if (data.topics.length > 0) {
      html += '<div><h4 style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px;">Topics <span style="background: #2563eb; color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; margin-left: 4px;">' + data.topics.length + '</span></h4>' +
        '<div style="display: flex; flex-wrap: wrap; gap: 4px;">' + topicsHtml + '</div></div>';
    }
    
    html += '</div>';
    
    html += '<div style="padding: 10px 16px; border-top: 1px solid #e2e8f0; background: #f8fafc;">' +
      '<button id="codex-copy-btn" style="width: 100%; padding: 8px 12px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5"/></svg>Copy JSON</button></div>';

    panel.innerHTML = html;

    // Add copy button functionality
    var copyBtn = document.getElementById('codex-copy-btn');
    if (copyBtn) {
      copyBtn.onclick = function() {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(function() {
          copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17L4 12"/></svg> Copied!';
          copyBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          setTimeout(function() {
            copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5"/></svg> Copy JSON';
            copyBtn.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
          }, 1500);
        });
      };
    }
  }

  // Toggle panel visibility
  function togglePanel(panel) {
    if (panel.style.display === 'none' || panel.style.display === '') {
      var data = extractProblemData();
      renderPanel(panel, data);
      panel.style.display = 'block';
    } else {
      panel.style.display = 'none';
    }
  }

  // Create floating draggable icon
  function createFloatingIcon() {
    console.log('[Codex] Creating floating icon...');
    
    // Check if already exists
    if (document.getElementById('codex-floating-icon')) {
      console.log('[Codex] Icon already exists');
      return;
    }

    // Make sure body exists
    if (!document.body) {
      console.log('[Codex] Body not ready, retrying...');
      setTimeout(createFloatingIcon, 500);
      return;
    }

    // Create container
    var floatingIcon = document.createElement('div');
    floatingIcon.id = 'codex-floating-icon';
    floatingIcon.innerHTML = '<svg width="26" height="26" viewBox="0 0 48 48" fill="none"><path d="M24 10L10 17L24 24L38 17L24 10Z" fill="white" opacity="0.95"/><path d="M10 24L24 31L38 24" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 31L24 38L38 31" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    // Apply styles inline
    floatingIcon.style.cssText = 'position:fixed !important;bottom:100px !important;right:30px !important;width:56px !important;height:56px !important;background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%) !important;border-radius:50% !important;display:flex !important;align-items:center !important;justify-content:center !important;cursor:grab !important;box-shadow:0 4px 20px rgba(37,99,235,0.5) !important;z-index:2147483647 !important;transition:transform 0.2s ease,box-shadow 0.2s ease !important;user-select:none !important;border:3px solid white !important;';

    // Create panel (hidden by default)
    var panel = document.createElement('div');
    panel.id = 'codex-panel';
    panel.style.cssText = 'position:fixed !important;bottom:170px !important;right:30px !important;width:300px !important;background:white !important;border-radius:12px !important;box-shadow:0 10px 40px rgba(0,0,0,0.2) !important;z-index:2147483646 !important;display:none !important;overflow:hidden !important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif !important;';

    // Append to body
    document.body.appendChild(floatingIcon);
    document.body.appendChild(panel);

    console.log('[Codex] ✅ Floating icon added to DOM!');
    console.log('[Codex] Icon element:', floatingIcon);

    // Dragging variables
    var isDragging = false;
    var hasMoved = false;
    var startX, startY, initialX, initialY;

    // Mouse down - start drag
    floatingIcon.addEventListener('mousedown', function(e) {
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      var rect = floatingIcon.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      floatingIcon.style.cursor = 'grabbing';
      floatingIcon.style.transition = 'none';
      e.preventDefault();
    });

    // Mouse move - drag
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasMoved = true;
      }

      var newX = Math.max(0, Math.min(window.innerWidth - 56, initialX + dx));
      var newY = Math.max(0, Math.min(window.innerHeight - 56, initialY + dy));

      floatingIcon.style.left = newX + 'px';
      floatingIcon.style.right = 'auto';
      floatingIcon.style.top = newY + 'px';
      floatingIcon.style.bottom = 'auto';

      panel.style.left = newX + 'px';
      panel.style.right = 'auto';
      panel.style.top = (newY - panel.offsetHeight - 10) + 'px';
      panel.style.bottom = 'auto';
    });

    // Mouse up - end drag
    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        floatingIcon.style.cursor = 'grab';
        floatingIcon.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      }
    });

    // Click - toggle panel
    floatingIcon.addEventListener('click', function(e) {
      if (hasMoved) {
        hasMoved = false;
        return;
      }
      togglePanel(panel);
    });

    // Hover effects
    floatingIcon.addEventListener('mouseenter', function() {
      if (!isDragging) {
        floatingIcon.style.transform = 'scale(1.1)';
        floatingIcon.style.boxShadow = '0 6px 25px rgba(37, 99, 235, 0.6)';
      }
    });

    floatingIcon.addEventListener('mouseleave', function() {
      if (!isDragging) {
        floatingIcon.style.transform = 'scale(1)';
        floatingIcon.style.boxShadow = '0 4px 20px rgba(37, 99, 235, 0.5)';
      }
    });

    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
      if (!floatingIcon.contains(e.target) && !panel.contains(e.target)) {
        panel.style.display = 'none';
      }
    });
  }

  // Listen for messages from the popup
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'extractProblemData') {
        var data = extractProblemData();
        sendResponse(data);
      }
      return true;
    });
  }

  // Initialize
  console.log('[Codex] Setting up initialization...');
  
  // Create icon once when page is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(createFloatingIcon, 800);
    });
  } else {
    setTimeout(createFloatingIcon, 800);
  }

  console.log('[Codex] Content script loaded');
})();
