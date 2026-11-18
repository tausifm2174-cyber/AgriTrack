import { useState, useEffect, useMemo, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { adaptNotification } from '../utils/adapters';
import { useAuth } from './useAuth';
import { NotificationContext } from './NotificationContextObject';

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getNotifications({ size: 100 });
      const rawList = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : [];
      const adapted = rawList.map(adaptNotification).filter(Boolean);
      setNotifications(adapted);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let isMounted = true;
    if (!isAuthenticated) {
      Promise.resolve().then(() => {
        if (isMounted) {
          setNotifications([]);
          setError(null);
        }
      });
      return () => {
        isMounted = false;
      };
    }

    Promise.resolve().then(async () => {
      if (!isMounted) return;
      await fetchNotifications();
    });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, fetchNotifications]);

  const summary = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.isRead).length;
    const read = total - unread;
    const warnings = notifications.filter((n) => n.severity === 'WARNING').length;
    const critical = notifications.filter((n) => n.severity === 'CRITICAL').length;
    const info = notifications.filter((n) => n.severity === 'INFO').length;
    const success = notifications.filter((n) => n.severity === 'SUCCESS').length;

    return {
      total,
      unread,
      read,
      warnings,
      critical,
      info,
      success,
    };
  }, [notifications]);

  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
    try {
      await notificationService.markAsRead(id);
    } catch {
      // Keep optimistic update, silent catch
    }
  }, []);

  const markAsUnread = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: false } : item))
    );
    try {
      await notificationService.markAsUnread(id);
    } catch {
      // Keep optimistic update, silent catch
    }
  }, []);

  const toggleReadStatus = useCallback((id) => {
    setNotifications((prev) => {
      const item = prev.find((n) => n.id === id);
      if (!item) return prev;
      const willBeRead = !item.isRead;
      if (willBeRead) {
        notificationService.markAsRead(id).catch(() => {});
      } else {
        notificationService.markAsUnread(id).catch(() => {});
      }
      return prev.map((n) => (n.id === id ? { ...n, isRead: willBeRead } : n));
    });
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isRead: true }))
    );
    try {
      await notificationService.markAllAsRead();
    } catch {
      // Keep optimistic update
    }
  }, []);

  const dismissNotification = useCallback(async (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    try {
      await notificationService.deleteNotification(id);
    } catch {
      // Keep optimistic update
    }
  }, []);

  const clearAllNotifications = useCallback(async () => {
    setNotifications([]);
    try {
      await notificationService.clearAllNotifications();
    } catch {
      // Keep optimistic update
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: summary.unread,
      summary,
      loading,
      error,
      refresh,
      markAsRead,
      markAsUnread,
      toggleReadStatus,
      markAllAsRead,
      dismissNotification,
      clearAllNotifications,
      resetToDefault: refresh,
    }),
    [
      notifications,
      summary,
      loading,
      error,
      refresh,
      markAsRead,
      markAsUnread,
      toggleReadStatus,
      markAllAsRead,
      dismissNotification,
      clearAllNotifications,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
