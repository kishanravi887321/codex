/**
 * Codex Styles Module
 * Handles CSS injection for animations and styling
 */

(function() {
  'use strict';

  var Codex = window.Codex;
  var STYLE_ID = 'codex-styles';

  /**
   * CSS Animations and Styles
   */
  var CSS = `
    /* ============================================
       KEYFRAME ANIMATIONS
       ============================================ */
    
    /* Eye blink animation */
    @keyframes codex-blink {
      0%, 85%, 100% { transform: scaleY(1); }
      90% { transform: scaleY(0.05); }
    }
    
    /* Pupil movement */
    @keyframes codex-pupil-move {
      0%, 100% { transform: translate(0, 0); }
      20% { transform: translate(2px, -1px); }
      40% { transform: translate(-2px, 1px); }
      60% { transform: translate(1px, 2px); }
      80% { transform: translate(-1px, -2px); }
    }
    
    /* Iris rotation */
    @keyframes codex-iris-rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Glow pulse effect */
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
    
    /* Scan line sweep */
    @keyframes codex-scan-line {
      0% { transform: translateY(-10px); opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { transform: translateY(10px); opacity: 0; }
    }
    
    /* Border color cycling */
    @keyframes codex-border-glow {
      0%, 100% { 
        border-color: rgba(59, 130, 246, 0.6); 
        box-shadow: 0 4px 25px rgba(59, 130, 246, 0.5), inset 0 0 20px rgba(59, 130, 246, 0.1); 
      }
      25% { 
        border-color: rgba(139, 92, 246, 0.6); 
        box-shadow: 0 4px 25px rgba(139, 92, 246, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.1); 
      }
      50% { 
        border-color: rgba(236, 72, 153, 0.6); 
        box-shadow: 0 4px 25px rgba(236, 72, 153, 0.5), inset 0 0 20px rgba(236, 72, 153, 0.1); 
      }
      75% { 
        border-color: rgba(16, 185, 129, 0.6); 
        box-shadow: 0 4px 25px rgba(16, 185, 129, 0.5), inset 0 0 20px rgba(16, 185, 129, 0.1); 
      }
    }
    
    /* Particle floating */
    @keyframes codex-particle-float {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
      50% { transform: translateY(-3px) rotate(180deg); opacity: 1; }
    }
    
    /* Hover spin effect */
    @keyframes codex-hover-spin {
      0% { transform: rotate(0deg) scale(1); }
      25% { transform: rotate(90deg) scale(1.1); }
      50% { transform: rotate(180deg) scale(1); }
      75% { transform: rotate(270deg) scale(1.1); }
      100% { transform: rotate(360deg) scale(1); }
    }
    
    /* Pulse ring expand */
    @keyframes codex-hover-pulse-ring {
      0% { transform: scale(1); opacity: 0.5; stroke-width: 2; }
      50% { transform: scale(1.3); opacity: 0; stroke-width: 0; }
      100% { transform: scale(1); opacity: 0.5; stroke-width: 2; }
    }
    
    /* Electric arc flicker */
    @keyframes codex-electric-arc {
      0%, 100% { opacity: 0; }
      25% { opacity: 1; }
      50% { opacity: 0.5; }
      75% { opacity: 1; }
    }

    /* ============================================
       FLOATING ICON STYLES
       ============================================ */
    
    #codex-floating-icon {
      animation: codex-border-glow 8s ease-in-out infinite;
    }
    
    #codex-floating-icon .codex-eye-group {
      animation: codex-glow-pulse 3s ease-in-out infinite;
    }
    
    #codex-floating-icon .codex-iris-pattern {
      animation: codex-iris-rotate 20s linear infinite;
    }
    
    /* Hover state */
    #codex-floating-icon:hover {
      animation: none !important;
      border-color: rgba(255, 255, 255, 0.9) !important;
      box-shadow: 0 0 40px rgba(139, 92, 246, 0.8), 
                  0 0 60px rgba(236, 72, 153, 0.4), 
                  inset 0 0 30px rgba(59, 130, 246, 0.3) !important;
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

    /* ============================================
       PANEL STYLES
       ============================================ */
    
    #codex-panel {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    
    #codex-panel .codex-header {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      padding: 14px 16px;
    }
    
    #codex-panel .codex-content {
      padding: 14px 16px;
    }
    
    #codex-panel .codex-footer {
      padding: 10px 16px;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
    }
    
    /* Topic pills */
    .codex-topic-pill {
      display: inline-block;
      padding: 5px 10px;
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border: 1px solid #bfdbfe;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 500;
      color: #1d4ed8;
      margin: 3px;
      transition: all 0.2s ease;
    }
    
    .codex-topic-pill:hover {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      transform: translateY(-1px);
    }
    
    /* Solved badge */
    .codex-solved-badge {
      font-size: 11px;
      font-weight: 600;
      color: #10b981;
      background: #d1fae5;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid #6ee7b7;
    }
    
    /* Copy button */
    #codex-copy-btn {
      width: 100%;
      padding: 8px 12px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
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
      transition: all 0.2s ease;
    }
    
    #codex-copy-btn:hover {
      background: linear-gradient(135deg, #1d4ed8, #1e40af);
      transform: translateY(-1px);
    }
    
    #codex-copy-btn.copied {
      background: linear-gradient(135deg, #10b981, #059669);
    }
  `;

  /**
   * Inject styles into the page
   */
  function inject() {
    if (document.getElementById(STYLE_ID)) {
      Codex.utils.log('Styles already injected');
      return;
    }

    var styleSheet = document.createElement('style');
    styleSheet.id = STYLE_ID;
    styleSheet.textContent = CSS;
    document.head.appendChild(styleSheet);

    Codex.utils.log('Styles injected');
  }

  /**
   * Remove injected styles
   */
  function remove() {
    var styleSheet = document.getElementById(STYLE_ID);
    if (styleSheet) {
      styleSheet.remove();
      Codex.utils.log('Styles removed');
    }
  }

  /**
   * Update CSS variables for theming
   */
  function setTheme(theme) {
    var root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--codex-bg', '#1e293b');
      root.style.setProperty('--codex-text', '#f8fafc');
      root.style.setProperty('--codex-primary', '#3b82f6');
    } else {
      root.style.setProperty('--codex-bg', '#ffffff');
      root.style.setProperty('--codex-text', '#1e293b');
      root.style.setProperty('--codex-primary', '#2563eb');
    }
  }

  // Register module
  Codex.modules.styles = {
    inject: inject,
    remove: remove,
    setTheme: setTheme,
    CSS: CSS
  };

  Codex.utils.log('Styles module loaded');
})();
