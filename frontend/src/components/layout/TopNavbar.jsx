import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, ChevronDown, User, Bell, LogOut } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import NotificationBell from './NotificationBell';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../../context/useAuth';

/**
 * TopNavbar component
 * Displays live authenticated user details and handles logout via AuthContext.
 * @param {Object} props
 * @param {Function} props.onOpenMobileSidebar
 */
export default function TopNavbar({ onOpenMobileSidebar }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Dynamic user display properties
  const displayName = user?.fullName || 'Farmer';
  const displayEmail = user?.email || '';
  const displayRole = user?.role === 'FARMER' ? t('topbar.role', 'Farmer') : (user?.role || t('topbar.role', 'Farmer'));
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AG';

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  const handleNavigate = (path) => {
    setUserDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="agri-topbar">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="agri-topbar__left">
        <button
          type="button"
          className="agri-topbar__mobile-toggle"
          onClick={onOpenMobileSidebar}
          aria-label={t('common.navigationMenu', 'Open navigation menu')}
        >
          <Menu size={20} />
        </button>

        <div className="agri-topbar__context">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right: Language Selector, Notifications & User Profile */}
      <div className="agri-topbar__right">
        <LanguageSelector />

        <NotificationBell />

        <div className="agri-topbar__divider" aria-hidden="true" />

        {/* User Profile Dropdown Trigger */}
        <div className="agri-nav-dropdown-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className="agri-user-profile-btn"
            onClick={() => setUserDropdownOpen((prev) => !prev)}
            aria-expanded={userDropdownOpen}
            aria-haspopup="true"
            aria-label={t('topbar.profileSettings', 'User profile options')}
          >
            <div className="agri-user-avatar">
              <span>{initials}</span>
            </div>
            <div className="agri-user-info">
              <span className="agri-user-name">{displayName}</span>
              <span className="agri-user-role">{displayRole}</span>
            </div>
            <ChevronDown size={15} className="agri-user-chevron" aria-hidden="true" />
          </button>

          {/* User Profile Dropdown Menu */}
          {userDropdownOpen && (
            <div className="agri-dropdown-menu agri-user-dropdown" role="menu">
              <div className="agri-dropdown-header agri-user-dropdown-header">
                <div className="agri-user-avatar agri-user-avatar--lg">
                  <span>{initials}</span>
                </div>
                <div>
                  <p className="agri-user-dropdown-name">{displayName}</p>
                  <p className="agri-user-dropdown-email">{displayEmail}</p>
                  <span className="agri-badge agri-badge--success" style={{ marginTop: '0.25rem' }}>
                    {displayRole}
                  </span>
                </div>
              </div>

              <div className="agri-dropdown-body">
                <button
                  type="button"
                  className="agri-dropdown-item"
                  onClick={() => handleNavigate('/profile')}
                  role="menuitem"
                >
                  <User size={16} className="agri-dropdown-item__icon" />
                  <span>{t('topbar.profileSettings', 'Farmer Profile & Settings')}</span>
                </button>

                <button
                  type="button"
                  className="agri-dropdown-item"
                  onClick={() => handleNavigate('/notifications')}
                  role="menuitem"
                >
                  <Bell size={16} className="agri-dropdown-item__icon" />
                  <span>{t('topbar.notificationCenter', 'Notification Center')}</span>
                </button>
              </div>

              <div className="agri-dropdown-footer">
                <button
                  type="button"
                  className="agri-dropdown-item agri-dropdown-item--danger"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  <LogOut size={16} className="agri-dropdown-item__icon" />
                  <span>{t('topbar.logout', 'Sign Out')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
