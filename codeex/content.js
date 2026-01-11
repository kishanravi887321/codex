// Content script for Codex - Problem Topic Extractor
// This script runs on LeetCode pages to extract problem data and topics

(function() {
  'use strict';

  // Create floating draggable icon
  function createFloatingIcon() {
    // Check if already exists
    if (document.getElementById('codex-floating-icon')) return;

    // Create container
    const floatingIcon = document.createElement('div');
    floatingIcon.id = 'codex-floating-icon';
    floatingIcon.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 10L10 17L24 24L38 17L24 10Z" fill="white" opacity="0.95"/>
        <path d="M10 24L24 31L38 24" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 31L24 38L38 31" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // Styles for the floating icon
    floatingIcon.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
      z-index: 999999;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      user-select: none;
    `;

    // Create tooltip panel (hidden by default)
    const panel = document.createElement('div');
    panel.id = 'codex-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 160px;
      right: 30px;
      width: 300px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      z-index: 999998;
      display: none;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(floatingIcon);
    document.body.appendChild(panel);

    // Dragging functionality
    let isDragging = false;
    let startX, startY, initialX, initialY;
    let hasMoved = false;

    floatingIcon.addEventListener('mousedown', (e) => {
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      initialX = floatingIcon.offsetLeft;
      initialY = floatingIcon.offsetTop;
      floatingIcon.style.cursor = 'grabbing';
      floatingIcon.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasMoved = true;
      }

      const newX = Math.max(0, Math.min(window.innerWidth - 50, initialX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 50, initialY + dy));

      floatingIcon.style.left = newX + 'px';
      floatingIcon.style.right = 'auto';
      floatingIcon.style.top = newY + 'px';
      floatingIcon.style.bottom = 'auto';

      // Update panel position
      panel.style.left = newX + 'px';
      panel.style.right = 'auto';
      panel.style.top = (newY - panel.offsetHeight - 10) + 'px';
      panel.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        floatingIcon.style.cursor = 'grab';
        floatingIcon.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      }
    });

    // Click to toggle panel (only if not dragged)
    floatingIcon.addEventListener('click', () => {
      if (hasMoved) return;
      togglePanel(panel);
    });

    // Hover effects
    floatingIcon.addEventListener('mouseenter', () => {
      if (!isDragging) {
        floatingIcon.style.transform = 'scale(1.1)';
        floatingIcon.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.5)';
      }
    });

    floatingIcon.addEventListener('mouseleave', () => {
      if (!isDragging) {
        floatingIcon.style.transform = 'scale(1)';
        floatingIcon.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.4)';
      }
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!floatingIcon.contains(e.target) && !panel.contains(e.target)) {
        panel.style.display = 'none';
      }
    });
  }

  // Toggle panel visibility and update content
  function togglePanel(panel) {
    if (panel.style.display === 'none' || panel.style.display === '') {
      const data = extractProblemData();
      renderPanel(panel, data);
      panel.style.display = 'block';
    } else {
      panel.style.display = 'none';
    }
  }

  // Render panel content
  function renderPanel(panel, data) {
    const hasData = data.name || data.topics.length > 0;
    
    if (!hasData) {
      panel.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #64748b;">
          <p style="margin: 0; font-size: 14px;">No problem detected</p>
          <p style="margin: 8px 0 0; font-size: 12px; color: #94a3b8;">Navigate to a LeetCode problem page</p>
        </div>
      `;
      return;
    }

    const topicsHtml = data.topics.map(topic => `
      <span style="
        display: inline-block;
        padding: 5px 10px;
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        border: 1px solid #bfdbfe;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 500;
        color: #1d4ed8;
        margin: 3px;
      ">${topic}</span>
    `).join('');

    panel.innerHTML = `
      <div style="padding: 14px 16px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
            <path d="M24 10L10 17L24 24L38 17L24 10Z" fill="white" opacity="0.95"/>
            <path d="M10 24L24 31L38 24" stroke="white" stroke-width="3" stroke-linecap="round"/>
            <path d="M10 31L24 38L38 31" stroke="white" stroke-width="3" stroke-linecap="round"/>
          </svg>
          <span style="color: white; font-weight: 700; font-size: 16px;">Codex</span>
        </div>
      </div>
      
      <div style="padding: 14px 16px;">
        ${data.name ? `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 12px; font-weight: 600; color: #2563eb; background: #eff6ff; padding: 3px 8px; border-radius: 4px; border: 1px solid #bfdbfe;">
                #${data.number || '?'}
              </span>
              <a href="${data.url}" target="_blank" style="color: #64748b; text-decoration: none;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11"/>
                  <path d="M15 3H21V9"/>
                  <path d="M10 14L21 3"/>
                </svg>
              </a>
            </div>
            <h3 style="margin: 0; font-size: 15px; font-weight: 600; color: #1e293b;">${data.name}</h3>
          </div>
        ` : ''}
        
        ${data.topics.length > 0 ? `
          <div>
            <h4 style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px;">
              Topics <span style="background: #2563eb; color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; margin-left: 4px;">${data.topics.length}</span>
            </h4>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${topicsHtml}
            </div>
          </div>
        ` : ''}
      </div>
      
      <div style="padding: 10px 16px; border-top: 1px solid #e2e8f0; background: #f8fafc;">
        <button id="codex-copy-btn" style="
          width: 100%;
          padding: 8px 12px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5"/>
          </svg>
          Copy JSON
        </button>
      </div>
    `;

    // Add copy button functionality
    const copyBtn = panel.querySelector('#codex-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
          copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17L4 12"/>
            </svg>
            Copied!
          `;
          copyBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5"/>
              </svg>
              Copy JSON
            `;
            copyBtn.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
          }, 1500);
        } catch (err) {
          console.error('Copy failed:', err);
        }
      });
    }
  }

  // Initialize floating icon when page loads
  function init() {
    // Try multiple times to ensure it works with React's dynamic loading
    function tryCreate() {
      if (!document.body) {
        setTimeout(tryCreate, 100);
        return;
      }
      createFloatingIcon();
      console.log('[Codex] Floating icon created');
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(tryCreate, 500);
      });
    } else {
      setTimeout(tryCreate, 500);
    }

    // Also try again after a longer delay for React hydration
    setTimeout(tryCreate, 1500);
    setTimeout(tryCreate, 3000);
  }

  init();

  // Extract complete problem data from the page using semantic selectors
  function extractProblemData() {
    const data = {
      number: null,
      name: null,
      url: null,
      topics: []
    };

    // Extract question info using scoped selector (future-proof)
    // div.text-title-large is the semantic container for the problem header
    const titleAnchor = document.querySelector(
      'div.text-title-large a[href^="/problems/"]'
    );
    
    if (titleAnchor) {
      const fullText = titleAnchor.innerText.trim();
      const href = titleAnchor.getAttribute('href');
      
      // Build full URL
      data.url = 'https://leetcode.com' + href;
      
      // Parse question number and name using regex (format: "85. Maximal Rectangle")
      const match = fullText.match(/^(\d+)\.\s+(.*)$/);
      
      if (match) {
        data.number = match[1];
        data.name = match[2];
      } else {
        data.name = fullText;
      }
    }

    // Extract topics using semantic selector (future-proof)
    const topicElements = document.querySelectorAll('a[href^="/tag/"]');
    const topics = Array.from(topicElements)
      .map(el => el.innerText.trim())
      .filter(topic => topic.length > 0);
    
    // Remove duplicates
    data.topics = [...new Set(topics)];

    return data;
  }

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractProblemData') {
      const data = extractProblemData();
      sendResponse(data);
    }
    return true; // Keep the message channel open for async response
  });

  // Optional: Log when content script is loaded (for debugging)
  console.log('[Codex] Content script loaded on:', window.location.href);
})();
