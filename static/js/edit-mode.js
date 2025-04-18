// Declarar variáveis no escopo global para que possam ser acessadas por todas as funções
let editToggle;
let editControls; 
let profileContainer;
let isEditMode = false;
let originalData = {};

// Inicialização inicial
console.log('Início da execução de edit-mode.js');
initEditSystem();

document.addEventListener('DOMContentLoaded', function() {
  console.log('Edit Mode: DOM completamente carregado');
  
  // Inicializar o sistema de edição com prioridade alta
  setTimeout(function() {
    console.log('Tentando inicializar o sistema de edição novamente');
    initEditSystem();
  }, 100);
});

// Definir a função de clique de edição no escopo global
window.handleEditButtonClick = function(e) {
  console.log('Função handleEditButtonClick chamada');
  // Parar qualquer propagação e comportamento padrão
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // Forçar a execução das funções diretamente
  try {
    enableEditMode();
    createActionButtons();
  } catch (error) {
    console.error('Erro ao ativar modo de edição:', error);
  }
  
  return false; // Prevenir comportamentos padrão
};

function initEditSystem() {
  // Elementos principais
  editToggle = document.getElementById('edit-toggle');
  console.log('Edit Toggle Button encontrado:', editToggle);
  
  // Os botões de salvar e cancelar são criados dinamicamente quando o modo de edição é ativado
  editControls = document.getElementById('edit-controls');
  profileContainer = document.querySelector('.container');
  
  // Verificar se o botão de edição existe
  if (editToggle) {
    // Configuração adicional do botão para garantir visibilidade
    editToggle.style.visibility = 'visible';
    editToggle.style.opacity = '1';
    editToggle.style.zIndex = '10000';
    editToggle.style.pointerEvents = 'auto';
    
    // Adicionar evento click diretamente
    editToggle.onclick = window.handleEditButtonClick;
    
    console.log('Botão de edição inicializado com sucesso.');
  } else {
    console.error('Botão de edição não encontrado!');
      
      // Criar o botão manualmente se não existir
      const newEditButton = document.createElement('button');
      newEditButton.id = 'edit-toggle';
      newEditButton.className = 'edit-toggle';
      newEditButton.innerHTML = '<i class="fas fa-edit"></i>';
      newEditButton.style.visibility = 'visible';
      newEditButton.style.opacity = '1';
      newEditButton.style.zIndex = '10000';
      newEditButton.style.position = 'fixed';
      newEditButton.style.bottom = '20px';
      newEditButton.style.right = '20px';
      newEditButton.onclick = function() {
        console.log('Botão de edição criado manualmente e clicado');
        enableEditMode();
        createActionButtons();
        return false;
      };
      
      document.body.appendChild(newEditButton);
      console.log('Novo botão de edição criado manualmente');
    }
  }
  
  // Estas variáveis já estão declaradas no escopo global
  // Não precisamos redeclará-las aqui
  
  // Guardar dados originais para restaurar em caso de cancelamento
  function saveOriginalData() {
    originalData.name = document.querySelector('.username').textContent.replace('•', '').trim();
    originalData.bio = document.querySelector('.bio').textContent;
    
    // Descrição adicional
    const descriptionElement = document.querySelector('.description');
    originalData.description = descriptionElement ? descriptionElement.textContent : '';
    
    // Links sociais
    originalData.socialLinks = [];
    document.querySelectorAll('.social-icon').forEach(icon => {
      originalData.socialLinks.push({
        platform: Array.from(icon.classList).find(c => c !== 'social-icon'),
        url: icon.getAttribute('href'),
        icon: icon.querySelector('i').className
      });
    });
    
    // Links do perfil
    originalData.profileLinks = [];
    document.querySelectorAll('.link-btn').forEach(link => {
      originalData.profileLinks.push({
        title: link.querySelector('span').textContent,
        url: link.getAttribute('href'),
        icon: link.querySelector('i').className,
        class: Array.from(link.classList).find(c => c !== 'link-btn')
      });
    });
    
    // Itens do footer
    originalData.footerItems = [];
    document.querySelectorAll('.footer-item').forEach(item => {
      const icon = item.querySelector('i');
      const link = item.querySelector('a');
      
      originalData.footerItems.push({
        text: link ? link.textContent : item.textContent.trim(),
        icon: icon ? icon.className.replace('fas ', '') : '',
        url: link ? link.getAttribute('href') : '',
        is_brand: link && link.classList.contains('brand-link')
      });
    });
    
    // Tema atual
    originalData.theme = document.body.className.replace('loaded', '').trim();
  }
  
  // Ativar modo de edição
  function enableEditMode() {
    console.log('Ativando modo de edição - versão melhorada...');
    isEditMode = true;
    
    // Verificar se o container existe
    if (!profileContainer) {
      console.error('Container de perfil não encontrado');
      profileContainer = document.querySelector('.container');
      if (!profileContainer) {
        alert('Erro: Container de perfil não encontrado');
        return;
      }
    }
    
    profileContainer.classList.add('edit-mode');
    
    // Verificar se os controles existem
    if (!editControls) {
      console.error('Controles de edição não encontrados');
      editControls = document.getElementById('edit-controls');
      if (!editControls) {
        // Criar controles se não existirem
        editControls = document.createElement('div');
        editControls.id = 'edit-controls';
        editControls.className = 'edit-controls';
        document.body.appendChild(editControls);
      }
    }
    
    editControls.classList.add('active');
    
    try {
      // Salvar dados originais
      saveOriginalData();
      
      // Tornar campos editáveis
      makeFieldsEditable();
      
      // Adicionar seletor de padrões animados
      addPatternSelector();
      
      // Adicionar seletor de tema se não estiver presente
      if (!document.querySelector('.theme-editor')) {
        // Verificar se a função de criação de temas existe
        if (typeof addThemeSelector === 'function') {
          addThemeSelector();
        } else {
          console.log('Função addThemeSelector não encontrada, pulando...');
        }
      }
      
      console.log('Modo de edição ativado com sucesso!');
    } catch (error) {
      console.error('Erro ao ativar modo de edição:', error);
    }
  }
  
  // Função para adicionar o seletor de temas
  function addThemeSelector() {
    console.log('Adicionando seletor de temas...');
    
    // Criar o seletor de temas
    const themeSelector = document.createElement('div');
    themeSelector.className = 'theme-editor';
    themeSelector.innerHTML = '<h3>Temas</h3>';
    
    // Botão de alternância para o seletor de temas
    const themeToggleBtn = document.createElement('button');
    themeToggleBtn.className = 'theme-toggle-btn';
    themeToggleBtn.innerHTML = '<i class="fas fa-palette"></i>';
    themeToggleBtn.addEventListener('click', function() {
      themeSelector.classList.toggle('active');
    });
    
    themeSelector.appendChild(themeToggleBtn);
    
    // Grid de seleção de temas
    const themeGrid = document.createElement('div');
    themeGrid.className = 'theme-select-grid';
    
    // Definir os temas disponíveis
    const themes = [
      { id: 'theme-1', name: 'Azul' },
      { id: 'theme-2', name: 'Verde' },
      { id: 'theme-3', name: 'Roxo' },
      { id: 'theme-4', name: 'Laranja' },
      { id: 'theme-5', name: 'Rosa' },
      { id: 'theme-6', name: 'Azul Escuro' },
      { id: 'theme-7', name: 'Verde Escuro' },
      { id: 'theme-8', name: 'Preto' }
    ];
    
    // Obter o tema atual
    const bodyClasses = document.body.className.split(' ');
    const currentTheme = bodyClasses.find(cls => cls.startsWith('theme-')) || 'theme-1';
    
    // Criar opções para cada tema
    themes.forEach(theme => {
      const themeOption = document.createElement('div');
      themeOption.className = `theme-option ${theme.id === currentTheme ? 'active' : ''}`;
      themeOption.setAttribute('data-theme', theme.id);
      themeOption.title = theme.name;
      
      // Adicionar texto descritivo
      const themeName = document.createElement('span');
      themeName.textContent = theme.name;
      themeOption.appendChild(themeName);
      
      // Adicionar evento de clique para selecionar tema
      themeOption.addEventListener('click', function() {
        // Remover classe ativa de todas as opções
        document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
        // Adicionar classe ativa à opção clicada
        this.classList.add('active');
        
        // Remover todas as classes de tema do body
        bodyClasses.forEach(cls => {
          if (cls.startsWith('theme-')) {
            document.body.classList.remove(cls);
          }
        });
        
        // Adicionar a nova classe de tema
        document.body.classList.add(theme.id);
      });
      
      themeGrid.appendChild(themeOption);
    });
    
    themeSelector.appendChild(themeGrid);
    document.body.appendChild(themeSelector);
    
    // Ativar o editor de temas automaticamente após um breve atraso
    setTimeout(() => {
      themeSelector.classList.add('active');
    }, 1000);
  }
  
  // Adicionar o seletor de padrões de fundo animados
  function addPatternSelector() {
    // Criar o seletor de padrões
    const patternSelector = document.createElement('div');
    patternSelector.className = 'pattern-editor';
    patternSelector.innerHTML = '<h3>Padrões Animados</h3>';
    
    // Adicionar botão de alternância para o seletor de padrões
    const patternToggleBtn = document.createElement('button');
    patternToggleBtn.className = 'pattern-toggle-btn';
    patternToggleBtn.innerHTML = '<i class="fas fa-magic"></i>';
    patternToggleBtn.addEventListener('click', function() {
      patternSelector.classList.toggle('active');
    });
    
    patternSelector.appendChild(patternToggleBtn);
    
    // Grid de seleção de padrões
    const patternGrid = document.createElement('div');
    patternGrid.className = 'pattern-select-grid';
    
    // Adicionar opções de padrões
    const patterns = [
      { id: 'none', name: 'Nenhum' },
      { id: 'particles', name: 'Partículas' },
      { id: 'wave', name: 'Ondas' },
      { id: 'pulse', name: 'Pulso' },
      { id: 'geometric', name: 'Formas' },
      { id: 'bubbles', name: 'Bolhas' },
      { id: 'grid', name: 'Grade' },
      { id: 'starfield', name: 'Estrelas' },
      { id: 'noise', name: 'Ruído' },
      { id: 'lines', name: 'Linhas' },
      { id: 'ripple', name: 'Ondulação' }
    ];
    
    // Obter o padrão atual
    const currentPattern = document.body.getAttribute('data-pattern') || 'none';
    
    // Criar opções para cada padrão
    patterns.forEach(pattern => {
      const patternOption = document.createElement('div');
      patternOption.className = `pattern-option ${pattern.id === currentPattern ? 'active' : ''}`;
      patternOption.setAttribute('data-pattern', pattern.id);
      patternOption.title = pattern.name;
      
      // Adicionar texto descritivo
      const patternName = document.createElement('span');
      patternName.textContent = pattern.name;
      patternOption.appendChild(patternName);
      
      // Evento de clique para selecionar padrão
      patternOption.addEventListener('click', function() {
        // Remover classe ativa de todas as opções
        document.querySelectorAll('.pattern-option').forEach(opt => opt.classList.remove('active'));
        // Adicionar classe ativa à opção clicada
        this.classList.add('active');
        
        // Aplicar o padrão imediatamente para visualização
        if (window.applyAnimatedPattern) {
          window.applyAnimatedPattern(pattern.id);
        }
      });
      
      patternGrid.appendChild(patternOption);
    });
    
    patternSelector.appendChild(patternGrid);
    document.body.appendChild(patternSelector);
    
    // Ativar o editor de padrões automaticamente após um breve atraso
    setTimeout(() => {
      patternSelector.classList.add('active');
    }, 800);
  }
  
  // Desativar modo de edição
  function disableEditMode() {
    console.log('Desativando modo de edição...');
    isEditMode = false;
    
    if (profileContainer) {
      profileContainer.classList.remove('edit-mode');
    }
    
    if (editControls) {
      editControls.classList.remove('active');
    }
    
    // Remover elementos de edição
    removeEditableFields();
    
    // Remover o seletor de padrões de fundo
    const patternEditor = document.querySelector('.pattern-editor');
    if (patternEditor) {
      patternEditor.remove();
    }
    
    // Remover o seletor de temas
    const themeEditor = document.querySelector('.theme-editor');
    if (themeEditor) {
      themeEditor.remove();
    }
    
    // Remover os botões de ação
    const actionButtons = document.querySelector('.edit-action-buttons');
    if (actionButtons) {
      actionButtons.remove();
    }
    
    console.log('Modo de edição desativado com sucesso!');
  }
  
  // Tornar campos editáveis
  function makeFieldsEditable() {
    // Foto de perfil
    const profileImg = document.querySelector('.profile-img');
    const imgContainer = profileImg.parentNode;
    
    // Criar um wrapper para a imagem e o botão de upload
    const imgEditWrapper = document.createElement('div');
    imgEditWrapper.className = 'img-edit-wrapper';
    
    // Manter a imagem original
    const originalImg = profileImg.cloneNode(true);
    imgEditWrapper.appendChild(originalImg);
    
    // Adicionar botão para fazer upload de nova imagem
    const uploadBtn = document.createElement('button');
    uploadBtn.className = 'upload-img-btn';
    uploadBtn.innerHTML = '<i class="fas fa-camera"></i>';
    uploadBtn.title = 'Alterar foto de perfil';
    
    // Criar um input type file oculto
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.className = 'img-file-input';
    fileInput.style.display = 'none';
    
    // Quando o botão for clicado, disparar o input de arquivo
    uploadBtn.addEventListener('click', function() {
      fileInput.click();
    });
    
    // Quando um arquivo for selecionado
    fileInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          // Atualizar a URL da imagem para o preview
          originalImg.src = e.target.result;
          // Guardar o conteúdo em base64 para enviar ao servidor
          originalImg.setAttribute('data-image-base64', e.target.result);
        };
        
        reader.readAsDataURL(this.files[0]);
      }
    });
    
    imgEditWrapper.appendChild(uploadBtn);
    imgEditWrapper.appendChild(fileInput);
    
    // Substituir a imagem original pelo wrapper
    imgContainer.replaceChild(imgEditWrapper, profileImg);
    
    // Nome do usuário
    const username = document.querySelector('.username');
    const usernameText = username.textContent.replace('•', '').trim();
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.value = usernameText;
    usernameInput.className = 'edit-input username-input';
    username.innerHTML = '';
    username.appendChild(usernameInput);
    username.appendChild(document.createElement('span')).className = 'dot';
    username.querySelector('.dot').innerHTML = '•';
    
    // Bio
    const bio = document.querySelector('.bio');
    const bioText = bio.textContent;
    const bioInput = document.createElement('textarea');
    bioInput.value = bioText;
    bioInput.className = 'edit-input bio-input';
    bio.innerHTML = '';
    bio.appendChild(bioInput);
    
    // Descrição do perfil
    let description = document.querySelector('.description');
    // Se não existir, criar elemento
    if (!description) {
      description = document.createElement('p');
      description.className = 'description';
      bio.parentNode.insertBefore(description, bio.nextSibling);
    }
    
    const descriptionText = description.textContent || '';
    const descriptionInput = document.createElement('textarea');
    descriptionInput.value = descriptionText;
    descriptionInput.className = 'edit-input description-input';
    descriptionInput.placeholder = 'Adicione uma descrição sobre você...';
    description.innerHTML = '';
    description.appendChild(descriptionInput);
    
    // Telefone - apenas se existir um elemento com classe .contact-phone
    const phoneElement = document.querySelector('.contact-phone');
    if (phoneElement) {
      const phoneText = phoneElement.textContent.replace(/.*: /, '');
      const phoneIcon = document.createElement('i');
      phoneIcon.className = 'fas fa-phone-alt';
      const phoneInput = document.createElement('input');
      phoneInput.type = 'text';
      phoneInput.value = phoneText;
      phoneInput.className = 'edit-input phone-input';
      phoneElement.innerHTML = '';
      phoneElement.appendChild(phoneIcon);
      phoneElement.appendChild(document.createTextNode(' '));
      phoneElement.appendChild(phoneInput);
    }
    
    // Links sociais
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'social-edit-wrapper';
      
      // Criar cabeçalho com ícone e plataforma
      const headerDiv = document.createElement('div');
      headerDiv.className = 'social-header';
      
      // Obter a plataforma a partir da classe da rede social
      const platform = Array.from(icon.classList).find(c => c !== 'social-icon');
      
      // Manter o ícone original
      const iconElement = icon.cloneNode(true);
      
      // Criar label para a plataforma
      const platformLabel = document.createElement('h4');
      platformLabel.textContent = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Social Link';
      platformLabel.style.margin = '0';
      platformLabel.style.color = '#fff';
      
      headerDiv.appendChild(iconElement);
      headerDiv.appendChild(platformLabel);
      
      // Criar input para URL
      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.value = icon.getAttribute('href');
      urlInput.className = 'edit-input social-url-input';
      urlInput.placeholder = 'URL da rede social';
      urlInput.setAttribute('data-platform', platform);
      
      // Botão para remover link social
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.addEventListener('click', function() {
        iconWrapper.remove();
      });
      
      iconWrapper.appendChild(headerDiv);
      iconWrapper.appendChild(urlInput);
      iconWrapper.appendChild(removeBtn);
      
      // Substituir o ícone original pelo wrapper
      icon.parentNode.replaceChild(iconWrapper, icon);
    });
    
    // Adicionar botão para novo link social
    const socialIconsContainer = document.querySelector('.social-icons');
    const addSocialBtn = document.createElement('button');
    addSocialBtn.className = 'add-social-btn';
    addSocialBtn.innerHTML = '<i class="fas fa-plus"></i>';
    addSocialBtn.addEventListener('click', function() {
      addNewSocialLink(socialIconsContainer);
    });
    socialIconsContainer.appendChild(addSocialBtn);
    
    // Links do perfil
    const profileLinks = document.querySelectorAll('.link-btn');
    profileLinks.forEach(link => {
      const linkWrapper = document.createElement('div');
      linkWrapper.className = 'link-edit-wrapper';
      
      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.value = link.querySelector('span').textContent;
      titleInput.className = 'edit-input link-title-input';
      
      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.value = link.getAttribute('href');
      urlInput.className = 'edit-input link-url-input';
      urlInput.placeholder = 'URL';
      
      const iconSelect = document.createElement('select');
      iconSelect.className = 'edit-input icon-select';
      
      // Lista expandida de ícones
      const icons = [
        'fa-globe', 'fa-code', 'fa-envelope', 'fa-link', 'fa-file', 'fa-video', 'fa-image', 
        'fa-music', 'fa-shopping-cart', 'fa-book', 'fa-graduation-cap', 'fa-briefcase', 
        'fa-map-marker-alt', 'fa-phone', 'fa-calendar', 'fa-certificate', 'fa-trophy',
        'fa-heart', 'fa-star', 'fa-users', 'fa-comments', 'fa-lightbulb', 'fa-chart-bar',
        'fa-camera', 'fa-tools', 'fa-puzzle-piece', 'fa-gem', 'fa-gift', 'fa-podcast',
        'fa-coffee', 'fa-id-card', 'fa-ticket', 'fa-film', 'fa-palette', 'fa-laptop',
        'fa-gamepad', 'fa-hand-holding-heart', 'fa-newspaper', 'fa-microphone', 'fa-blog',
        'fa-guitar', 'fa-glasses', 'fa-utensils', 'fa-carrot', 'fa-plane', 'fa-hotel', 
        'fa-store', 'fa-medal', 'fa-user-graduate', 'fa-dumbbell', 'fa-wallet', 
        'fa-credit-card', 'fa-key', 'fa-house', 'fa-car'
      ];
      
      // Ordenar ícones alfabeticamente
      icons.sort();
      
      icons.forEach(icon => {
        const option = document.createElement('option');
        option.value = icon;
        option.textContent = icon.replace('fa-', '');
        if (link.querySelector('i').className.includes(icon)) {
          option.selected = true;
        }
        iconSelect.appendChild(option);
      });
      
      const classSelect = document.createElement('select');
      classSelect.className = 'edit-input class-select';
      
      // Lista expandida de classes/estilos
      const classes = [
        'website', 'store', 'contact', 'project', 'blog', 'video', 'music', 
        'photo', 'event', 'download', 'social', 'newsletter', 'portfolio',
        'primary', 'secondary', 'success', 'danger', 'warning', 'info',
        'premium', 'new', 'featured', 'special', 'exclusive', 'popular',
        'limited', 'free', 'pro', 'basic', 'advanced', 'business'
      ];
      
      // Ordenar classes alfabeticamente
      classes.sort();
      
      classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls;
        option.textContent = cls.charAt(0).toUpperCase() + cls.slice(1);
        if (link.classList.contains(cls)) {
          option.selected = true;
        }
        classSelect.appendChild(option);
      });
      
      // Botão para remover link
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.addEventListener('click', function() {
        linkWrapper.remove();
      });
      
      // Manter o ícone original para referência visual
      const iconPreview = document.createElement('div');
      iconPreview.className = 'icon-preview';
      iconPreview.innerHTML = link.querySelector('i').outerHTML;
      
      linkWrapper.appendChild(iconPreview);
      linkWrapper.appendChild(titleInput);
      linkWrapper.appendChild(urlInput);
      linkWrapper.appendChild(iconSelect);
      linkWrapper.appendChild(classSelect);
      linkWrapper.appendChild(removeBtn);
      
      // Substituir o link original pelo wrapper
      link.parentNode.replaceChild(linkWrapper, link);
    });
    
    // Adicionar botão para novo link de perfil
    const linksContainer = document.querySelector('.links');
    const addLinkBtn = document.createElement('button');
    addLinkBtn.className = 'add-link-btn';
    addLinkBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar Link';
    addLinkBtn.addEventListener('click', function() {
      addNewProfileLink(linksContainer);
    });
    linksContainer.appendChild(addLinkBtn);
    
    // Footer Items
    const footerItems = document.querySelectorAll('.footer-item');
    footerItems.forEach(item => {
      if (item.closest('.edit-footer-wrapper')) return; // Skip if already wrapped
      
      const itemWrapper = document.createElement('div');
      itemWrapper.className = 'edit-footer-wrapper';
      
      // Get current values
      const icon = item.querySelector('i');
      const link = item.querySelector('a');
      
      // Create inputs for editing
      const textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.className = 'edit-input footer-text-input';
      textInput.value = link ? link.textContent : item.textContent.trim();
      
      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.className = 'edit-input footer-url-input';
      urlInput.placeholder = 'URL (opcional)';
      urlInput.value = link ? link.getAttribute('href') : '';
      
      const iconSelect = document.createElement('select');
      iconSelect.className = 'edit-input footer-icon-select';
      
      // Lista completa de ícones de rodapé
      const footerIcons = [
        '', 'fa-phone-alt', 'fa-envelope', 'fa-map-marker-alt', 'fa-clock', 'fa-calendar', 
        'fa-info-circle', 'fa-copyright', 'fa-heart', 'fa-check-circle', 'fa-shield-alt',
        'fa-user-shield', 'fa-cookie', 'fa-thumbs-up', 'fa-handshake', 'fa-award',
        'fa-question-circle', 'fa-exclamation-circle', 'fa-file', 'fa-lock', 'fa-globe',
        'fa-tag', 'fa-credit-card', 'fa-truck', 'fa-headset', 'fa-eye', 'fa-university'
      ];
      
      // Ordenar ícones (exceto a opção vazia que deve permanecer primeiro)
      const emptyOption = footerIcons.shift();
      footerIcons.sort();
      footerIcons.unshift(emptyOption);
      
      footerIcons.forEach(iconClass => {
        const option = document.createElement('option');
        option.value = iconClass;
        option.textContent = iconClass ? iconClass.replace('fa-', '') : 'Sem ícone';
        if (icon && icon.className.includes(iconClass)) {
          option.selected = true;
        }
        iconSelect.appendChild(option);
      });
      
      const isBrandCheckbox = document.createElement('input');
      isBrandCheckbox.type = 'checkbox';
      isBrandCheckbox.className = 'footer-brand-checkbox';
      isBrandCheckbox.checked = link && link.classList.contains('brand-link');
      
      const isBrandLabel = document.createElement('label');
      isBrandLabel.className = 'footer-brand-label';
      isBrandLabel.appendChild(isBrandCheckbox);
      isBrandLabel.appendChild(document.createTextNode(' Destaque'));
      
      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.addEventListener('click', function() {
        itemWrapper.remove();
      });
      
      // Add inputs to wrapper
      itemWrapper.appendChild(iconSelect);
      itemWrapper.appendChild(textInput);
      itemWrapper.appendChild(urlInput);
      itemWrapper.appendChild(isBrandLabel);
      itemWrapper.appendChild(removeBtn);
      
      // Replace original item with wrapper
      item.parentNode.replaceChild(itemWrapper, item);
    });
    
    // Add button for new footer item
    const footerContainer = document.querySelector('.footer');
    const addFooterBtn = document.createElement('button');
    addFooterBtn.className = 'add-footer-btn';
    addFooterBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar Item de Rodapé';
    addFooterBtn.addEventListener('click', function() {
      addNewFooterItem(footerContainer);
    });
    footerContainer.appendChild(addFooterBtn);
    
    // Tornar o texto de copyright editável
    const copyrightText = document.querySelector('.footer-copyright');
    if (copyrightText) {
      const copyrightWrapper = document.createElement('div');
      copyrightWrapper.className = 'edit-footer-wrapper copyright-wrapper';
      
      const textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.className = 'edit-input footer-copyright-input';
      textInput.value = copyrightText.textContent.trim();
      textInput.style.width = '100%';
      
      const iconSelect = document.createElement('select');
      iconSelect.className = 'edit-input footer-icon-select';
      ['', 'fa-copyright', 'fa-registered', 'fa-trademark', 'fa-shield-alt', 'fa-award'].forEach(iconClass => {
        const option = document.createElement('option');
        option.value = iconClass;
        option.textContent = iconClass ? iconClass.replace('fa-', '') : 'Sem ícone';
        if (copyrightText.querySelector('i') && copyrightText.querySelector('i').className.includes(iconClass)) {
          option.selected = true;
        } else if (iconClass === 'fa-copyright') {
          option.selected = true;
        }
        iconSelect.appendChild(option);
      });
      
      copyrightWrapper.appendChild(iconSelect);
      copyrightWrapper.appendChild(textInput);
      
      const label = document.createElement('div');
      label.className = 'copyright-label';
      label.textContent = 'Texto de Copyright';
      label.style.fontSize = '12px';
      label.style.color = 'rgba(255,255,255,0.7)';
      label.style.marginBottom = '5px';
      
      // Inserir o wrapper após o último item do rodapé
      footerContainer.appendChild(document.createElement('hr')).style.margin = '15px 0';
      footerContainer.appendChild(label);
      footerContainer.appendChild(copyrightWrapper);
      
      // Esconder o texto original
      copyrightText.style.display = 'none';
    }
    
    // Add theme selector in edit mode (as a floating panel)
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-editor';
    themeSwitcher.innerHTML = '<h3>Escolha um tema</h3>';
    
    // Add toggle button for theme editor
    const themeToggleBtn = document.createElement('button');
    themeToggleBtn.className = 'theme-toggle-btn';
    themeToggleBtn.innerHTML = '<i class="fas fa-palette"></i>';
    themeToggleBtn.addEventListener('click', function() {
      themeSwitcher.classList.toggle('active');
    });
    
    themeSwitcher.appendChild(themeToggleBtn);
    
    const themeSelect = document.createElement('div');
    themeSelect.className = 'theme-select-grid';
    
    // Adicionar opções de tema - 10 masculinos e 10 femininos
    const totalThemes = 50;
    
    // Título para temas masculinos
    const maleTitleDiv = document.createElement('div');
    maleTitleDiv.style.width = '100%';
    maleTitleDiv.style.textAlign = 'center';
    maleTitleDiv.style.color = 'white';
    maleTitleDiv.style.fontSize = '12px';
    maleTitleDiv.style.marginBottom = '8px';
    maleTitleDiv.style.marginTop = '5px';
    maleTitleDiv.innerHTML = '<strong>Temas Masculinos</strong>';
    themeSelect.appendChild(maleTitleDiv);
    
    // Opções para temas masculinos (1-10)
    for (let i = 1; i <= 10; i++) {
      const themeOption = document.createElement('div');
      themeOption.className = `theme-option theme-${i} ${document.body.classList.contains(`theme-${i}`) ? 'active' : ''}`;
      themeOption.setAttribute('data-theme', `theme-${i}`);
      themeOption.title = `Tema ${i}`;
      
      themeOption.addEventListener('click', function() {
        // Remove active class from all options
        document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
        // Add active class to clicked option
        this.classList.add('active');
        
        // Update body class
        const themeClasses = Array.from(document.body.classList)
          .filter(cls => cls.startsWith('theme-'));
        themeClasses.forEach(cls => document.body.classList.remove(cls));
        document.body.classList.add(this.getAttribute('data-theme'));
      });
      
      themeSelect.appendChild(themeOption);
    }
    
    // Título para temas femininos
    const femaleTitleDiv = document.createElement('div');
    femaleTitleDiv.style.width = '100%';
    femaleTitleDiv.style.textAlign = 'center';
    femaleTitleDiv.style.color = 'white';
    femaleTitleDiv.style.fontSize = '12px';
    femaleTitleDiv.style.marginBottom = '8px';
    femaleTitleDiv.style.marginTop = '15px';
    femaleTitleDiv.innerHTML = '<strong>Temas Femininos</strong>';
    themeSelect.appendChild(femaleTitleDiv);
    
    // Opções para temas femininos (11-20)
    for (let i = 11; i <= totalThemes; i++) {
      const themeOption = document.createElement('div');
      themeOption.className = `theme-option theme-${i} ${document.body.classList.contains(`theme-${i}`) ? 'active' : ''}`;
      themeOption.setAttribute('data-theme', `theme-${i}`);
      themeOption.title = `Tema ${i}`;
      
      themeOption.addEventListener('click', function() {
        // Remove active class from all options
        document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
        // Add active class to clicked option
        this.classList.add('active');
        
        // Update body class
        const themeClasses = Array.from(document.body.classList)
          .filter(cls => cls.startsWith('theme-'));
        themeClasses.forEach(cls => document.body.classList.remove(cls));
        document.body.classList.add(this.getAttribute('data-theme'));
      });
      
      themeSelect.appendChild(themeOption);
    }
    
    themeSwitcher.appendChild(themeSelect);
    document.body.appendChild(themeSwitcher);
    
    // Activate the theme editor panel by default
    setTimeout(() => {
      themeSwitcher.classList.add('active');
    }, 500);
  }
  
  // Adicionar novo item de rodapé
  function addNewFooterItem(container) {
    const itemWrapper = document.createElement('div');
    itemWrapper.className = 'edit-footer-wrapper';
    
    // Create inputs for editing
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'edit-input footer-text-input';
    textInput.value = 'Novo Item';
    textInput.placeholder = 'Texto';
    
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'edit-input footer-url-input';
    urlInput.placeholder = 'URL (opcional)';
    urlInput.value = '';
    
    const iconSelect = document.createElement('select');
    iconSelect.className = 'edit-input footer-icon-select';
    
    // Lista completa de ícones de rodapé
    const footerIcons = [
      '', 'fa-phone-alt', 'fa-envelope', 'fa-map-marker-alt', 'fa-clock', 'fa-calendar', 
      'fa-info-circle', 'fa-copyright', 'fa-heart', 'fa-check-circle', 'fa-shield-alt',
      'fa-user-shield', 'fa-cookie', 'fa-thumbs-up', 'fa-handshake', 'fa-award',
      'fa-question-circle', 'fa-exclamation-circle', 'fa-file', 'fa-lock', 'fa-globe',
      'fa-tag', 'fa-credit-card', 'fa-truck', 'fa-headset', 'fa-eye', 'fa-university'
    ];
    
    // Ordenar ícones (exceto a opção vazia que deve permanecer primeiro)
    const emptyOption = footerIcons.shift();
    footerIcons.sort();
    footerIcons.unshift(emptyOption);
    
    footerIcons.forEach(iconClass => {
      const option = document.createElement('option');
      option.value = iconClass;
      option.textContent = iconClass ? iconClass.replace('fa-', '') : 'Sem ícone';
      iconSelect.appendChild(option);
    });
    
    const isBrandCheckbox = document.createElement('input');
    isBrandCheckbox.type = 'checkbox';
    isBrandCheckbox.className = 'footer-brand-checkbox';
    
    const isBrandLabel = document.createElement('label');
    isBrandLabel.className = 'footer-brand-label';
    isBrandLabel.appendChild(isBrandCheckbox);
    isBrandLabel.appendChild(document.createTextNode(' Destaque'));
    
    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', function() {
      itemWrapper.remove();
    });
    
    // Add inputs to wrapper
    itemWrapper.appendChild(iconSelect);
    itemWrapper.appendChild(textInput);
    itemWrapper.appendChild(urlInput);
    itemWrapper.appendChild(isBrandLabel);
    itemWrapper.appendChild(removeBtn);
    
    // Insert at appropriate position
    const existingItems = container.querySelectorAll('.edit-footer-wrapper');
    if (existingItems.length > 0) {
      container.insertBefore(itemWrapper, existingItems[existingItems.length - 1].nextSibling);
    } else {
      const addBtn = container.querySelector('.add-footer-btn');
      if (addBtn) {
        container.insertBefore(itemWrapper, addBtn);
      } else {
        container.appendChild(itemWrapper);
      }
    }
  }
  
  // Adicionar novo link social
  function addNewSocialLink(container) {
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'social-edit-wrapper';
    
    // Criar cabeçalho com ícone e plataforma
    const headerDiv = document.createElement('div');
    headerDiv.className = 'social-header';
    
    // Lista mais completa de plataformas sociais
    const platforms = [
      'instagram', 'linkedin', 'github', 'twitter', 'facebook', 'youtube', 'tiktok', 'twitch',
      'pinterest', 'snapchat', 'reddit', 'whatsapp', 'telegram', 'discord', 'medium', 'spotify',
      'behance', 'dribbble', 'vimeo', 'flickr', 'mastodon', 'quora', 'soundcloud', 
      'slack', 'skype', 'wordpress', 'tumblr', 'deviantart', 'meetup', 'gmail',
      'outlook', 'amazon', 'windows', 'xbox', 'playstation', 'apple'
    ];
    
    // Ordenar plataformas alfabeticamente
    platforms.sort();
    
    // Plataforma padrão (Instagram)
    const defaultPlatform = 'instagram';
    
    // Criar o ícone social
    const iconElement = document.createElement('a');
    iconElement.className = 'social-icon ' + defaultPlatform;
    iconElement.innerHTML = '<i class="fab fa-' + defaultPlatform + '"></i>';
    
    // Criar label para a plataforma
    const platformLabel = document.createElement('h4');
    platformLabel.textContent = defaultPlatform.charAt(0).toUpperCase() + defaultPlatform.slice(1);
    platformLabel.style.margin = '0';
    platformLabel.style.color = '#fff';
    
    // Adicionar elementos ao cabeçalho
    headerDiv.appendChild(iconElement);
    headerDiv.appendChild(platformLabel);
    
    // Criar input para URL
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.value = '#';
    urlInput.className = 'edit-input social-url-input';
    urlInput.placeholder = 'URL da rede social';
    
    // Criar seletor de plataforma 
    const platformSelect = document.createElement('select');
    platformSelect.className = 'edit-input platform-select';
    
    platforms.forEach(platform => {
      const option = document.createElement('option');
      option.value = platform;
      option.textContent = platform.charAt(0).toUpperCase() + platform.slice(1);
      if (platform === defaultPlatform) {
        option.selected = true;
      }
      platformSelect.appendChild(option);
    });
    
    // Atualizar plataforma quando selecionada
    platformSelect.addEventListener('change', function() {
      const selectedPlatform = this.value;
      iconElement.className = 'social-icon ' + selectedPlatform;
      iconElement.innerHTML = `<i class="fab fa-${selectedPlatform}"></i>`;
      platformLabel.textContent = selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1);
    });
    
    // Container para o seletor de plataforma
    const selectContainer = document.createElement('div');
    selectContainer.style.marginTop = '10px';
    selectContainer.appendChild(document.createTextNode('Alterar rede social: '));
    selectContainer.appendChild(platformSelect);
    
    // Botão para remover link social
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', function() {
      iconWrapper.remove();
    });
    
    // Montar o componente completo
    iconWrapper.appendChild(headerDiv);
    iconWrapper.appendChild(urlInput);
    iconWrapper.appendChild(selectContainer);
    iconWrapper.appendChild(removeBtn);
    
    // Inserir antes do botão de adicionar
    container.insertBefore(iconWrapper, container.querySelector('.add-social-btn'));
  }
  
  // Adicionar novo link de perfil
  function addNewProfileLink(container) {
    const linkWrapper = document.createElement('div');
    linkWrapper.className = 'link-edit-wrapper';
    
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = 'Novo Link';
    titleInput.className = 'edit-input link-title-input';
    titleInput.placeholder = 'Título';
    
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.value = '#';
    urlInput.className = 'edit-input link-url-input';
    urlInput.placeholder = 'URL';
    
    const iconSelect = document.createElement('select');
    iconSelect.className = 'edit-input icon-select';
    
    // Lista expandida de ícones
    const icons = [
      'fa-globe', 'fa-code', 'fa-envelope', 'fa-link', 'fa-file', 'fa-video', 'fa-image', 
      'fa-music', 'fa-shopping-cart', 'fa-book', 'fa-graduation-cap', 'fa-briefcase', 
      'fa-map-marker-alt', 'fa-phone', 'fa-calendar', 'fa-certificate', 'fa-trophy',
      'fa-heart', 'fa-star', 'fa-users', 'fa-comments', 'fa-lightbulb', 'fa-chart-bar',
      'fa-camera', 'fa-tools', 'fa-puzzle-piece', 'fa-gem', 'fa-gift', 'fa-podcast',
      'fa-coffee', 'fa-location-dot', 'fa-id-card', 'fa-ticket', 'fa-film',
      'fa-palette', 'fa-laptop', 'fa-gamepad', 'fa-hand-holding-heart', 'fa-newspaper',
      'fa-microphone', 'fa-blog', 'fa-guitar', 'fa-glasses', 'fa-utensils', 'fa-carrot',
      'fa-plane', 'fa-hotel', 'fa-store', 'fa-medal', 'fa-user-graduate', 'fa-dumbbell',
      'fa-wallet', 'fa-credit-card', 'fa-key', 'fa-house', 'fa-car'
    ];
    
    // Ordenar ícones alfabeticamente
    icons.sort();
    
    // Adicionar opções ao select
    icons.forEach(icon => {
      const option = document.createElement('option');
      option.value = icon;
      option.textContent = icon.replace('fa-', '');
      iconSelect.appendChild(option);
    });
    
    const classSelect = document.createElement('select');
    classSelect.className = 'edit-input class-select';
    
    // Lista expandida de classes/estilos
    const classes = [
      'website', 'store', 'contact', 'project', 'blog', 'video', 'music', 
      'photo', 'event', 'download', 'social', 'newsletter', 'portfolio',
      'primary', 'secondary', 'success', 'danger', 'warning', 'info',
      'premium', 'new', 'featured', 'special', 'exclusive', 'popular',
      'limited', 'free', 'pro', 'basic', 'advanced', 'business'
    ];
    
    // Ordenar classes alfabeticamente
    classes.sort();
    
    classes.forEach(cls => {
      const option = document.createElement('option');
      option.value = cls;
      option.textContent = cls.charAt(0).toUpperCase() + cls.slice(1);
      classSelect.appendChild(option);
    });
    
    // Botão para remover link
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', function() {
      linkWrapper.remove();
    });
    
    // Manter o ícone original para referência visual
    const iconPreview = document.createElement('div');
    iconPreview.className = 'icon-preview';
    iconPreview.innerHTML = '<i class="fas fa-globe"></i>';
    
    // Atualizar o ícone quando selecionado
    iconSelect.addEventListener('change', function() {
      iconPreview.innerHTML = `<i class="fas ${iconSelect.value}"></i>`;
    });
    
    linkWrapper.appendChild(iconPreview);
    linkWrapper.appendChild(titleInput);
    linkWrapper.appendChild(urlInput);
    linkWrapper.appendChild(iconSelect);
    linkWrapper.appendChild(classSelect);
    linkWrapper.appendChild(removeBtn);
    
    // Inserir antes do botão de adicionar
    container.insertBefore(linkWrapper, container.querySelector('.add-link-btn'));
  }
  
  // Remover elementos de edição
  function removeEditableFields() {
    // Recarregar a página para obter o estado mais recente
    window.location.reload();
  }
  
  // Coletar dados editados
  function collectEditedData() {
    console.log("Coletando dados editados...");
    
    // Verificar existência dos elementos antes de tentar acessar seus valores
    const usernameInput = document.querySelector('.username-input');
    const bioInput = document.querySelector('.bio-input');
    const descriptionInput = document.querySelector('.description-input');
    const phoneInput = document.querySelector('.phone-input');
    const copyrightInput = document.querySelector('.footer-copyright-input');
    const copyrightIconSelect = document.querySelector('.copyright-wrapper .footer-icon-select');
    
    console.log("Elementos de formulário encontrados:", {
      username: usernameInput ? "Sim" : "Não",
      bio: bioInput ? "Sim" : "Não",
      description: descriptionInput ? "Sim" : "Não"
    });
    
    if (!usernameInput || !bioInput) {
      console.error("Elementos críticos do formulário não encontrados!");
      showMessage('Erro ao coletar dados do formulário', 'error');
      return null;
    }
    
    const data = {
      name: usernameInput.value,
      bio: bioInput.value,
      description: descriptionInput ? descriptionInput.value : '',
      phone: phoneInput ? phoneInput.value : '',
      social_links: [],
      profile_links: [],
      footer_items: [],
      theme: '',
      pattern: '',
      copyright_text: copyrightInput ? copyrightInput.value : '',
      copyright_icon: copyrightIconSelect ? copyrightIconSelect.value : 'fa-copyright',
      timestamp: new Date().getTime()  // Adicionar timestamp para evitar problemas de cache
    };
    
    console.log("Dados básicos coletados:", {
      name: data.name,
      bio: data.bio,
      description: data.description
    });
    
    // Coletar tema selecionado
    const activeTheme = document.querySelector('.theme-option.active');
    if (activeTheme) {
      data.theme = activeTheme.getAttribute('data-theme');
    }
    
    // Coletar padrão animado selecionado
    const activePattern = document.querySelector('.pattern-option.active');
    if (activePattern) {
      data.pattern = activePattern.getAttribute('data-pattern');
    }
    
    // Verificar se a imagem foi alterada
    const profileImg = document.querySelector('.img-edit-wrapper img');
    if (profileImg && profileImg.hasAttribute('data-image-base64')) {
      data.profile_image = profileImg.getAttribute('data-image-base64');
    }
    
    // Coletar links sociais
    document.querySelectorAll('.social-edit-wrapper').forEach(wrapper => {
      let platform;
      let urlInput;
      
      if (wrapper.querySelector('.platform-select')) {
        // Novo link social
        platform = wrapper.querySelector('.platform-select').value;
        urlInput = wrapper.querySelector('.social-url-input');
      } else {
        // Link social existente
        const socialIcon = wrapper.querySelector('.social-icon');
        platform = Array.from(socialIcon.classList).find(c => c !== 'social-icon');
        urlInput = wrapper.querySelector('.social-url-input');
      }
      
      data.social_links.push({
        platform: platform,
        url: urlInput.value,
        icon: `fa-${platform}`
      });
    });
    
    // Coletar links do perfil
    document.querySelectorAll('.link-edit-wrapper').forEach(wrapper => {
      data.profile_links.push({
        title: wrapper.querySelector('.link-title-input').value,
        url: wrapper.querySelector('.link-url-input').value,
        icon: wrapper.querySelector('.icon-select').value,
        class: wrapper.querySelector('.class-select').value
      });
    });
    
    // Coletar itens do footer
    document.querySelectorAll('.edit-footer-wrapper').forEach(wrapper => {
      const textInput = wrapper.querySelector('.footer-text-input');
      const urlInput = wrapper.querySelector('.footer-url-input');
      const iconSelect = wrapper.querySelector('.footer-icon-select');
      const isBrandCheckbox = wrapper.querySelector('.footer-brand-checkbox');
      
      if (textInput && textInput.value.trim()) {
        data.footer_items.push({
          text: textInput.value.trim(),
          url: urlInput ? urlInput.value : '',
          icon: iconSelect ? iconSelect.value : '',
          is_brand: isBrandCheckbox ? isBrandCheckbox.checked : false
        });
      }
    });
    
    return data;
  }
  
  // Salvar alterações no servidor
  function saveChanges() {
    // Criar um objeto de dados simplificado para teste
    const simplifiedData = {
      name: document.querySelector('.username-input')?.value || 'Nome não encontrado',
      bio: document.querySelector('.bio-input')?.value || 'Bio não encontrada',
      description: document.querySelector('.description-input')?.value || '',
      social_links: [],
      profile_links: [],
      footer_items: [],
      theme: document.body.className || 'theme-1',
      pattern: document.body.getAttribute('data-pattern') || 'none',
      timestamp: new Date().getTime()
    };
    
    console.log("TESTE SIMPLIFICADO - Dados a serem salvos:", simplifiedData);
    
    // Mostrar indicador de carregamento
    showMessage('Tentando salvar alterações...', 'loading');
    
    // Enviar dados para o servidor com abordagem simplificada
    fetch('/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simplifiedData),
    })
    .then(response => {
      console.log("Resposta do servidor:", response.status, response.statusText);
      
      // Mostrar resposta bruta para debug
      response.clone().text().then(text => {
        console.log('Conteúdo bruto da resposta:', text);
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(responseData => {
      console.log("Dados de resposta:", responseData);
      
      // Mostrar mensagem de sucesso
      showMessage('Teste de salvamento concluído. Verificando resposta...', 'success');
      
      // Forçar recarregamento da página após 2 segundos
      setTimeout(() => {
        console.log("Recarregando página para ver alterações...");
        window.location.href = window.location.pathname + '?reload=' + new Date().getTime();
      }, 2000);
    })
    .catch(error => {
      console.error('Erro durante teste de salvamento:', error);
      showMessage('Erro durante teste de salvamento. Verifique o console.', 'error');
    });
  }
  
  // Mostrar mensagem
  function showMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
      messageElement.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      messageElement.classList.remove('show');
      setTimeout(() => {
        messageElement.remove();
      }, 300);
    }, 3000);
  }
  
  // Criar e adicionar botões de ação para o modo de edição
  function createActionButtons() {
    console.log('Criando botões de ação...');
    
    // Obter o container de botões existente
    const actionButtonsContainer = document.querySelector('.edit-action-buttons');
    
    // Limpar e preparar o container
    if (actionButtonsContainer) {
      actionButtonsContainer.innerHTML = '';
      actionButtonsContainer.style.display = 'flex';
      actionButtonsContainer.style.opacity = '1';
      actionButtonsContainer.style.visibility = 'visible';
      
      // Botão Salvar
      const newSaveButton = document.createElement('button');
      newSaveButton.className = 'save-button';
      newSaveButton.id = 'save-button';
      newSaveButton.innerHTML = '<i class="fas fa-check"></i>';
      newSaveButton.addEventListener('click', function() {
        console.log('Botão Salvar clicado');
        saveChanges();
      });
      
      // Botão Cancelar
      const newCancelButton = document.createElement('button');
      newCancelButton.className = 'cancel-button';
      newCancelButton.id = 'cancel-button';
      newCancelButton.innerHTML = '<i class="fas fa-times"></i>';
      newCancelButton.addEventListener('click', function() {
        console.log('Botão Cancelar clicado');
        disableEditMode();
      });
      
      // Adicionar botões ao container
      actionButtonsContainer.appendChild(newSaveButton);
      actionButtonsContainer.appendChild(newCancelButton);
      
      console.log('Botões de ação criados com sucesso!');
    } else {
      console.error('Container de botões de ação não encontrado!');
    }
  }
  
  // Verificar se botão de edição existe e adicionar eventos
  /* Este bloco está causando erro porque já configuramos o evento de clique no início do arquivo.
  if (editToggle) {
    console.log('Adicionando event listener ao botão de edição existente');
    // Remover event listeners antigos (se houver)
    const newEditToggle = editToggle.cloneNode(true);
    editToggle.parentNode.replaceChild(newEditToggle, editToggle);
    
    // Adicionar event listener ao botão clonado
    newEditToggle.addEventListener('click', function(e) {
      console.log('Botão de edição clicado!');
      e.preventDefault();
      e.stopPropagation();
      enableEditMode();
      createActionButtons(); // Criar botões quando o modo de edição for habilitado
    });
  }
  */
  
  // Log de debug final
  console.log('Inicialização do sistema de edição concluída');
});