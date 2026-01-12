/**
 * Codex Icon Module
 * Handles the floating eye icon and its animations
 */

(function() {
  'use strict';

  var Codex = window.Codex;
  var currentIcon = null;

  /**
   * Generate the animated eye SVG
   */
  function generateEyeSVG() {
    return `
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
  }

  /**
   * Create the floating icon element
   */
  function create() {
    var icon = document.createElement('div');
    icon.id = 'codex-floating-icon';
    icon.innerHTML = generateEyeSVG();
    
    // Base styles
    icon.style.cssText = 'position:fixed;width:60px;height:60px;' +
      'background:radial-gradient(circle at 30% 30%, #1e293b, #0f172a, #030712);' +
      'border-radius:50%;display:flex;align-items:center;justify-content:center;' +
      'cursor:grab;z-index:2147483647;border:2px solid rgba(59,130,246,0.5);' +
      'will-change:transform;user-select:none;transition:transform 0.3s ease;';
    icon.style.right = '30px';
    icon.style.bottom = '100px';
    
    currentIcon = icon;
    return icon;
  }

  /**
   * Initialize dragging functionality
   */
  function initDragging(icon, panel, onClickCallback) {
    var isDragging = false;
    var hasMoved = false;
    var startX, startY;
    var iconX, iconY;
    var rafId = null;

    function getPosition() {
      var rect = icon.getBoundingClientRect();
      return { x: rect.left, y: rect.top };
    }

    function updatePosition(x, y) {
      icon.style.left = x + 'px';
      icon.style.top = y + 'px';
      icon.style.right = 'auto';
      icon.style.bottom = 'auto';
      
      if (panel) {
        Codex.ui.panel.updatePosition(panel, x, y);
      }
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

    // Mouse move with requestAnimationFrame
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(function() {
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasMoved = true;
        }

        var newX = Math.max(0, Math.min(window.innerWidth - 60, iconX + dx));
        var newY = Math.max(0, Math.min(window.innerHeight - 60, iconY + dy));

        updatePosition(newX, newY);
      });
    });

    // Mouse up
    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        icon.style.cursor = 'grab';
        icon.style.transition = 'transform 0.3s ease';
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    });

    // Click handler
    icon.addEventListener('click', function() {
      if (hasMoved) {
        hasMoved = false;
        return;
      }
      
      if (onClickCallback) {
        onClickCallback();
      }
    });

    // Hover effects
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

    // Return control object
    return {
      isDragging: function() { return isDragging; },
      hasMoved: function() { return hasMoved; }
    };
  }

  /**
   * Set icon position
   */
  function setPosition(icon, x, y) {
    icon.style.left = x + 'px';
    icon.style.top = y + 'px';
    icon.style.right = 'auto';
    icon.style.bottom = 'auto';
  }

  /**
   * Get icon position
   */
  function getPosition(icon) {
    var rect = icon.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  }

  /**
   * Set icon content
   */
  function setContent(svgContent) {
    if (!currentIcon) return;
    currentIcon.innerHTML = svgContent;
  }

  /**
   * Trigger Authentication Success Animation
   * Delegates to standard success animation
   */
  function triggerAuthSuccess() {
    // Treat auth success as a "created/success" event (Green)
    showSuccess('created');
  }

  /**
   * Reset icon to default state
   */
  function resetIcon() {
    if (!currentIcon) return;
    currentIcon.innerHTML = generateEyeSVG();
    currentIcon.style.animation = 'codex-border-glow 8s ease-in-out infinite';
    currentIcon.style.borderColor = 'rgba(59,130,246,0.5)';
    
    // Remove reconnect label if exists
    var label = document.getElementById('codex-reconnect-label');
    if (label) {
      if (label.parentNode) label.parentNode.removeChild(label);
    }
  }

  /**
   * Show Success Animation (New or Updated)
   * Morph -> Check -> 3 Pulses -> Return
   */
  function showSuccess(type) {
    if (!currentIcon) return;
    
    // 1. Determine Colors: Green (Saved) vs Yellow (Updated)
    // Saved = 'created' usually, Updated = 'updated'
    var isNew = (type === 'created');
    var color = isNew ? '#22c55e' : '#facc15'; // Green-500 or Yellow-400
    
    // 2. Construct SVG
    // We need 3 pulse rings that act sequentially or together? 
    // "Outer ring performs 3 clean pulse blinks".
    // We can use a single ring iterating 3 times.
    
    var svg = `
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none" class="codex-status-svg" style="animation: codex-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
        <!-- Base Circle Background (Dark) -->
        <circle cx="24" cy="24" r="21" fill="rgba(15, 23, 42, 0.95)" />
        
        <!-- Outer Glowing Ring -->
        <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="2" style="filter: drop-shadow(0 0 6px ${color});" />
        
        <!-- Pulse Ring (3 iterations) -->
        <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="2" 
          style="transform-origin: center; animation: codex-status-pulse 0.6s ease-out 3; opacity: 0;" />
          
        <!-- Checkmark (Animated Draw) -->
        <!-- Path: M14 24 L22 32 L34 16 -->
        <path d="M14 24 L22 32 L34 16" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"
          style="stroke-dasharray: 30; stroke-dashoffset: 30; animation: codex-draw-path 0.4s ease-out 0.1s forwards;" />
      </svg>
    `;

    currentIcon.innerHTML = svg;
    currentIcon.style.animation = 'none'; // Stop default border glow
    currentIcon.style.borderColor = 'transparent'; // Let SVG handle border/pulse

    // 3. Reset after animation completes
    // 3 pulses * 0.6s = 1.8s. Let's give it 2s total.
    setTimeout(resetIcon, 2000);
  }

  /**
   * Show Error Animation
   * Morph -> Cross -> Red Glow -> Reconnect Link
   */
  function showError() {
    if (!currentIcon) return;
    
    var color = '#ef4444'; // Red-500

    var svg = `
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none" class="codex-status-svg" style="animation: codex-pop 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;">
        <!-- Base Circle -->
        <circle cx="24" cy="24" r="21" fill="rgba(15, 23, 42, 0.95)" />
        
        <!-- Red Outer Ring with single glow/pulse -->
        <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="2" 
           style="filter: drop-shadow(0 0 8px ${color}); animation: codex-status-pulse 1s ease-out 1 forwards;"/>
          
        <!-- Cross Mark X -->
        <!-- Line 1 -->
        <path d="M16 16 L32 32" stroke="${color}" stroke-width="3" stroke-linecap="round" 
          style="stroke-dasharray: 24; stroke-dashoffset: 24; animation: codex-draw-path 0.3s ease-out 0.1s forwards;"/>
        <!-- Line 2 -->
        <path d="M32 16 L16 32" stroke="${color}" stroke-width="3" stroke-linecap="round" 
          style="stroke-dasharray: 24; stroke-dashoffset: 24; animation: codex-draw-path 0.3s ease-out 0.2s forwards;" />
      </svg>
    `;

    currentIcon.innerHTML = svg;
    currentIcon.style.borderColor = 'transparent';
    currentIcon.style.animation = 'none';

    // Create/Show Reconnect Link
    // We append it to the icon container, so it floats with it
    var labelIdx = 'codex-reconnect-label';
    var existingLabel = document.getElementById(labelIdx);
    if (existingLabel) existingLabel.parentNode.removeChild(existingLabel);

    var label = document.createElement('a');
    label.id = labelIdx;
    label.href = 'https://cp.saksin.online/token'; // Auth URL
    label.target = '_blank';
    label.textContent = 'Reconnect Extension';
    currentIcon.appendChild(label); // Append to floating icon div
    
    // Show after 1 second
    setTimeout(function() {
        if (document.getElementById(labelIdx)) { // Ensure still relevant
            label.classList.add('visible');
        }
    }, 1000);

    // Keep error state for a while, or until user interaction?
    // "After 1 second: A small link appears... Clicking it opens page"
    // If we reset too fast, they can't click.
    // Let's hold it for 6 seconds, giving time to read and click.
    // Or maybe we don't auto-reset failure?
    // User didn't specify auto-return for failure, only "Morph -> Red Cross -> Link".
    // But presumably it should eventually go back if ignored.
    // Let's set 6s.
    setTimeout(resetIcon, 6000);
  }

  /**
   * Trigger Authentication Failure Animation
   */
  function triggerAuthFailure() {
    showError();
  }

  // Register module
  Codex.ui.icon = {
    create: create,
    initDragging: initDragging,
    setPosition: setPosition,
    getPosition: getPosition,
    generateEyeSVG: generateEyeSVG,
    triggerAuthSuccess: triggerAuthSuccess,
    triggerAuthFailure: triggerAuthFailure,
    showSuccess: showSuccess,
    showError: showError
  };

  Codex.utils.log('Icon module loaded');
})();
