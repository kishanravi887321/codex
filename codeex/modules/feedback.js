/**
 * Codex Feedback Module
 * Handles visual feedback animations for API interactions
 * Modularized separately from icon.js to keep code clean
 */

(function() {
  'use strict';

  var Codex = window.Codex;

  /**
   * SVGs for different states
   */
  var SVGs = {
    success: `
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none" class="codex-feedback-icon" style="animation: codex-success-pop 0.4s ease-out forwards;">
        <circle cx="24" cy="24" r="20" fill="rgba(34, 197, 94, 0.1)" stroke="#22c55e" stroke-width="2" />
        <path d="M14 24 L22 32 L34 16" stroke="#22c55e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="codex-check-path"/>
      </svg>
    `,
    update: `
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none" class="codex-feedback-icon" style="animation: codex-success-pop 0.4s ease-out forwards;">
        <circle cx="24" cy="24" r="20" fill="rgba(250, 204, 21, 0.1)" stroke="#facc15" stroke-width="2" />
        <path d="M14 24 L22 32 L34 16" stroke="#facc15" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="codex-check-path"/>
      </svg>
    `,
    error: `
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none" class="codex-feedback-icon" style="animation: codex-error-shake 0.5s ease-in-out;">
        <circle cx="24" cy="24" r="20" fill="rgba(239, 68, 68, 0.1)" stroke="#ef4444" stroke-width="2" />
        <path d="M16 16 L32 32" stroke="#ef4444" stroke-width="3" stroke-linecap="round" class="codex-cross-path"/>
        <path d="M32 16 L16 32" stroke="#ef4444" stroke-width="3" stroke-linecap="round" class="codex-cross-path" style="animation-delay: 0.1s;"/>
      </svg>
    `
  };

  /**
   * Play Success Animation (Green)
   */
  function showSuccess() {
    var icon = document.getElementById('codex-floating-icon');
    if (!icon) return;

    // 1. Change Icon
    icon.innerHTML = SVGs.success;
    
    // 2. Add Pulse Effect
    icon.style.animation = 'codex-pulse-green 0.6s ease-out 3'; // 3 pulses
    icon.style.borderColor = '#22c55e';

    // 3. Reset after ~1.8s
    setTimeout(function() {
      resetIcon(icon);
    }, 1800);
  }

  /**
   * Play Update Animation (Yellow)
   */
  function showUpdate() {
    var icon = document.getElementById('codex-floating-icon');
    if (!icon) return;

    // 1. Change Icon
    icon.innerHTML = SVGs.update;
    
    // 2. Add Pulse Effect
    icon.style.animation = 'codex-pulse-yellow 0.6s ease-out 3';
    icon.style.borderColor = '#facc15';

    // 3. Reset after ~1.8s
    setTimeout(function() {
      resetIcon(icon);
    }, 1800);
  }

  /**
   * Play Error Animation (Red)
   * @param {boolean} showReconnect - Whether to show the reconnect label
   */
  function showError(showReconnect) {
    var icon = document.getElementById('codex-floating-icon');
    if (!icon) return;

    // 1. Change Icon
    icon.innerHTML = SVGs.error;
    
    // 2. Add specific error glow
    icon.style.animation = 'codex-glow-red 1s ease-in-out infinite';
    icon.style.borderColor = '#ef4444';

    // 3. Show Reconnect Label if needed
    if (showReconnect) {
      createReconnectLabel(icon);
    } else {
      // Just a temporary error (e.g. network), reset after 2s
      setTimeout(function() {
        resetIcon(icon);
      }, 2000);
    }
  }

  /**
   * Helper: Create and append Reconnect Label
   */
  function createReconnectLabel(icon) {
    // Check if already exists
    if (document.querySelector('.codex-reconnect-label')) return;

    var label = document.createElement('div');
    label.className = 'codex-reconnect-label';
    label.innerText = 'Reconnect Extension';
    
    label.onclick = function(e) {
      e.stopPropagation();
      window.open('https://cp.saksin.online/token', '_blank');
      // Remove label after click
      label.remove();
      resetIcon(icon);
    };

    // Append to body (fixed pos) or container?
    // Since icon is fixed, better to stick it to document body and position relative to icon
    // But simpliest: append to icon container BUT icon has overflow:hidden usually? 
    // Wait, icon is a DIV with border-radius 50%. Text might be clipped.
    // Let's create it as a sibling in DOM if possible, or assume global positioning.
    
    // Better strategy: Append to body, calculate pos.
    var rect = icon.getBoundingClientRect();
    label.style.left = (rect.left + rect.width / 2) + 'px';
    label.style.top = (rect.bottom + 10) + 'px';
    label.style.position = 'fixed'; // Override class style just in case
    
    document.body.appendChild(label);

    // Auto remove after 5s if not clicked?
    setTimeout(function() {
      if (label.parentElement) {
        label.style.animation = 'codex-label-fade-in 0.3s ease-in reverse forwards';
        setTimeout(() => label.remove(), 300);
        resetIcon(icon); // Only reset icon state if user ignores it?
      }
    }, 5000);
  }

  /**
   * Helper: Reset Icon to normal state
   */
  function resetIcon(icon) {
    // Use the Icon module to regenerate default SVG
    if (Codex.ui.icon && Codex.ui.icon.generateEyeSVG) {
      icon.innerHTML = Codex.ui.icon.generateEyeSVG();
    }
    
    // Reset styles
    icon.style.animation = 'none'; // Will revert to CSS rule (border-glow)
    icon.style.borderColor = ''; // Revert to CSS default
    
    // Force re-apply of default animation class logic if needed
    // Actually the CSS uses #codex-floating-icon { animation: ... } so removing inline style works.
    
    // Remove any labels
    var label = document.querySelector('.codex-reconnect-label');
    if (label) label.remove();
  }

  // Register module
  Codex.modules.feedback = {
    showSuccess: showSuccess,
    showUpdate: showUpdate,
    showError: showError
  };

})();
