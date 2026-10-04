import { useState, useMemo, useCallback } from 'react';
import { initialNotificationData, getNotificationSummary } from '../data/notificationData';
import { NotificationContext } from './NotificationContextObject';

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotificationData);

  const summary = useMemo(() => getNotificationSummary(notifications), [notifications]);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  }, []);

  const markAsUnread = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: false } : item))
    );
  }, []);

  const toggleReadStatus = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: !item.isRead } : item))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isRead: true }))
    );
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const resetToDefault = useCallback(() => {
    setNotifications(initialNotificationData);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: summary.unread,
      summary,
      markAsRead,
      markAsUnread,
      toggleReadStatus,
      markAllAsRead,
      dismissNotification,
      clearAllNotifications,
      resetToDefault,
    }),
    [
      notifications,
      summary,
      markAsRead,
      markAsUnread,
      toggleReadStatus,
      markAllAsRead,
      dismissNotification,
      clearAllNotifications,
      resetToDefault,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
