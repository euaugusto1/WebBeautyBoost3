# Componentes React do Projeto LinkStack

Abaixo estão os principais componentes do projeto LinkStack React:

## App.jsx - Componente Principal

```jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { EditProvider } from './context/EditContext';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <div className="app-loader">Carregando...</div>;
  }
  
  return (
    <BrowserRouter>
      <ThemeProvider>
        <EditProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/:username" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </EditProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
```

## context/ThemeContext.jsx - Contexto de Temas

```jsx
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('theme-2');
  const [pattern, setPattern] = useState('none');
  
  // Carregar tema das preferências locais
  useEffect(() => {
    const savedTheme = localStorage.getItem('linkstack-theme');
    const savedPattern = localStorage.getItem('linkstack-pattern');
    
    if (savedTheme) setTheme(savedTheme);
    if (savedPattern) setPattern(savedPattern);
    
    // Aplicar tema ao body
    document.body.className = savedTheme || theme;
    document.body.setAttribute('data-pattern', savedPattern || pattern);
  }, []);
  
  // Salvar e aplicar novo tema
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('linkstack-theme', newTheme);
    document.body.className = newTheme;
  };
  
  // Salvar e aplicar novo padrão de fundo
  const changePattern = (newPattern) => {
    setPattern(newPattern);
    localStorage.setItem('linkstack-pattern', newPattern);
    document.body.setAttribute('data-pattern', newPattern);
    applyAnimatedPattern(newPattern);
  };
  
  // Aplicar padrão animado
  const applyAnimatedPattern = (patternName) => {
    // Remover padrões existentes
    const existingPatterns = document.querySelectorAll('.animated-pattern');
    existingPatterns.forEach(el => el.remove());
    
    if (patternName === 'none') return;
    
    // Código para criar e aplicar padrões animados
    // Isso será implementado de acordo com a lógica específica de cada padrão
    console.log(`Aplicando padrão: ${patternName}`);
    
    // Exemplo: criar container para o padrão
    const patternContainer = document.createElement('div');
    patternContainer.className = `animated-pattern pattern-${patternName}`;
    document.body.appendChild(patternContainer);
    
    // Aplicar lógica específica para cada tipo de padrão
    switch (patternName) {
      case 'particles':
        // Implementar lógica de partículas
        break;
      case 'wave':
        // Implementar lógica de ondas
        break;
      // Outros casos para diferentes padrões
      default:
        break;
    }
  };
  
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        changeTheme, 
        pattern, 
        changePattern,
        applyAnimatedPattern 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
```

## context/EditContext.jsx - Contexto de Edição

```jsx
import { createContext, useState } from 'react';

export const EditContext = createContext();

export const EditProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  
  // Ativar modo de edição
  const enableEditMode = () => {
    // Salvar dados originais antes de entrar no modo de edição
    const profileData = {
      name: document.querySelector('.username')?.textContent.replace('•', '').trim() || '',
      bio: document.querySelector('.bio')?.textContent || '',
      // Outros dados a serem salvos...
    };
    
    setOriginalData(profileData);
    setIsEditMode(true);
    setIsDirty(false);
    document.body.classList.add('edit-mode');
  };
  
  // Desativar modo de edição
  const disableEditMode = () => {
    setIsEditMode(false);
    document.body.classList.remove('edit-mode');
  };
  
  // Salvar alterações
  const saveChanges = async (editedData) => {
    try {
      // Aqui seria implementada a lógica de envio para o backend
      console.log('Dados a salvar:', editedData);
      
      // Simulação de sucesso
      setIsEditMode(false);
      setIsDirty(false);
      document.body.classList.remove('edit-mode');
      
      return { success: true, message: 'Perfil atualizado com sucesso!' };
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      return { success: false, message: 'Erro ao atualizar perfil. Tente novamente.' };
    }
  };
  
  // Cancelar edição
  const cancelEdit = () => {
    if (isDirty) {
      const confirmCancel = window.confirm('Você tem alterações não salvas. Tem certeza que deseja cancelar?');
      if (!confirmCancel) return false;
    }
    
    disableEditMode();
    return true;
  };
  
  // Marcar que houve alterações
  const setEdited = () => {
    setIsDirty(true);
  };
  
  return (
    <EditContext.Provider 
      value={{ 
        isEditMode, 
        enableEditMode, 
        disableEditMode,
        saveChanges,
        cancelEdit,
        setEdited,
        originalData,
        isDirty
      }}
    >
      {children}
    </EditContext.Provider>
  );
};
```

## components/profile/ProfileHeader.jsx - Cabeçalho do Perfil

```jsx
import { useContext } from 'react';
import { EditContext } from '../../context/EditContext';
import './ProfileHeader.css';

export const ProfileHeader = ({ profile, onUpdate }) => {
  const { isEditMode, setEdited } = useContext(EditContext);
  
  // Handler para atualização de campos
  const handleInputChange = (field, value) => {
    onUpdate({ ...profile, [field]: value });
    setEdited();
  };
  
  return (
    <div className="profile-header">
      <div className="logo">
        {isEditMode ? (
          <div className="img-edit-wrapper">
            <img 
              src={profile.profileImage || 'default-avatar.png'} 
              alt={profile.name} 
              className="profile-img" 
            />
            <button className="upload-img-btn" title="Alterar foto de perfil">
              <i className="fas fa-camera"></i>
            </button>
            <input 
              type="file" 
              accept="image/*" 
              className="img-file-input" 
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    handleInputChange('profileImage', e.target.result);
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
            />
          </div>
        ) : (
          <img 
            src={profile.profileImage || 'default-avatar.png'} 
            alt={profile.name} 
            className="profile-img" 
          />
        )}
      </div>
      
      <div className="username">
        {isEditMode ? (
          <input
            type="text"
            className="edit-input username-input"
            value={profile.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Seu nome"
          />
        ) : (
          <>
            {profile.name}
            <span className="dot">•</span>
          </>
        )}
      </div>
      
      <div className="bio">
        {isEditMode ? (
          <textarea
            className="edit-input bio-input"
            value={profile.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Sua bio"
          />
        ) : (
          profile.bio
        )}
      </div>
      
      <div className="description">
        {isEditMode ? (
          <textarea
            className="edit-input description-input"
            value={profile.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Adicione uma descrição sobre você..."
          />
        ) : (
          profile.description
        )}
      </div>
    </div>
  );
};
```

## components/profile/SocialLinks.jsx - Links de Redes Sociais

```jsx
import { useContext } from 'react';
import { EditContext } from '../../context/EditContext';
import './SocialLinks.css';

export const SocialLinks = ({ socialLinks = [], onUpdate }) => {
  const { isEditMode, setEdited } = useContext(EditContext);
  
  // Adicionar novo link social
  const addSocialLink = () => {
    const newLinks = [
      ...socialLinks,
      { id: Date.now(), platform: 'instagram', url: '', icon: 'fab fa-instagram' }
    ];
    onUpdate(newLinks);
    setEdited();
  };
  
  // Atualizar link social
  const updateSocialLink = (id, field, value) => {
    const updatedLinks = socialLinks.map(link => {
      if (link.id === id) {
        return { ...link, [field]: value };
      }
      return link;
    });
    onUpdate(updatedLinks);
    setEdited();
  };
  
  // Remover link social
  const removeSocialLink = (id) => {
    const updatedLinks = socialLinks.filter(link => link.id !== id);
    onUpdate(updatedLinks);
    setEdited();
  };
  
  // Atualizar plataforma e ícone
  const updatePlatform = (id, platform) => {
    const icon = `fab fa-${platform}`;
    const updatedLinks = socialLinks.map(link => {
      if (link.id === id) {
        return { ...link, platform, icon };
      }
      return link;
    });
    onUpdate(updatedLinks);
    setEdited();
  };
  
  // Plataformas disponíveis
  const platforms = [
    { id: 'instagram', name: 'Instagram' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'github', name: 'GitHub' },
    { id: 'youtube', name: 'YouTube' },
    // Outras plataformas...
  ];
  
  if (isEditMode) {
    return (
      <div className="social-icons">
        {socialLinks.map(link => (
          <div key={link.id} className="social-edit-wrapper">
            <div className="social-header">
              <div className="social-icon-preview">
                <i className={link.icon}></i>
              </div>
              <h4>{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</h4>
            </div>
            
            <select
              className="platform-select edit-input"
              value={link.platform}
              onChange={(e) => updatePlatform(link.id, e.target.value)}
            >
              {platforms.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              className="edit-input social-url-input"
              value={link.url}
              onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
              placeholder="URL da rede social"
            />
            
            <button 
              className="remove-btn" 
              onClick={() => removeSocialLink(link.id)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
        
        <button 
          className="add-social-btn" 
          onClick={addSocialLink}
        >
          <i className="fas fa-plus"></i> Adicionar rede social
        </button>
      </div>
    );
  }
  
  return (
    <div className="social-icons">
      {socialLinks.map(link => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`social-icon ${link.platform}`}
          data-platform={link.platform}
        >
          <i className={link.icon}></i>
        </a>
      ))}
    </div>
  );
};
```

## components/profile/ProfileLinks.jsx - Links do Perfil

```jsx
import { useContext } from 'react';
import { EditContext } from '../../context/EditContext';
import './ProfileLinks.css';

export const ProfileLinks = ({ profileLinks = [], onUpdate }) => {
  const { isEditMode, setEdited } = useContext(EditContext);
  
  // Adicionar novo link
  const addProfileLink = () => {
    const newLinks = [
      ...profileLinks,
      { 
        id: Date.now(), 
        title: 'Novo Link', 
        url: 'https://', 
        icon: 'fas fa-link', 
        class: '',
        click_count: 0
      }
    ];
    onUpdate(newLinks);
    setEdited();
  };
  
  // Atualizar link
  const updateProfileLink = (id, field, value) => {
    const updatedLinks = profileLinks.map(link => {
      if (link.id === id) {
        return { ...link, [field]: value };
      }
      return link;
    });
    onUpdate(updatedLinks);
    setEdited();
  };
  
  // Remover link
  const removeProfileLink = (id) => {
    const updatedLinks = profileLinks.filter(link => link.id !== id);
    onUpdate(updatedLinks);
    setEdited();
  };
  
  // Classes CSS disponíveis
  const linkClasses = [
    { value: '', label: 'Padrão' },
    { value: 'website', label: 'Website' },
    { value: 'store', label: 'Loja' },
    { value: 'contact', label: 'Contato' },
    { value: 'community', label: 'Comunidade' }
  ];
  
  // Ícones disponíveis
  const icons = [
    'fa-link', 'fa-globe', 'fa-heart', 'fa-star', 'fa-check', 'fa-thumbs-up',
    'fa-envelope', 'fa-phone', 'fa-music', 'fa-video', 'fa-code', 'fa-file'
    // Outros ícones...
  ];
  
  // Registrar clique em um link
  const trackClick = async (linkId, url) => {
    try {
      // Aqui seria chamada a API para registrar o clique
      console.log(`Clique registrado no link ${linkId}`);
      
      // Abrir URL em nova aba
      window.open(url, '_blank');
    } catch (error) {
      console.error('Erro ao registrar clique:', error);
      window.open(url, '_blank');
    }
  };
  
  if (isEditMode) {
    return (
      <div className="links-edit-container">
        {profileLinks.map(link => (
          <div key={link.id} className="link-edit-wrapper">
            <div className="link-header">
              <div className="icon-preview">
                <i className={`fas ${link.icon.replace('fas ', '')}`}></i>
              </div>
              <input
                type="text"
                className="edit-input link-title-input"
                value={link.title}
                onChange={(e) => updateProfileLink(link.id, 'title', e.target.value)}
                placeholder="Título do link"
              />
            </div>
            
            <div className="link-url-row">
              <input
                type="text"
                className="edit-input link-url-input"
                value={link.url}
                onChange={(e) => updateProfileLink(link.id, 'url', e.target.value)}
                placeholder="URL"
              />
            </div>
            
            <div className="link-select-row">
              <select
                className="edit-input icon-select"
                value={link.icon.replace('fas ', '')}
                onChange={(e) => updateProfileLink(link.id, 'icon', e.target.value)}
              >
                {icons.map(icon => (
                  <option key={icon} value={icon}>
                    {icon.replace('fa-', '')}
                  </option>
                ))}
              </select>
              
              <select
                className="edit-input class-select"
                value={link.class}
                onChange={(e) => updateProfileLink(link.id, 'class', e.target.value)}
              >
                {linkClasses.map(cls => (
                  <option key={cls.value} value={cls.value}>
                    {cls.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              className="remove-btn" 
              onClick={() => removeProfileLink(link.id)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
        
        <button 
          className="add-link-btn" 
          onClick={addProfileLink}
        >
          <i className="fas fa-plus"></i> Adicionar novo link
        </button>
      </div>
    );
  }
  
  return (
    <div className="links">
      {profileLinks.map(link => (
        <a
          key={link.id}
          href="javascript:void(0);"
          onClick={() => trackClick(link.id, link.url)}
          className={`link-btn ${link.class || ''} track-click`}
          data-link-id={link.id}
          data-url={link.url}
        >
          <i className={`fas ${link.icon.replace('fas ', '')}`}></i>
          <span>{link.title}</span>
          <div className="click-stats">{link.click_count} cliques</div>
          <div className="btn-bg-effect"></div>
        </a>
      ))}
    </div>
  );
};
```

## components/edit/EditButton.jsx - Botão de Edição

```jsx
import { useContext } from 'react';
import { EditContext } from '../../context/EditContext';
import './EditButton.css';

export const EditButton = () => {
  const { isEditMode, enableEditMode, saveChanges, cancelEdit, isDirty } = useContext(EditContext);
  
  // Coletar dados editados para salvar
  const handleSave = () => {
    const editedData = {
      // Coletar dados de todos os campos editáveis
      // Implementar lógica para reunir todos os dados
    };
    
    saveChanges(editedData);
  };
  
  if (isEditMode) {
    return (
      <div className="edit-action-buttons">
        <button 
          className="save-button" 
          title="Salvar alterações" 
          onClick={handleSave}
        >
          <i className="fas fa-check"></i>
        </button>
        <button 
          className="cancel-button" 
          title="Cancelar edição" 
          onClick={cancelEdit}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    );
  }
  
  return (
    <button 
      className="edit-toggle" 
      id="edit-toggle" 
      type="button" 
      onClick={enableEditMode}
    >
      <i className="fas fa-pencil-alt"></i>
    </button>
  );
};
```

## components/themes/ThemeSelector.jsx - Seletor de Tema

```jsx
import { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './ThemeSelector.css';

export const ThemeSelector = () => {
  const { theme, changeTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  
  // Toggle do painel de seleção
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Selecionar tema
  const selectTheme = (newTheme) => {
    changeTheme(newTheme);
    // Fechar o painel depois de um tempo
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };
  
  // Criar opções de tema (1-50)
  const renderThemeOptions = () => {
    const options = [];
    for (let i = 1; i <= 50; i++) {
      options.push(
        <div
          key={i}
          className={`theme-option theme-${i} ${theme === `theme-${i}` ? 'active' : ''}`}
          data-theme={`theme-${i}`}
          title={`Tema ${i}`}
          onClick={() => selectTheme(`theme-${i}`)}
        />
      );
    }
    return options;
  };
  
  return (
    <div className="theme-controls">
      <button 
        className="theme-switcher" 
        id="theme-switcher"
        onClick={togglePanel}
      >
        <i className="fas fa-palette"></i>
      </button>
      
      <div className={`theme-preview-container ${isOpen ? 'active' : ''}`}>
        <h4>Escolha um tema</h4>
        <div className="theme-previews">
          {renderThemeOptions()}
        </div>
      </div>
    </div>
  );
};
```

## components/themes/AnimatedPattern.jsx - Padrões de Fundo Animados

```jsx
import { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './AnimatedPattern.css';

export const AnimatedPattern = () => {
  const { pattern, changePattern } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  
  // Toggle do painel de seleção
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Selecionar padrão animado
  const selectPattern = (newPattern) => {
    changePattern(newPattern);
    // Fechar o painel depois de um tempo
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };
  
  // Lista de padrões disponíveis
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
  
  return (
    <div className="pattern-editor-container">
      <button 
        className="pattern-toggle-btn"
        onClick={togglePanel}
      >
        <i className="fas fa-magic"></i>
      </button>
      
      <div className={`pattern-editor ${isOpen ? 'active' : ''}`}>
        <h3>Padrões Animados</h3>
        <div className="pattern-select-grid">
          {patterns.map(pat => (
            <div
              key={pat.id}
              className={`pattern-option ${pattern === pat.id ? 'active' : ''}`}
              data-pattern={pat.id}
              title={pat.name}
              onClick={() => selectPattern(pat.id)}
            >
              <span>{pat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

## pages/Profile.jsx - Página de Perfil

```jsx
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { EditContext } from '../context/EditContext';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { SocialLinks } from '../components/profile/SocialLinks';
import { ProfileLinks } from '../components/profile/ProfileLinks';
import { EditButton } from '../components/edit/EditButton';
import { ThemeSelector } from '../components/themes/ThemeSelector';
import { AnimatedPattern } from '../components/themes/AnimatedPattern';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const { isEditMode } = useContext(EditContext);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Aqui seria feita a chamada à API para buscar os dados do perfil
        // Por enquanto, usaremos dados de exemplo
        
        // Simular carregamento
        setIsLoading(true);
        
        // Para fins de demonstração, criamos um perfil de exemplo
        const mockProfile = {
          id: 1,
          name: username || 'John Doe',
          username: username || 'johndoe',
          bio: 'Desenvolvedor Full Stack & Designer UI/UX',
          description: 'Apaixonado por criar experiências digitais incríveis e compartilhar conhecimento.',
          profileImage: 'https://via.placeholder.com/200',
          theme: 'theme-2',
          pattern: 'none',
          copyright_text: '© 2025 Todos os direitos reservados',
          copyright_icon: 'fa-copyright',
          socialLinks: [
            { id: 1, platform: 'instagram', url: 'https://instagram.com/', icon: 'fab fa-instagram' },
            { id: 2, platform: 'github', url: 'https://github.com/', icon: 'fab fa-github' },
            { id: 3, platform: 'linkedin', url: 'https://linkedin.com/', icon: 'fab fa-linkedin' }
          ],
          profileLinks: [
            { id: 1, title: 'Meu Website', url: 'https://example.com', icon: 'fa-globe', class: 'website', click_count: 45 },
            { id: 2, title: 'Meu Blog', url: 'https://blog.example.com', icon: 'fa-book', class: '', click_count: 23 },
            { id: 3, title: 'Meus Projetos', url: 'https://github.com/', icon: 'fa-code', class: '', click_count: 12 },
            { id: 4, title: 'Entre em Contato', url: 'mailto:contato@example.com', icon: 'fa-envelope', class: 'contact', click_count: 8 }
          ],
          footerItems: [
            { id: 1, text: 'Termos de Uso', url: '/terms', icon: 'fa-file-alt', is_brand: false },
            { id: 2, text: 'Privacidade', url: '/privacy', icon: 'fa-shield-alt', is_brand: false },
            { id: 3, text: 'LinkStack', url: '/', icon: '', is_brand: true }
          ]
        };
        
        setTimeout(() => {
          setProfile(mockProfile);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        setError('Não foi possível carregar o perfil. Tente novamente mais tarde.');
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [username]);
  
  // Handler para atualizar o perfil
  const handleProfileUpdate = (field, value) => {
    if (!profile) return;
    
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handler para atualizar links sociais
  const handleSocialLinksUpdate = (newLinks) => {
    handleProfileUpdate('socialLinks', newLinks);
  };
  
  // Handler para atualizar links do perfil
  const handleProfileLinksUpdate = (newLinks) => {
    handleProfileUpdate('profileLinks', newLinks);
  };
  
  // Handler para atualizar itens do footer
  const handleFooterItemsUpdate = (newItems) => {
    handleProfileUpdate('footerItems', newItems);
  };
  
  if (isLoading) {
    return <div className="profile-loading">Carregando perfil...</div>;
  }
  
  if (error) {
    return <div className="profile-error">{error}</div>;
  }
  
  if (!profile) {
    return <div className="profile-not-found">Perfil não encontrado.</div>;
  }
  
  return (
    <div className={`profile-container ${isEditMode ? 'edit-mode' : ''}`}>
      <div className="container">
        <ProfileHeader 
          profile={profile} 
          onUpdate={(updatedProfile) => setProfile(updatedProfile)} 
        />
        
        <SocialLinks 
          socialLinks={profile.socialLinks} 
          onUpdate={handleSocialLinksUpdate} 
        />
        
        <ProfileLinks 
          profileLinks={profile.profileLinks} 
          onUpdate={handleProfileLinksUpdate} 
        />
        
        {/* Área do Footer */}
        <div className="footer">
          {/* Implementar um componente Footer aqui... */}
          {profile.footerItems.map(item => (
            <p key={item.id} className="footer-item">
              {item.icon && <i className={`fas ${item.icon}`}></i>}
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={item.is_brand ? 'brand-link' : ''}
                >
                  {item.text}
                </a>
              ) : (
                item.text
              )}
            </p>
          ))}
          
          <p className="footer-copyright">
            <i className={`fas ${profile.copyright_icon}`}></i>
            {profile.copyright_text}
          </p>
        </div>
      </div>
      
      {/* Botões de controle */}
      <EditButton />
      <ThemeSelector />
      <AnimatedPattern />
    </div>
  );
};

export default Profile;
```

## hooks/useTheme.js - Hook para Gerenciar Temas

```js
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  
  return context;
};
```

## hooks/useClickTracking.js - Hook para Rastrear Cliques

```js
import { useState } from 'react';

export const useClickTracking = () => {
  const [clickStats, setClickStats] = useState({});
  
  // Registrar um clique
  const trackClick = async (linkId, url) => {
    try {
      // Fazer requisição para a API
      const response = await fetch(`/api/click-link/${linkId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Atualizar estatísticas locais
        setClickStats(prev => ({
          ...prev,
          [linkId]: data.click_count
        }));
        
        // Abrir URL após um pequeno atraso
        setTimeout(() => {
          window.open(url, '_blank');
        }, 300);
        
        return data.click_count;
      } else {
        console.error('Erro ao registrar clique:', data.message);
        window.open(url, '_blank');
        return null;
      }
    } catch (error) {
      console.error('Erro ao registrar clique:', error);
      window.open(url, '_blank');
      return null;
    }
  };
  
  // Obter contagem de cliques
  const getClickCount = (linkId) => {
    return clickStats[linkId] || 0;
  };
  
  return { trackClick, getClickCount, clickStats };
};
```