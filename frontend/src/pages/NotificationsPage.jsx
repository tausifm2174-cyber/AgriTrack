import { useState, useMemo } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import {
  NotificationHeader,
  NotificationSummaryCards,
  NotificationFilters,
  NotificationList,
  NotificationEmptyState,
  NotificationDetailsModal,
} from '../components/notifications';

/**
 * NotificationsPage Component
 * Full-featured Notification Center for AgriTrack (Phase 9)
 */
export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    summary,
    markAsRead,
    toggleReadStatus,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications,
    resetToDefault,
  } = useNotifications();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Modal State
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  // Derived filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Search matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesMsg = item.message?.toLowerCase().includes(query);
        const matchesFarm = item.farmName?.toLowerCase().includes(query);
        const matchesField = item.fieldName?.toLowerCase().includes(query);
        const matchesCrop = item.cropName?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesMsg && !matchesFarm && !matchesField && !matchesCrop) {
          return false;
        }
      }

      // Type matching
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }

      // Status matching
      if (statusFilter === 'unread' && item.isRead) {
        return false;
      }
      if (statusFilter === 'read' && !item.isRead) {
        return false;
      }

      // Severity matching
      if (severityFilter !== 'all' && item.severity !== severityFilter) {
        return false;
      }

      return true;
    });
  }, [notifications, searchQuery, typeFilter, statusFilter, severityFilter]);

  // Currently selected notification item from live state
  const selectedItem = useMemo(() => {
    if (!selectedNotificationId) return null;
    return notifications.find((n) => n.id === selectedNotificationId) || null;
  }, [notifications, selectedNotificationId]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setStatusFilter('all');
    setSeverityFilter('all');
  };

  const handleSelectKpiFilter = ({ status, severity }) => {
    if (status !== undefined) setStatusFilter(status);
    if (severity !== undefined) setSeverityFilter(severity);
  };

  const handleItemSelect = (item) => {
    // When opened in modal, also automatically mark as read
    markAsRead(item.id);
    setSelectedNotificationId(item.id);
  };

  const handleConfirmClearAll = () => {
    clearAllNotifications();
    setConfirmClearOpen(false);
  };

  const isFiltered =
    Boolean(searchQuery) ||
    typeFilter !== 'all' ||
    statusFilter !== 'all' ||
    severityFilter !== 'all';

  return (
    <div className="agri-notifications-page">
      {/* Header */}
      <NotificationHeader
        unreadCount={unreadCount}
        totalCount={notifications.length}
        onMarkAllAsRead={markAllAsRead}
        onClearAll={() => setConfirmClearOpen(true)}
        onReset={() => {
          resetToDefault();
          handleClearFilters();
        }}
      />

      {/* Summary KPI Cards */}
      <NotificationSummaryCards
        summary={summary}
        activeStatusFilter={statusFilter}
        activeSeverityFilter={severityFilter}
        onSelectFilter={handleSelectKpiFilter}
      />

      {/* Filters Toolbar */}
      <NotificationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
        onClearFilters={handleClearFilters}
        filteredCount={filteredNotifications.length}
        totalCount={notifications.length}
      />

      {/* Notification List or Empty State */}
      {filteredNotifications.length === 0 ? (
        <NotificationEmptyState
          isFiltered={isFiltered}
          onReset={isFiltered ? handleClearFilters : resetToDefault}
        />
      ) : (
        <NotificationList
          notifications={filteredNotifications}
          onSelect={handleItemSelect}
          onToggleRead={toggleReadStatus}
          onDismiss={dismissNotification}
        />
      )}

      {/* Notification Details Modal */}
      {selectedItem && (
        <NotificationDetailsModal
          item={selectedItem}
          onClose={() => setSelectedNotificationId(null)}
          onToggleRead={toggleReadStatus}
        />
      )}

      {/* Clear All Confirmation Modal */}
      {confirmClearOpen && (
        <div
          className="agri-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmClearOpen(false)}
        >
          <div className="agri-modal-dialog" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="agri-modal-header">
              <h3 className="agri-modal-title">Clear All Notifications?</h3>
            </div>
            <div className="agri-modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                Are you sure you want to clear all {notifications.length} notifications from this session?
                You can restore the demo notification dataset at any time using the &quot;Reset Demo&quot; button.
              </p>
            </div>
            <div className="agri-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                className="agri-btn agri-btn--ghost agri-btn--sm"
                onClick={() => setConfirmClearOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="agri-btn agri-btn--danger agri-btn--sm"
                onClick={handleConfirmClearAll}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
