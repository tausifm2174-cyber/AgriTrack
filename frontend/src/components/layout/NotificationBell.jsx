import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationTypeIcon from '../notifications/NotificationTypeIcon';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  const handleItemClick = (item) => {
    markAsRead(item.id);
    setIsOpen(false);
    if (item.relatedRoute) {
      navigate(item.relatedRoute);
    } else {
      navigate('/notifications');
    }
  };

  // Show top 4 most recent notifications in the dropdown
  const recentNotifications = notifications.slice(0, 4);

  return (
    <div className="agri-nav-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="agri-icon-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell size={19} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="agri-bell-badge" aria-hidden="true">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="agri-dropdown-menu agri-notifications-dropdown" role="menu">
          <div className="agri-dropdown-header">
            <div className="agri-dropdown-title-group">
              <span className="agri-dropdown-title">Notifications</span>
              {unreadCount > 0 && (
                <span className="agri-badge agri-badge--info" style={{ fontSize: '0.7rem' }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                className="agri-btn--link"
                onClick={handleMarkAllRead}
                title="Mark all as read"
              >
                <CheckCheck size={14} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="agri-notifications-list">
            {recentNotifications.length === 0 ? (
              <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.8125rem' }}>
                No notifications right now
              </div>
            ) : (
              recentNotifications.map((item) => {
                const typeClass = item.type ? item.type.toLowerCase() : 'system';
                return (
                  <div
                    key={item.id}
                    className={`agri-notification-item ${!item.isRead ? 'agri-notification-item--unread' : ''}`}
                    onClick={() => handleItemClick(item)}
                    role="menuitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleItemClick(item);
                      }
                    }}
                  >
                    <div className={`agri-notification-icon agri-notification-icon--${typeClass}`}>
                      <NotificationTypeIcon type={item.type} size={15} />
                    </div>
                    <div className="agri-notification-content">
                      <p className="agri-notification-title">{item.title}</p>
                      <p className="agri-notification-desc">{item.message}</p>
                      <span className="agri-notification-time">{item.timestamp}</span>
                    </div>
                    {!item.isRead && (
                      <span className="agri-notification-dot" aria-label="Unread" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="agri-dropdown-footer">
            <button
              type="button"
              className="agri-dropdown-action-btn"
              onClick={handleViewAll}
            >
              View all notifications ({notifications.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
