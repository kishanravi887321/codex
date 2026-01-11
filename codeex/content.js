// Content script for Codex - Problem Topic Extractor
// Optimized: Only scans when icon is clicked, smooth dragging

(function() {
  'use strict';

  // Extract data ONLY when needed (lazy loading)
  function extractProblemData() {
    var data = {
      number: null,
      name: null,
      url: null,
      topics: [],
      solved: false
    };

    // Extract question info
    var titleAnchor = document.querySelector('div.text-title-large a[href^="/problems/"]');
    
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

    // Extract topics
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

    return data;
  }

  // Render panel content
  function renderPanel(panel, data) {
    var hasData = data.name || data.topics.length > 0;
    
    if (!hasData) {
      panel.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b;"><p style="margin:0;font-size:14px;">No problem detected</p><p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">Navigate to a LeetCode problem page</p></div>';
      return;
    }

    var topicsHtml = '';
    for (var i = 0; i < data.topics.length; i++) {
      topicsHtml += '<span style="display:inline-block;padding:5px 10px;background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #bfdbfe;border-radius:15px;font-size:12px;font-weight:500;color:#1d4ed8;margin:3px;">' + data.topics[i] + '</span>';
    }

    var solvedBadge = data.solved ? '<span style="font-size:11px;font-weight:600;color:#10b981;background:#d1fae5;padding:3px 8px;border-radius:4px;border:1px solid #6ee7b7;margin-left:6px;">✓ Solved</span>' : '';

    var html = '<div style="padding:14px 16px;background:linear-gradient(135deg,#2563eb,#1d4ed8);">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
      '<svg width="20" height="20" viewBox="0 0 48 48" fill="none"><path d="M24 10L10 17L24 24L38 17L24 10Z" fill="white" opacity="0.95"/><path d="M10 24L24 31L38 24" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M10 31L24 38L38 31" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>' +
      '<span style="color:white;font-weight:700;font-size:16px;">Codex</span></div></div>';
    
    html += '<div style="padding:14px 16px;">';
    
    if (data.name) {
      html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:12px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">' +
        '<div style="display:flex;align-items:center;"><span style="font-size:12px;font-weight:600;color:#2563eb;background:#eff6ff;padding:3px 8px;border-radius:4px;border:1px solid #bfdbfe;">#' + (data.number || '?') + '</span>' + solvedBadge + '</div>' +
        '<a href="' + data.url + '" target="_blank" style="color:#64748b;text-decoration:none;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11"/><path d="M15 3H21V9"/><path d="M10 14L21 3"/></svg></a></div>' +
        '<h3 style="margin:0;font-size:15px;font-weight:600;color:#1e293b;">' + data.name + '</h3></div>';
    }
    
    if (data.topics.length > 0) {
      html += '<div><h4 style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px;">Topics <span style="background:#2563eb;color:white;padding:2px 6px;border-radius:8px;font-size:10px;margin-left:4px;">' + data.topics.length + '</span></h4>' +
        '<div style="display:flex;flex-wrap:wrap;gap:4px;">' + topicsHtml + '</div></div>';
    }
    
    html += '</div>';
    
    html += '<div style="padding:10px 16px;border-top:1px solid #e2e8f0;background:#f8fafc;">' +
      '<button id="codex-copy-btn" style="width:100%;padding:8px 12px;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:white;border:none;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5"/></svg>Copy JSON</button></div>';

    panel.innerHTML = html;

    // Copy button
    var copyBtn = document.getElementById('codex-copy-btn');
    if (copyBtn) {
      copyBtn.onclick = function() {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(function() {
          copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17L4 12"/></svg> Copied!';
          copyBtn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
          setTimeout(function() {
            copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5"/></svg> Copy JSON';
            copyBtn.style.background = 'linear-gradient(135deg,#2563eb,#1d4ed8)';
          }, 1500);
        });
      };
    }
  }

  // Create floating icon (minimal - just the icon, no scanning)
  function createFloatingIcon() {
    if (document.getElementById('codex-floating-icon')) return;
    if (!document.body) return;

    // Create icon
    var icon = document.createElement('div');
    icon.id = 'codex-floating-icon';
    icon.innerHTML = '<svg width="26" height="26" viewBox="0 0 48 48" fill="none"><path d="M24 10L10 17L24 24L38 17L24 10Z" fill="white" opacity="0.95"/><path d="M10 24L24 31L38 24" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M10 31L24 38L38 31" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>';
    
    // Position using transform for smooth dragging
    icon.style.cssText = 'position:fixed;width:56px;height:56px;background:linear-gradient(135deg,#2563eb,#1d4ed8);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:grab;box-shadow:0 4px 20px rgba(37,99,235,0.5);z-index:2147483647;border:3px solid white;will-change:transform;user-select:none;';
    icon.style.right = '30px';
    icon.style.bottom = '100px';

    // Create panel (hidden)
    var panel = document.createElement('div');
    panel.id = 'codex-panel';
    panel.style.cssText = 'position:fixed;width:300px;background:white;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.2);z-index:2147483646;display:none;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;will-change:transform;';
    panel.style.right = '30px';
    panel.style.bottom = '170px';

    document.body.appendChild(icon);
    document.body.appendChild(panel);

    // Drag state
    var isDragging = false;
    var hasMoved = false;
    var startX, startY;
    var iconX, iconY;
    var rafId = null;

    // Get initial position
    function getPosition() {
      var rect = icon.getBoundingClientRect();
      return { x: rect.left, y: rect.top };
    }

    // Update position smoothly
    function updatePosition(x, y) {
      icon.style.left = x + 'px';
      icon.style.top = y + 'px';
      icon.style.right = 'auto';
      icon.style.bottom = 'auto';
      
      // Update panel position
      panel.style.left = x + 'px';
      panel.style.top = (y - panel.offsetHeight - 10) + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    }

    // Mouse down
    icon.addEventListener('mousedown', function(e) {
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      var pos = getPosition();
      iconX = pos.x;
      iconY = pos.y;
      icon.style.cursor = 'grabbing';
      icon.style.transition = 'none';
      e.preventDefault();
    });

    // Mouse move with requestAnimationFrame for smooth dragging
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(function() {
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasMoved = true;
        }

        var newX = Math.max(0, Math.min(window.innerWidth - 56, iconX + dx));
        var newY = Math.max(0, Math.min(window.innerHeight - 56, iconY + dy));

        updatePosition(newX, newY);
      });
    });

    // Mouse up
    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        icon.style.cursor = 'grab';
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    });

    // Click - ONLY scan when clicked
    icon.addEventListener('click', function() {
      if (hasMoved) {
        hasMoved = false;
        return;
      }
      
      if (panel.style.display === 'none' || panel.style.display === '') {
        // Scan NOW (lazy loading)
        var data = extractProblemData();
        renderPanel(panel, data);
        panel.style.display = 'block';
      } else {
        panel.style.display = 'none';
      }
    });

    // Hover effects
    icon.addEventListener('mouseenter', function() {
      if (!isDragging) {
        icon.style.transform = 'scale(1.1)';
        icon.style.boxShadow = '0 6px 25px rgba(37,99,235,0.6)';
      }
    });

    icon.addEventListener('mouseleave', function() {
      if (!isDragging) {
        icon.style.transform = 'scale(1)';
        icon.style.boxShadow = '0 4px 20px rgba(37,99,235,0.5)';
      }
    });

    // Close panel on outside click
    document.addEventListener('click', function(e) {
      if (!icon.contains(e.target) && !panel.contains(e.target)) {
        panel.style.display = 'none';
      }
    });
  }

  // Listen for popup messages
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'extractProblemData') {
        sendResponse(extractProblemData());
      }
      return true;
    });
  }

  // Initialize - just create the icon, NO scanning
  setTimeout(createFloatingIcon, 500);
})();
