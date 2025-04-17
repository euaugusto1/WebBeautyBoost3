document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animations
  AOS.init({
    once: true,
    duration: 800,
    easing: 'ease-out'
  });
  
  // Update current year in footer if element exists
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
  
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
      body.classList.remove('theme-1', 'theme-2', 'theme-3', 'theme-4', 'theme-5', 
                          'theme-6', 'theme-7', 'theme-8', 'theme-9', 'theme-10');
      
      // Add selected theme class
      body.classList.add(themeClass);
      
      // Update active state on previews
      themePreviews.forEach(p => p.classList.remove('active'));
      preview.classList.add('active');
      
      // Salvar a preferência do tema (implementação futura do salvamento no banco de dados)
      // Por enquanto colocamos um console.log apenas para mostrar que está funcionando
      console.log(`Tema selecionado: ${themeClass}`);
      
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
  
  // Only add mouse effects on devices that likely have a mouse (non-touch devices)
  if (window.matchMedia("(hover: hover)").matches) {
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
  }
  
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
  
  // Rastreador de cliques para links
  function setupTrackableLinks() {
    const trackableLinks = document.querySelectorAll('.track-click');
    console.log('Configurando links rastreáveis:', trackableLinks.length);
    
    trackableLinks.forEach(link => {
      // Remover listener antigo se existir
      link.removeEventListener('click', handleLinkClick);
      // Adicionar novo listener
      link.addEventListener('click', handleLinkClick);
    });
  }
  
  // Função de manipulação de clique separada para melhor organização
  function handleLinkClick(e) {
    e.preventDefault();
    e.stopPropagation(); // Impedir propagação do evento
    
    const link = this;
    const linkId = link.getAttribute('data-link-id');
    const linkUrl = link.getAttribute('href') || link.getAttribute('data-url');
    const clickStatsElement = link.querySelector('.click-stats');
    
    console.log('Link clicado:', linkId, linkUrl);
    
    // Adicionar um efeito visual de clique
    link.classList.add('clicked');
    setTimeout(() => link.classList.remove('clicked'), 300);
    
    // Enviar solicitação para registrar o clique
    fetch(`/click-link/${linkId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Atualizar contador na interface
        if (clickStatsElement) {
          clickStatsElement.textContent = `${data.click_count} cliques`;
        }
        
        // Abrir URL em nova aba após um pequeno atraso
        setTimeout(() => {
          window.open(linkUrl, '_blank');
        }, 300);
      } else {
        console.error('Erro ao registrar clique:', data.message);
        window.open(linkUrl, '_blank');
      }
    })
    .catch(error => {
      console.error('Erro ao registrar clique:', error);
      window.open(linkUrl, '_blank');
    });
  }
  
  // Chamar a configuração dos links quando a página carregar
  setupTrackableLinks();
  
  // Add light beam effect on hover for the container, only for non-touch devices
  const container = document.querySelector('.container');
  if (container && window.matchMedia("(hover: hover)").matches) {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
    });
  }
  
  // Verificar novamente o botão de edição, para ter certeza
  const editButton = document.getElementById('edit-toggle');
  if (editButton) {
    console.log('Configurando botão de edição do main.js');
    editButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Botão de edição clicado do main.js');
      if (typeof window.handleEditButtonClick === 'function') {
        window.handleEditButtonClick(e);
      } else {
        console.error('Função handleEditButtonClick não está definida');
      }
      return false;
    });
  }
});
