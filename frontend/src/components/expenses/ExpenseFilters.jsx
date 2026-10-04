import { Search, LayoutGrid, Table, X } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../../data/expenseData';

export default function ExpenseFilters({
  searchQuery,
  onSearchChange,
  selectedFarm,
  onFarmChange,
  selectedField,
  onFieldChange,
  selectedCrop,
  onCropChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  farmList = [],
  fieldList = [],
  cropList = [],
}) {
  const isFiltered =
    Boolean(searchQuery) ||
    selectedFarm !== 'ALL' ||
    selectedField !== 'ALL' ||
    selectedCrop !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedStatus !== 'ALL';

  return (
    <div className="agri-expense-filters">
      <div className="agri-expense-filters__row">
        {/* Search */}
        <div className="agri-expense-filters__search">
          <Search size={16} className="agri-expense-filters__search-icon" />
          <input
            type="text"
            className="agri-expense-filters__search-input"
            placeholder="Search expense ID, vendor, description, farm..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search expenses"
          />
        </div>

        {/* Farm */}
        <select
          className="agri-expense-filters__select"
          value={selectedFarm}
          onChange={(e) => onFarmChange(e.target.value)}
          aria-label="Filter by farm"
        >
          <option value="ALL">All Farms</option>
          {farmList.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Field */}
        <select
          className="agri-expense-filters__select"
          value={selectedField}
          onChange={(e) => onFieldChange(e.target.value)}
          aria-label="Filter by field"
        >
          <option value="ALL">All Fields</option>
          {fieldList.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Crop */}
        <select
          className="agri-expense-filters__select"
          value={selectedCrop}
          onChange={(e) => onCropChange(e.target.value)}
          aria-label="Filter by crop"
        >
          <option value="ALL">All Crops</option>
          {cropList.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          className="agri-expense-filters__select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="ALL">All Categories</option>
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          className="agri-expense-filters__select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by payment status"
        >
          <option value="ALL">All Statuses</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
        </select>

        {/* Reset */}
        {isFiltered && (
          <button
            type="button"
            className="agri-btn agri-btn--outline agri-btn--sm"
            onClick={onResetFilters}
            aria-label="Reset all filters"
          >
            <X size={14} />
            <span>Reset</span>
          </button>
        )}

        {/* View Mode Toggle */}
        <div className="agri-expense-filters__view-toggles" role="group" aria-label="View toggle">
          <button
            type="button"
            className={`agri-expense-filters__view-btn ${
              viewMode === 'table' ? 'agri-expense-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('table')}
            title="Table View"
            aria-label="Table View"
          >
            <Table size={16} />
          </button>
          <button
            type="button"
            className={`agri-expense-filters__view-btn ${
              viewMode === 'cards' ? 'agri-expense-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('cards')}
            title="Card View"
            aria-label="Card View"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
