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

    // Inject keyframe animation for blinking eye
    if (!document.getElementById('codex-eye-styles')) {
      var styleSheet = document.createElement('style');
      styleSheet.id = 'codex-eye-styles';
      styleSheet.textContent = `
        @keyframes codex-blink {
          0%, 85%, 100% { transform: scaleY(1); }
          90% { transform: scaleY(0.05); }
        }
        @keyframes codex-pupil-move {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(2px, -1px); }
          40% { transform: translate(-2px, 1px); }
          60% { transform: translate(1px, 2px); }
          80% { transform: translate(-1px, -2px); }
        }
        @keyframes codex-color-cycle {
          0%, 100% { 
            --iris-color-1: #3b82f6;
            --iris-color-2: #2563eb;
            --iris-color-3: #1d4ed8;
          }
          25% { 
            --iris-color-1: #8b5cf6;
            --iris-color-2: #7c3aed;
            --iris-color-3: #6d28d9;
          }
          50% { 
            --iris-color-1: #ec4899;
            --iris-color-2: #db2777;
            --iris-color-3: #be185d;
          }
          75% { 
            --iris-color-1: #10b981;
            --iris-color-2: #059669;
            --iris-color-3: #047857;
          }
        }
        @keyframes codex-iris-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes codex-glow-pulse {
          0%, 100% { 
            filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.6));
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.9));
            transform: scale(1.02);
          }
        }
        @keyframes codex-scan-line {
          0% { transform: translateY(-10px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        @keyframes codex-ring-expand {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes codex-border-glow {
          0%, 100% { border-color: rgba(59, 130, 246, 0.6); box-shadow: 0 4px 25px rgba(59, 130, 246, 0.5), inset 0 0 20px rgba(59, 130, 246, 0.1); }
          25% { border-color: rgba(139, 92, 246, 0.6); box-shadow: 0 4px 25px rgba(139, 92, 246, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.1); }
          50% { border-color: rgba(236, 72, 153, 0.6); box-shadow: 0 4px 25px rgba(236, 72, 153, 0.5), inset 0 0 20px rgba(236, 72, 153, 0.1); }
          75% { border-color: rgba(16, 185, 129, 0.6); box-shadow: 0 4px 25px rgba(16, 185, 129, 0.5), inset 0 0 20px rgba(16, 185, 129, 0.1); }
        }
        @keyframes codex-particle-float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-3px) rotate(180deg); opacity: 1; }
        }
        @keyframes codex-hover-spin {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes codex-hover-pulse-ring {
          0% { transform: scale(1); opacity: 0.5; stroke-width: 2; }
          50% { transform: scale(1.3); opacity: 0; stroke-width: 0; }
          100% { transform: scale(1); opacity: 0.5; stroke-width: 2; }
        }
        @keyframes codex-electric-arc {
          0%, 100% { opacity: 0; d: path('M12 24 Q18 20, 24 24 Q30 28, 36 24'); }
          25% { opacity: 1; d: path('M12 24 Q18 28, 24 24 Q30 20, 36 24'); }
          50% { opacity: 0.5; d: path('M12 24 Q18 22, 24 26 Q30 22, 36 24'); }
          75% { opacity: 1; d: path('M12 24 Q18 26, 24 22 Q30 26, 36 24'); }
        }
        #codex-floating-icon {
          animation: codex-border-glow 8s ease-in-out infinite;
        }
        #codex-floating-icon .codex-eye-group {
          animation: codex-glow-pulse 3s ease-in-out infinite;
        }
        #codex-floating-icon .codex-iris-pattern {
          animation: codex-iris-rotate 20s linear infinite;
        }
        #codex-floating-icon:hover {
          animation: none !important;
          border-color: rgba(255, 255, 255, 0.9) !important;
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.8), 0 0 60px rgba(236, 72, 153, 0.4), inset 0 0 30px rgba(59, 130, 246, 0.3) !important;
        }
        #codex-floating-icon:hover .codex-eye-group {
          animation: codex-hover-spin 2s ease-in-out infinite;
        }
        #codex-floating-icon:hover .codex-scan-line {
          animation: codex-scan-line 0.8s ease-in-out infinite;
        }
        #codex-floating-icon:hover .codex-pulse-ring {
          animation: codex-hover-pulse-ring 1s ease-out infinite;
        }
        #codex-floating-icon:hover .codex-particle {
          animation: codex-particle-float 1.5s ease-in-out infinite;
        }
        #codex-floating-icon:hover .codex-electric {
          animation: codex-electric-arc 0.3s linear infinite;
        }
        #codex-floating-icon:hover .codex-iris-main {
          fill: url(#codex-iris-gradient-hover);
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // Create icon
    var icon = document.createElement('div');
    icon.id = 'codex-floating-icon';
    
    // Ultra advanced animated eye SVG with color cycling and effects
    icon.innerHTML = `
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none" class="codex-eye-group">
        <!-- Pulse rings (visible on hover) -->
        <circle class="codex-pulse-ring" cx="24" cy="24" r="20" fill="none" stroke="rgba(139, 92, 246, 0.5)" stroke-width="1" style="transform-origin: center;"/>
        <circle class="codex-pulse-ring" cx="24" cy="24" r="22" fill="none" stroke="rgba(236, 72, 153, 0.3)" stroke-width="1" style="transform-origin: center; animation-delay: 0.3s;"/>
        
        <!-- Outer eye shape with blink -->
        <g class="codex-eyelid" style="transform-origin: center; animation: codex-blink 4s ease-in-out infinite;">
          <!-- Outer glow -->
          <ellipse cx="24" cy="24" rx="18" ry="11" fill="none" stroke="rgba(147, 197, 253, 0.2)" stroke-width="6"/>
          <!-- Main eye outline -->
          <ellipse cx="24" cy="24" rx="18" ry="11" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <!-- Inner eye fill -->
          <ellipse cx="24" cy="24" rx="16" ry="9" fill="rgba(15, 23, 42, 0.8)"/>
        </g>
        
        <!-- Iris group with rotation -->
        <g class="codex-eyelid" style="transform-origin: center; animation: codex-blink 4s ease-in-out infinite;">
          <!-- Iris pattern that rotates -->
          <g class="codex-iris-pattern" style="transform-origin: 24px 24px;">
            <!-- Iris segments -->
            <circle cx="24" cy="24" r="9" fill="url(#codex-iris-gradient-animated)"/>
            <!-- Iris detail lines -->
            <g stroke="rgba(255,255,255,0.15)" stroke-width="0.5">
              <line x1="24" y1="15" x2="24" y2="19"/>
              <line x1="24" y1="29" x2="24" y2="33"/>
              <line x1="15" y1="24" x2="19" y2="24"/>
              <line x1="29" y1="24" x2="33" y2="24"/>
              <line x1="17.5" y1="17.5" x2="20" y2="20"/>
              <line x1="28" y1="28" x2="30.5" y2="30.5"/>
              <line x1="30.5" y1="17.5" x2="28" y2="20"/>
              <line x1="20" y1="28" x2="17.5" y2="30.5"/>
            </g>
            <!-- Inner ring -->
            <circle cx="24" cy="24" r="6" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
          </g>
          
          <!-- Pupil with movement -->
          <g style="transform-origin: 24px 24px; animation: codex-pupil-move 2.5s ease-in-out infinite;">
            <circle cx="24" cy="24" r="4" fill="#0a0a0a"/>
            <!-- Pupil highlights -->
            <circle cx="22" cy="22" r="1.8" fill="white" opacity="0.95"/>
            <circle cx="26.5" cy="25.5" r="1" fill="white" opacity="0.6"/>
            <circle cx="23" cy="26" r="0.5" fill="white" opacity="0.4"/>
          </g>
        </g>
        
        <!-- Floating particles (visible on hover) -->
        <g class="codex-particle" style="animation-delay: 0s;">
          <circle cx="10" cy="18" r="1" fill="#8b5cf6"/>
        </g>
        <g class="codex-particle" style="animation-delay: 0.3s;">
          <circle cx="38" cy="20" r="1.2" fill="#ec4899"/>
        </g>
        <g class="codex-particle" style="animation-delay: 0.6s;">
          <circle cx="14" cy="32" r="0.8" fill="#3b82f6"/>
        </g>
        <g class="codex-particle" style="animation-delay: 0.9s;">
          <circle cx="34" cy="30" r="1" fill="#10b981"/>
        </g>
        
        <!-- Scan line -->
        <line class="codex-scan-line" x1="6" y1="24" x2="42" y2="24" stroke="url(#codex-scan-gradient)" stroke-width="2" stroke-linecap="round" style="opacity: 0;"/>
        
        <!-- Electric arcs (hover effect) -->
        <path class="codex-electric" d="M12 24 Q18 20, 24 24 Q30 28, 36 24" fill="none" stroke="rgba(139, 92, 246, 0.8)" stroke-width="1" style="opacity: 0;"/>
        
        <!-- Gradient definitions -->
        <defs>
          <radialGradient id="codex-iris-gradient-animated" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#60a5fa">
              <animate attributeName="stop-color" values="#60a5fa;#a78bfa;#f472b6;#34d399;#60a5fa" dur="8s" repeatCount="indefinite"/>
            </stop>
            <stop offset="50%" stop-color="#3b82f6">
              <animate attributeName="stop-color" values="#3b82f6;#8b5cf6;#ec4899;#10b981;#3b82f6" dur="8s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stop-color="#1d4ed8">
              <animate attributeName="stop-color" values="#1d4ed8;#6d28d9;#be185d;#047857;#1d4ed8" dur="8s" repeatCount="indefinite"/>
            </stop>
          </radialGradient>
          <radialGradient id="codex-iris-gradient-hover" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f0abfc"/>
            <stop offset="50%" stop-color="#c084fc"/>
            <stop offset="100%" stop-color="#9333ea"/>
          </radialGradient>
          <linearGradient id="codex-scan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="transparent"/>
            <stop offset="30%" stop-color="#60a5fa"/>
            <stop offset="50%" stop-color="#ffffff"/>
            <stop offset="70%" stop-color="#60a5fa"/>
            <stop offset="100%" stop-color="transparent"/>
          </linearGradient>
        </defs>
      </svg>
    `;
    
    // Position using transform for smooth dragging
    icon.style.cssText = 'position:fixed;width:60px;height:60px;background:radial-gradient(circle at 30% 30%, #1e293b, #0f172a, #030712);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:grab;z-index:2147483647;border:2px solid rgba(59,130,246,0.5);will-change:transform;user-select:none;transition:transform 0.3s ease;';
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

    // Enhanced hover effects with scale transform
    icon.addEventListener('mouseenter', function() {
      if (!isDragging) {
        icon.style.transform = 'scale(1.1)';
      }
    });
    icon.addEventListener('mouseleave', function() {
      if (!isDragging) {
        icon.style.transform = 'scale(1)';
      }
    });

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
