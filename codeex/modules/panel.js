/**
 * Codex Panel Module
 * Handles the popup panel UI rendering
 */

(function() {
  'use strict';

  var Codex = window.Codex;

  /**
   * SVG Icons used in the panel
   */
  var Icons = {
    logo: '<svg width="20" height="20" viewBox="0 0 48 48" fill="none"><path d="M24 10L10 17L24 24L38 17L24 10Z" fill="white" opacity="0.95"/><path d="M10 24L24 31L38 24" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M10 31L24 38L38 31" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>',
    externalLink: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11"/><path d="M15 3H21V9"/><path d="M10 14L21 3"/></svg>',
    copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17L4 12"/></svg>'
  };

  /**
   * Render topic pills HTML
   */
  function renderTopics(topics) {
    if (!topics || topics.length === 0) return '';
    
    var html = '';
    for (var i = 0; i < topics.length; i++) {
      html += '<span class="codex-topic-pill">' + escapeHtml(topics[i]) + '</span>';
    }
    return html;
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Render the panel content
   */
  function render(panel, data) {
    var hasData = data && (data.name || data.topics.length > 0);
    
    if (!hasData) {
      panel.innerHTML = renderEmptyState();
      return;
    }

    var html = renderHeader();
    html += renderContent(data);
    html += renderFooter();

    panel.innerHTML = html;
    
    // Attach event listeners
    attachEventListeners(panel, data);
  }

  /**
   * Render empty state
   */
  function renderEmptyState() {
    return '<div style="padding:20px;text-align:center;color:#64748b;">' +
      '<p style="margin:0;font-size:14px;">No problem detected</p>' +
      '<p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">Navigate to a LeetCode problem page</p>' +
    '</div>';
  }

  /**
   * Render panel header
   */
  function renderHeader() {
    return '<div style="padding:14px 16px;background:linear-gradient(135deg,#2563eb,#1d4ed8);">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
      Icons.logo +
      '<span style="color:white;font-weight:700;font-size:16px;">Codex</span>' +
      '</div></div>';
  }

  /**
   * Render panel content
   */
  function renderContent(data) {
    var html = '<div style="padding:14px 16px;">';
    
    // Question card
    if (data.name) {
      var solvedBadge = data.solved 
        ? '<span class="codex-solved-badge" style="margin-left:6px;">✓ Solved</span>' 
        : '';
      
      html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:12px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">' +
        '<div style="display:flex;align-items:center;">' +
        '<span style="font-size:12px;font-weight:600;color:#2563eb;background:#eff6ff;padding:3px 8px;border-radius:4px;border:1px solid #bfdbfe;">#' + (data.number || '?') + '</span>' +
        solvedBadge +
        '</div>' +
        '<a href="' + escapeHtml(data.url || '#') + '" target="_blank" style="color:#64748b;text-decoration:none;">' + Icons.externalLink + '</a>' +
        '</div>' +
        '<h3 style="margin:0;font-size:15px;font-weight:600;color:#1e293b;">' + escapeHtml(data.name) + '</h3>' +
        '</div>';
    }
    
    // Topics section
    if (data.topics && data.topics.length > 0) {
      html += '<div>' +
        '<h4 style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px;">' +
        'Topics <span style="background:#2563eb;color:white;padding:2px 6px;border-radius:8px;font-size:10px;margin-left:4px;">' + data.topics.length + '</span>' +
        '</h4>' +
        '<div style="display:flex;flex-wrap:wrap;gap:4px;">' + renderTopics(data.topics) + '</div>' +
        '</div>';
    }
    
    html += '</div>';
    return html;
  }

  /**
   * Render panel footer
   */
  function renderFooter() {
    return '<div style="padding:10px 16px;border-top:1px solid #e2e8f0;background:#f8fafc;">' +
      '<button id="codex-copy-btn">' +
      Icons.copy + 'Copy JSON' +
      '</button>' +
      '</div>';
  }

  /**
   * Attach event listeners to panel elements
   */
  function attachEventListeners(panel, data) {
    var copyBtn = document.getElementById('codex-copy-btn');
    if (copyBtn) {
      copyBtn.onclick = function() {
        copyToClipboard(data, copyBtn);
      };
    }
  }

  /**
   * Copy data to clipboard
   */
  function copyToClipboard(data, button) {
    var jsonStr = JSON.stringify(data, null, 2);
    
    navigator.clipboard.writeText(jsonStr).then(function() {
      // Success feedback
      button.innerHTML = Icons.check + ' Copied!';
      button.classList.add('copied');
      
      setTimeout(function() {
        button.innerHTML = Icons.copy + ' Copy JSON';
        button.classList.remove('copied');
      }, 1500);
    }).catch(function(err) {
      Codex.utils.log('Copy failed:', err);
    });
  }

  /**
   * Create panel element
   */
  function create() {
    var panel = document.createElement('div');
    panel.id = 'codex-panel';
    panel.style.cssText = 'position:fixed;width:300px;background:white;border-radius:12px;' +
      'box-shadow:0 10px 40px rgba(0,0,0,0.2);z-index:2147483646;display:none;overflow:hidden;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;will-change:transform;';
    panel.style.right = '30px';
    panel.style.bottom = '170px';
    
    return panel;
  }

  /**
   * Show panel
   */
  function show(panel) {
    panel.style.display = 'block';
  }

  /**
   * Hide panel
   */
  function hide(panel) {
    panel.style.display = 'none';
  }

  /**
   * Toggle panel visibility
   */
  function toggle(panel) {
    if (panel.style.display === 'none' || panel.style.display === '') {
      show(panel);
    } else {
      hide(panel);
    }
  }

  /**
   * Update panel position relative to icon
   */
  function updatePosition(panel, x, y) {
    panel.style.left = x + 'px';
    panel.style.top = (y - panel.offsetHeight - 10) + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
  }

  // Register module
  Codex.ui.panel = {
    create: create,
    render: render,
    show: show,
    hide: hide,
    toggle: toggle,
    updatePosition: updatePosition,
    Icons: Icons
  };

  Codex.utils.log('Panel module loaded');
})();
