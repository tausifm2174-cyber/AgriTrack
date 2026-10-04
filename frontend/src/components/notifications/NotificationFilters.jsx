import { Search, RotateCcw, Filter } from 'lucide-react';
import Button from '../common/Button';

/**
 * NotificationFilters Component
 * Provides search, type, status, and severity dropdown filters.
 * @param {Object} props
 * @param {string} props.searchQuery
 * @param {Function} props.onSearchChange
 * @param {string} props.typeFilter
 * @param {Function} props.onTypeChange
 * @param {string} props.statusFilter
 * @param {Function} props.onStatusChange
 * @param {string} props.severityFilter
 * @param {Function} props.onSeverityChange
 * @param {Function} props.onClearFilters
 * @param {number} props.filteredCount
 * @param {number} props.totalCount
 */
export default function NotificationFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  severityFilter,
  onSeverityChange,
  onClearFilters,
  filteredCount,
  totalCount,
}) {
  const isFiltered =
    Boolean(searchQuery) ||
    typeFilter !== 'all' ||
    statusFilter !== 'all' ||
    severityFilter !== 'all';

  return (
    <div className="agri-notif-filter-toolbar">
      <div className="agri-notif-filter-row-top">
        {/* Search */}
        <div className="agri-notif-search-box">
          <Search size={16} className="agri-notif-search-icon" aria-hidden="true" />
          <input
            type="search"
            className="agri-notif-search-input"
            placeholder="Search by title, farm, field, crop or message..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search notifications"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="agri-notif-select-group">
          {/* Type Filter */}
          <select
            className="agri-notif-select"
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            aria-label="Filter by notification type"
          >
            <option value="all">All Types</option>
            <option value="WEATHER">Weather</option>
            <option value="IRRIGATION">Irrigation</option>
            <option value="CROP">Crop</option>
            <option value="HARVEST">Harvest</option>
            <option value="SALES">Sales</option>
            <option value="PAYMENT">Payment</option>
            <option value="ADVISORY">Advisory</option>
            <option value="SYSTEM">System</option>
          </select>

          {/* Status Filter */}
          <select
            className="agri-notif-select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by read status"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>

          {/* Severity Filter */}
          <select
            className="agri-notif-select"
            value={severityFilter}
            onChange={(e) => onSeverityChange(e.target.value)}
            aria-label="Filter by severity level"
          >
            <option value="all">All Severities</option>
            <option value="INFO">Info</option>
            <option value="SUCCESS">Success</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>

          {/* Reset Filters button */}
          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw size={14} />}
              onClick={onClearFilters}
              title="Reset all filters"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Filter Status Bar */}
      <div className="agri-notif-filter-status-row">
        <div>
          <span>
            Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> notifications
          </span>
          {isFiltered && (
            <span style={{ marginLeft: '0.5rem' }}>
              <span className="agri-notif-active-filter-badge">
                <Filter size={11} aria-hidden="true" />
                Filters Active
              </span>
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            className="agri-btn--link"
            onClick={onClearFilters}
            style={{ fontSize: '0.8rem', color: 'var(--primary-600)' }}
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
