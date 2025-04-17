/**
 * Animated Background Patterns
 * Creates and applies different animated background patterns to the profile
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get current pattern from user preferences or default to none
  const currentPattern = document.body.getAttribute('data-pattern') || 'none';
  
  // If a pattern is selected, apply it
  if (currentPattern !== 'none') {
    applyPattern(currentPattern);
  }
  
  // Function to apply a pattern
  function applyPattern(patternName) {
    // Remove any existing patterns
    removeExistingPatterns();
    
    // Create the pattern container
    const patternContainer = document.createElement('div');
    patternContainer.className = `animated-bg pattern-${patternName}`;
    patternContainer.id = 'animated-pattern';
    
    // Apply specific pattern setup
    switch(patternName) {
      case 'particles':
        setupParticles(patternContainer);
        break;
      case 'geometric':
        setupGeometric(patternContainer);
        break;
      case 'bubbles':
        setupBubbles(patternContainer);
        break;
      case 'starfield':
        setupStarfield(patternContainer);
        break;
      case 'ripple':
        setupRipple(patternContainer);
        break;
      // Other patterns don't need additional setup
    }
    
    // Add the pattern to the profile container
    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer) {
      profileContainer.appendChild(patternContainer);
    } else {
      document.body.appendChild(patternContainer);
    }
    
    // Update body attribute
    document.body.setAttribute('data-pattern', patternName);
  }
  
  // Function to remove existing patterns
  function removeExistingPatterns() {
    const existingPattern = document.getElementById('animated-pattern');
    if (existingPattern) {
      existingPattern.remove();
    }
  }
  
  // Setup for Particles pattern
  function setupParticles(container) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.width = Math.random() * 30 + 10 + 'px';
      particle.style.height = particle.style.width;
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 5 + 's';
      container.appendChild(particle);
    }
  }
  
  // Setup for Geometric pattern
  function setupGeometric(container) {
    const shapes = ['square', 'circle', 'triangle'];
    const shapeCount = 15;
    
    for (let i = 0; i < shapeCount; i++) {
      const shape = document.createElement('div');
      shape.className = 'shape ' + shapes[Math.floor(Math.random() * shapes.length)];
      shape.style.left = Math.random() * 100 + '%';
      shape.style.top = Math.random() * 100 + '%';
      shape.style.animationDuration = (Math.random() * 20 + 10) + 's';
      shape.style.animationDelay = Math.random() * 5 + 's';
      container.appendChild(shape);
    }
  }
  
  // Setup for Bubbles pattern
  function setupBubbles(container) {
    const bubbleCount = 25;
    
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.style.width = Math.random() * 50 + 10 + 'px';
      bubble.style.height = bubble.style.width;
      bubble.style.left = Math.random() * 100 + '%';
      bubble.style.animationDuration = (Math.random() * 10 + 5) + 's';
      bubble.style.animationDelay = Math.random() * 5 + 's';
      container.appendChild(bubble);
    }
  }
  
  // Setup for Starfield pattern
  function setupStarfield(container) {
    const starCount = 50;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 3 + 1;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDuration = (Math.random() * 5 + 2) + 's';
      star.style.animationDelay = Math.random() * 5 + 's';
      container.appendChild(star);
    }
  }
  
  // Setup for Ripple pattern
  function setupRipple(container) {
    // Create initial ripples
    for (let i = 0; i < 3; i++) {
      createRipple(container);
    }
    
    // Continue creating ripples periodically
    setInterval(() => {
      createRipple(container);
    }, 2000);
  }
  
  function createRipple(container) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = Math.random() * 100 + '%';
    ripple.style.top = Math.random() * 100 + '%';
    ripple.style.animationDuration = (Math.random() * 4 + 3) + 's';
    
    container.appendChild(ripple);
    
    // Remove the ripple after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 6000);
  }

  // Add pattern selection in edit mode (will be expanded in edit-mode.js)
  window.applyAnimatedPattern = applyPattern;
});