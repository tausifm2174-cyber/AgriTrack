import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, User, Bell, LogOut, CheckCircle } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import NotificationBell from './NotificationBell';

/**
 * TopNavbar component
 * @param {Object} props
 * @param {Function} props.onOpenMobileSidebar
 */
export default function TopNavbar({ onOpenMobileSidebar }) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
    setLogoutMessage(true);
    setTimeout(() => {
      setLogoutMessage(false);
      setUserDropdownOpen(false);
    }, 2000);
  };

  return (
    <header className="agri-topbar">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="agri-topbar__left">
        <button
          type="button"
          className="agri-topbar__mobile-toggle"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="agri-topbar__context">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right: Actions, Notifications & User Profile */}
      <div className="agri-topbar__right">
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
            aria-label="User profile options"
          >
            <div className="agri-user-avatar">
              <span>XYZ</span>
            </div>
            <div className="agri-user-info">
              <span className="agri-user-name">XYZ</span>
              <span className="agri-user-role">Farmer</span>
            </div>
            <ChevronDown size={15} className="agri-user-chevron" aria-hidden="true" />
          </button>

          {/* User Profile Dropdown Menu */}
          {userDropdownOpen && (
            <div className="agri-dropdown-menu agri-user-dropdown" role="menu">
              <div className="agri-dropdown-header agri-user-dropdown-header">
                <div className="agri-user-avatar agri-user-avatar--lg">
                  <span>XYZ</span>
                </div>
                <div>
                  <p className="agri-user-dropdown-name">XYZ</p>
                  <p className="agri-user-dropdown-email">xyz.farmer@agritrack.in</p>
                  <span className="agri-badge agri-badge--success" style={{ marginTop: '0.25rem' }}>
                    Farmer
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
                  <span>Farmer Profile & Settings</span>
                </button>

                <button
                  type="button"
                  className="agri-dropdown-item"
                  onClick={() => handleNavigate('/notifications')}
                  role="menuitem"
                >
                  <Bell size={16} className="agri-dropdown-item__icon" />
                  <span>Notification Center</span>
                </button>
              </div>

              <div className="agri-dropdown-footer">
                {logoutMessage ? (
                  <div className="agri-demo-logout-alert">
                    <CheckCircle size={14} className="text-success" />
                    <span>Demo session. Auth backend planned in next phase.</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="agri-dropdown-item agri-dropdown-item--danger"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <LogOut size={16} className="agri-dropdown-item__icon" />
                    <span>Logout (Demo)</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
