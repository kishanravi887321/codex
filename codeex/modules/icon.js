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
   */
  function triggerAuthSuccess() {
    // If not created yet, don't crash
    if (!currentIcon) {
      currentIcon = document.getElementById('codex-floating-icon');
    }
    if (!currentIcon) return;

    var originalContent = currentIcon.innerHTML;

    // 1. Success Icon SVG
    var successSVG = `
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none" class="codex-eye-group" style="animation: codex-success-pop 0.4s ease-out forwards;">
        <!-- Glowing Pulse Rings -->
        <circle cx="24" cy="24" r="18" fill="none" stroke="#8b5cf6" stroke-width="1.5"
          style="transform-origin: center; animation: codex-success-pulse 1.2s ease-out infinite; opacity: 0.6;" />
        <circle cx="24" cy="24" r="18" fill="none" stroke="#c084fc" stroke-width="1" 
          style="transform-origin: center; animation: codex-success-pulse 1.2s ease-out 0.3s infinite; opacity: 0.4;" />
        
        <!-- Outer Circle with Neon Glow -->
        <circle cx="24" cy="24" r="21" fill="rgba(15, 23, 42, 0.9)" stroke="#8b5cf6" stroke-width="2" 
          style="animation: codex-neon-pulse 1.5s ease-in-out infinite;" />
          
        <!-- Checkmark -->
        <path d="M14 24 L22 32 L34 16" class="codex-check-path" stroke="#a78bfa" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;

    // 2. Clear current icon and show success
    currentIcon.innerHTML = successSVG;

    // 3. Play animation logic
    // Duration: ~2s total (0.6s draw + pulses)
    setTimeout(function() {
      // Transition back - Hard swap back to eye
      // Re-generate eye SVG to ensure clean state
      currentIcon.innerHTML = generateEyeSVG();
      
      // Optional: Add a subtle flash upon return
      currentIcon.style.animation = 'codex-success-pop 0.3s ease-out';
      setTimeout(function() {
        currentIcon.style.animation = 'none';
      }, 300);
      
    }, 2000);
  }

  // Register module
  Codex.ui.icon = {
    create: create,
    initDragging: initDragging,
    setPosition: setPosition,
    getPosition: getPosition,
    generateEyeSVG: generateEyeSVG,
    triggerAuthSuccess: triggerAuthSuccess
  };

  Codex.utils.log('Icon module loaded');
})();
