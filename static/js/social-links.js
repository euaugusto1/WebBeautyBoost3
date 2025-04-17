document.addEventListener('DOMContentLoaded', function() {
  // Configurar ícones sociais com o atributo data-platform
  const socialIcons = document.querySelectorAll('.social-icon');
  
  socialIcons.forEach(icon => {
    // Extrair a plataforma da classe
    const classes = Array.from(icon.classList);
    // Pegar a classe que não é 'social-icon'
    const platform = classes.find(className => className !== 'social-icon');
    
    if (platform) {
      // Adicionar o atributo data-platform com o nome da plataforma
      icon.setAttribute('data-platform', platform);
      
      // Garantir que o link abra em uma nova aba
      icon.setAttribute('target', '_blank');
      icon.setAttribute('rel', 'noopener noreferrer');
      
      // Adicionar título ao passar o mouse
      icon.setAttribute('title', 'Meu perfil no ' + platform.charAt(0).toUpperCase() + platform.slice(1));
    }
  });
  
  // Configurar o banner da comunidade com animação e efeitos
  const communityBanner = document.querySelector('.link-btn.community');
  if (communityBanner) {
    // Adicionar efeito de destaque
    communityBanner.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.03)';
      this.style.boxShadow = '0 15px 25px rgba(0, 0, 0, 0.3)';
      
      // Animar o ícone
      const icon = this.querySelector('i');
      if (icon) {
        icon.style.transform = 'rotate(10deg) scale(1.3)';
      }
      
      // Adicionar uma borda pulsante 
      this.style.border = '2px solid rgba(255, 255, 255, 0.5)';
      
      // Clarear o fundo
      const bgEffect = this.querySelector('.btn-bg-effect');
      if (bgEffect) {
        bgEffect.style.filter = 'brightness(1.3) contrast(1.15)';
      }
    });
    
    communityBanner.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
      
      // Resetar animação do ícone
      const icon = this.querySelector('i');
      if (icon) {
        icon.style.transform = '';
      }
      
      // Remover a borda pulsante
      this.style.border = '';
      
      // Restaurar o fundo
      const bgEffect = this.querySelector('.btn-bg-effect');
      if (bgEffect) {
        bgEffect.style.filter = '';
      }
    });
    
    // Adicionar contador de cliques para banner de comunidade
    communityBanner.addEventListener('click', function(e) {
      // Impedir o comportamento padrão para poder executar o contador
      e.preventDefault();
      
      // Pegar o contador de cliques
      const clickCounter = this.querySelector('.click-stats');
      if (clickCounter) {
        // Atualizar visualmente o contador
        const currentCount = parseInt(clickCounter.textContent.match(/\d+/)[0] || 0);
        clickCounter.textContent = `${currentCount + 1} cliques`;
        
        // Adicionar efeito visual ao contador
        clickCounter.style.transform = 'scale(1.2)';
        setTimeout(() => {
          clickCounter.style.transform = '';
        }, 300);
      }
      
      // Registrar o clique no servidor (implementação futura)
      const linkId = this.getAttribute('data-id');
      if (linkId) {
        fetch(`/click-link/${linkId}`, { method: 'POST' })
          .then(response => response.json())
          .then(data => {
            console.log('Clique registrado com sucesso', data);
          })
          .catch(error => {
            console.error('Erro ao registrar clique', error);
          });
      }
      
      // Redirecionar após um breve atraso para o efeito ser visível
      const href = this.getAttribute('href');
      if (href) {
        setTimeout(() => {
          window.open(href, '_blank');
        }, 150);
      }
    });
  }
});