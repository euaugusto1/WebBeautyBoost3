document.addEventListener('DOMContentLoaded', function() {
  // Elementos principais
  const editToggle = document.getElementById('edit-toggle');
  const saveButton = document.getElementById('save-button');
  const cancelButton = document.getElementById('cancel-button');
  const editControls = document.getElementById('edit-controls');
  const profileContainer = document.querySelector('.container');
  
  // Estado de edição
  let isEditMode = false;
  let originalData = {};
  
  // Guardar dados originais para restaurar em caso de cancelamento
  function saveOriginalData() {
    originalData.name = document.querySelector('.username').textContent.replace('•', '').trim();
    originalData.bio = document.querySelector('.bio').textContent;
    
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
    isEditMode = true;
    profileContainer.classList.add('edit-mode');
    editControls.classList.add('active');
    
    // Salvar dados originais
    saveOriginalData();
    
    // Tornar campos editáveis
    makeFieldsEditable();
  }
  
  // Desativar modo de edição
  function disableEditMode() {
    isEditMode = false;
    profileContainer.classList.remove('edit-mode');
    editControls.classList.remove('active');
    
    // Remover elementos de edição
    removeEditableFields();
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
    
    // Telefone
    const phone = document.querySelector('.footer p:first-child');
    const phoneText = phone.textContent.replace(/.*: /, '');
    const phoneIcon = document.createElement('i');
    phoneIcon.className = 'fas fa-phone-alt';
    const phoneInput = document.createElement('input');
    phoneInput.type = 'text';
    phoneInput.value = phoneText;
    phoneInput.className = 'edit-input phone-input';
    phone.innerHTML = '';
    phone.appendChild(phoneIcon);
    phone.appendChild(document.createTextNode(' '));
    phone.appendChild(phoneInput);
    
    // Links sociais
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'social-edit-wrapper';
      
      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.value = icon.getAttribute('href');
      urlInput.className = 'edit-input social-url-input';
      urlInput.setAttribute('data-platform', Array.from(icon.classList).find(c => c !== 'social-icon'));
      
      // Botão para remover link social
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.addEventListener('click', function() {
        iconWrapper.remove();
      });
      
      // Manter o ícone original
      const iconElement = icon.cloneNode(true);
      
      iconWrapper.appendChild(iconElement);
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
      ['fa-globe', 'fa-code', 'fa-envelope', 'fa-link', 'fa-file', 'fa-video', 'fa-image', 'fa-music', 'fa-shopping-cart'].forEach(icon => {
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
      ['website', 'store', 'contact'].forEach(cls => {
        const option = document.createElement('option');
        option.value = cls;
        option.textContent = cls;
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
      ['', 'fa-phone-alt', 'fa-envelope', 'fa-map-marker-alt', 'fa-clock', 'fa-calendar', 'fa-info-circle'].forEach(iconClass => {
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
    
    // Add theme selector in edit mode
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-editor';
    themeSwitcher.innerHTML = '<h3>Escolha um tema</h3>';
    
    const themeSelect = document.createElement('div');
    themeSelect.className = 'theme-select-grid';
    
    // Add theme options
    for (let i = 1; i <= 10; i++) {
      const themeOption = document.createElement('div');
      themeOption.className = `theme-option theme-${i} ${document.body.classList.contains(`theme-${i}`) ? 'active' : ''}`;
      themeOption.setAttribute('data-theme', `theme-${i}`);
      
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
    editControls.appendChild(themeSwitcher);
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
    ['', 'fa-phone-alt', 'fa-envelope', 'fa-map-marker-alt', 'fa-clock', 'fa-calendar', 'fa-info-circle'].forEach(iconClass => {
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
    
    const platformSelect = document.createElement('select');
    platformSelect.className = 'edit-input platform-select';
    ['instagram', 'linkedin', 'github', 'twitter', 'facebook', 'youtube', 'tiktok', 'twitch'].forEach(platform => {
      const option = document.createElement('option');
      option.value = platform;
      option.textContent = platform;
      platformSelect.appendChild(option);
    });
    
    const iconElement = document.createElement('a');
    iconElement.className = 'social-icon instagram';
    iconElement.innerHTML = '<i class="fab fa-instagram"></i>';
    
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.value = '#';
    urlInput.className = 'edit-input social-url-input';
    urlInput.placeholder = 'URL';
    
    // Atualizar plataforma quando selecionada
    platformSelect.addEventListener('change', function() {
      iconElement.className = 'social-icon ' + platformSelect.value;
      iconElement.innerHTML = `<i class="fab fa-${platformSelect.value}"></i>`;
    });
    
    // Botão para remover link social
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', function() {
      iconWrapper.remove();
    });
    
    iconWrapper.appendChild(iconElement);
    iconWrapper.appendChild(platformSelect);
    iconWrapper.appendChild(urlInput);
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
    ['fa-globe', 'fa-code', 'fa-envelope', 'fa-link', 'fa-file', 'fa-video', 'fa-image', 'fa-music', 'fa-shopping-cart'].forEach(icon => {
      const option = document.createElement('option');
      option.value = icon;
      option.textContent = icon.replace('fa-', '');
      iconSelect.appendChild(option);
    });
    
    const classSelect = document.createElement('select');
    classSelect.className = 'edit-input class-select';
    ['website', 'store', 'contact'].forEach(cls => {
      const option = document.createElement('option');
      option.value = cls;
      option.textContent = cls;
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
    const data = {
      name: document.querySelector('.username-input').value,
      bio: document.querySelector('.bio-input').value,
      phone: document.querySelector('.phone-input').value,
      social_links: [],
      profile_links: [],
      footer_items: [],
      theme: ''
    };
    
    // Coletar tema selecionado
    const activeTheme = document.querySelector('.theme-option.active');
    if (activeTheme) {
      data.theme = activeTheme.getAttribute('data-theme');
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
    const data = collectEditedData();
    
    // Enviar dados para o servidor
    fetch('/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha ao salvar as alterações');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Mostrar mensagem de sucesso
        showMessage('Perfil atualizado com sucesso!', 'success');
        
        // Desativar modo de edição e recarregar a página
        setTimeout(() => {
          disableEditMode();
        }, 1000);
      } else {
        showMessage(data.message || 'Ocorreu um erro ao salvar as alterações.', 'error');
      }
    })
    .catch(error => {
      console.error('Erro:', error);
      showMessage('Ocorreu um erro ao salvar as alterações. Tente novamente.', 'error');
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
  
  // Verificar se botão de edição existe e adicionar eventos
  if (editToggle) {
    editToggle.addEventListener('click', function() {
      enableEditMode();
    });
    
    saveButton.addEventListener('click', function() {
      saveChanges();
    });
    
    cancelButton.addEventListener('click', function() {
      disableEditMode();
    });
  }
});