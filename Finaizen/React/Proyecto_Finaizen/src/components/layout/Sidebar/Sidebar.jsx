import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ModalSuscripcion from '../../ModalSuscripcion/ModalSuscripcion';
import styles from './Sidebar.module.css';

/**
 * Sidebar - Menú lateral reutilizable para User, Admin y Config
 * @param {Array} menuItems - Array de objetos con { label, path }
 * @param {Array} userMenuItems - Array de opciones del menú de usuario
 * @param {string} variant - Tipo de sidebar: 'user' | 'admin' | 'config'
 * @param {function} onCollapsedChange - Callback cuando cambia el estado colapsado
 */
function Sidebar({ menuItems, userMenuItems = [], variant = 'user', onCollapsedChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showPerfilesDropdown, setShowPerfilesDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showModalSuscripcion, setShowModalSuscripcion] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, currentPerfil, perfiles, cambiarPerfil, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    // Cerrar ambos dropdowns cuando se colapsa
    if (newState) {
      setShowUserDropdown(false);
      setShowPerfilesDropdown(false);
    }
    if (onCollapsedChange) {
      onCollapsedChange(newState);
    }
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    // Al abrir en móvil, siempre expandir el sidebar
    if (newState && window.innerWidth <= 768) {
      setIsCollapsed(false);
    }
  };

  const handleUserClick = () => {
    // Solo permitir click en el perfil si no está colapsado
    if (!isCollapsed) {
      setShowUserDropdown(!showUserDropdown);
      // Cerrar dropdown de perfiles si está abierto
      if (showPerfilesDropdown) {
        setShowPerfilesDropdown(false);
      }
    }
  };

  const handlePerfilesClick = () => {
    // Solo permitir click si no está colapsado
    if (!isCollapsed) {
      setShowPerfilesDropdown(!showPerfilesDropdown);
      // Cerrar dropdown de usuario si está abierto
      if (showUserDropdown) {
        setShowUserDropdown(false);
      }
    }
  };

  const handleSwitchPerfil = (perfilId) => {
    cambiarPerfil(perfilId);
    setShowPerfilesDropdown(false);
  };

  return (
    <>
      {/* Botón de menú móvil - solo visible cuando el menú está cerrado */}
      {!isMobileMenuOpen && (
        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          ☰
        </button>
      )}

      <div className={`${styles.sidebarContainer} ${isCollapsed ? styles.collapsed : ''} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
        <aside className={`${styles.sidebar} ${styles[variant]}`}>
          {/* Header del Sidebar */}
          <div className={styles.sidebarHeader}>
            {!isCollapsed && <h2>Menú</h2>}
            <button 
              className={styles.toggleBtn}
              onClick={toggleCollapse}
              title={isCollapsed ? 'Expandir' : 'Contraer'}
            >
              ☰
            </button>
            
            {/* Botón de cerrar en móvil */}
            <button 
              className={styles.mobileCloseBtn}
              onClick={() => setIsMobileMenuOpen(false)}
              title="Cerrar menú"
            >
              ←
            </button>
          </div>

          {/* Menú de navegación */}
          <nav className={styles.sidebarNav}>
            <ul>
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={isActive ? styles.active : ''}
                      onClick={() => setIsMobileMenuOpen(false)}
                      title={isCollapsed ? item.label : ''}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer del Sidebar - User Menu */}
          {variant !== 'config' && (
            <div className={styles.sidebarFooter}>
              {/* Selector de Perfiles */}
              <div 
                className={`${styles.perfiles} ${isCollapsed ? styles.disabled : ''}`}
                onClick={handlePerfilesClick}
              >
                <span className={styles.perfilIcon}>💼</span>
                {!isCollapsed && (
                  <div className={styles.perfilInfo}>
                    <p className={styles.perfilLabel}>Perfil</p>
                    <p className={styles.perfilName}>{currentPerfil?.nombre || 'Sin perfil'}</p>
                  </div>
                )}
              </div>

              {/* Dropdown de Perfiles */}
              {showPerfilesDropdown && !isCollapsed && perfiles.length > 0 && (
                <div className={`${styles.perfilesDropdown} ${styles.active}`}>
                  <div className={styles.dropdownHeader}>
                    <span className={styles.dropdownTitle}>Cambiar perfil</span>
                  </div>
                  <ul className={styles.perfilesList}>
                    {perfiles.map((perfil) => (
                      <li 
                        key={perfil.id}
                        className={perfil.id === currentPerfil?.id ? styles.activePerfil : ''}
                        onClick={() => handleSwitchPerfil(perfil.id)}
                      >
                        <span className={styles.perfilIcon}>💼</span>
                        <div className={styles.perfilDetails}>
                          <span className={styles.perfilNombre}>{perfil.nombre}</span>
                          <span className={styles.perfilMoneda}>{perfil.moneda}</span>
                        </div>
                        {perfil.id === currentPerfil?.id && (
                          <span className={styles.checkmark}>✓</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Usuario */}
              <div 
                className={`${styles.user} ${isCollapsed ? styles.disabled : ''}`}
                onClick={handleUserClick}
              >
                <img
                  src={currentPerfil?.foto || 'https://placehold.co/40x40/6c757d/ffffff?text=U'}
                  alt="Usuario"
                />
                {!isCollapsed && <p>{currentUser?.nombreCompleto || 'Usuario'}</p>}
              </div>

              {/* User Dropdown Menu - Solo mostrar si NO está colapsado */}
              {showUserDropdown && !isCollapsed && (
                <div className={`${styles.userDropdown} ${styles.active}`}>
                  <div className={styles.dropdownHeader}>
                    <img
                      src={currentPerfil?.foto || 'https://placehold.co/50x50/6c757d/ffffff?text=U'}
                      alt="Usuario"
                    />
                    <div className={styles.userInfo}>
                      <p className={styles.userName}>{currentUser?.nombreCompleto}</p>
                      <p className={styles.userEmail}>{currentUser?.email}</p>
                    </div>
                  </div>

                  <ul className={styles.dropdownMenu}>
                    {userMenuItems.map((item, index) => (
                      <li key={index}>
                        {item.divider ? (
                          <div className={styles.divider}></div>
                        ) : (
                          <Link to={item.path} onClick={() => setShowUserDropdown(false)}>
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.text}>{item.label}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                    
                    <li><div className={styles.divider}></div></li>
                    
                    {/* Opción Premium */}
                    <li>
                      <button 
                        onClick={() => {
                          if (currentUser?.isPremium) {
                            navigate('/user/config/cuenta');
                          } else {
                            setShowModalSuscripcion(true);
                          }
                          setShowUserDropdown(false);
                        }}
                        className={currentUser?.isPremium ? styles.premiumActiveLink : styles.premiumLink}
                      >
                        <span className={styles.icon}>
                          {currentUser?.isPremium ? '👑' : '⭐'}
                        </span>
                        <span className={styles.text}>
                          {currentUser?.isPremium ? 'Gestionar Premium' : 'Hazte Premium'}
                        </span>
                      </button>
                    </li>
                    
                    <li><div className={styles.divider}></div></li>
                    
                    <li>
                      <button 
                        onClick={handleLogout}
                        className={styles.logoutLink}
                      >
                        <span className={styles.icon}>🚪</span>
                        <span className={styles.text}>Cerrar sesión</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Modal de Suscripción Premium */}
      <ModalSuscripcion 
        isOpen={showModalSuscripcion}
        onClose={() => setShowModalSuscripcion(false)}
        currentUser={currentUser}
        onSuccess={() => {
          setShowModalSuscripcion(false);
          // AuthContext se actualizará automáticamente al recargar
        }}
      />
    </>
  );
}

export default Sidebar;

