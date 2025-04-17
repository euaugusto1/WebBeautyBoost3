document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animations
  AOS.init({
    once: true,
    duration: 800,
    easing: 'ease-out'
  });
  
  // Update current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Theme Switcher
  const themeSwitcher = document.getElementById('theme-switcher');
  const themePreviewContainer = document.getElementById('theme-preview-container');
  const themePreviews = document.querySelectorAll('.theme-preview');
  const body = document.body;
  
  // Toggle theme preview panel
  themeSwitcher.addEventListener('click', () => {
    themePreviewContainer.classList.toggle('active');
  });
  
  // Close theme panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!themePreviewContainer.contains(e.target) && e.target !== themeSwitcher) {
      themePreviewContainer.classList.remove('active');
    }
  });
  
  // Handle theme selection
  themePreviews.forEach(preview => {
    preview.addEventListener('click', () => {
      // Get theme class
      const themeClass = preview.dataset.theme;
      
      // Remove all theme classes from body
      body.classList.remove('theme-1', 'theme-2', 'theme-3', 'theme-4', 'theme-5');
      
      // Add selected theme class
      body.classList.add(themeClass);
      
      // Update active state on previews
      themePreviews.forEach(p => p.classList.remove('active'));
      preview.classList.add('active');
      
      // Close the theme panel
      setTimeout(() => {
        themePreviewContainer.classList.remove('active');
      }, 300);
    });
  });
  
  // Add hover animation to links
  const links = document.querySelectorAll('.link-btn');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
  });
  
  // Add subtle animation to profile image
  const profileImg = document.querySelector('.profile-img');
  const logo = document.querySelector('.logo');
  
  logo.addEventListener('mousemove', (e) => {
    const rect = logo.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const tiltX = (x - 0.5) * 10;
    const tiltY = (y - 0.5) * 10;
    
    logo.style.transform = `perspective(1000px) rotateX(${-tiltY}deg) rotateY(${tiltX}deg)`;
  });
  
  logo.addEventListener('mouseleave', () => {
    logo.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
  
  // Add smooth scroll behavior
  const smoothScroll = (target) => {
    const element = document.querySelector(target);
    window.scrollTo({
      top: element.offsetTop,
      behavior: 'smooth'
    });
  };
  
  // Create page loading animation
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 300);
  });
  
  // Add light beam effect on hover for the container
  const container = document.querySelector('.container');
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    container.style.setProperty('--mouse-x', `${x}px`);
    container.style.setProperty('--mouse-y', `${y}px`);
  });
});
