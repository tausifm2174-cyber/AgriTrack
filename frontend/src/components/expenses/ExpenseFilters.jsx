import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
            placeholder={t('common.searchPlaceholder', 'Search expense ID, vendor, description, farm...')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={t('common.search', 'Search expenses')}
          />
        </div>

        {/* Farm */}
        <select
          className="agri-expense-filters__select"
          value={selectedFarm}
          onChange={(e) => onFarmChange(e.target.value)}
          aria-label={t('fields.farm', 'Filter by farm')}
        >
          <option value="ALL">{t('common.allFarms', 'All Farms')}</option>
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
          aria-label={t('activities.field', 'Filter by field')}
        >
          <option value="ALL">{t('common.allFields', 'All Fields')}</option>
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
          aria-label={t('activities.crop', 'Filter by crop')}
        >
          <option value="ALL">{t('common.allCrops', 'All Crops')}</option>
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
          aria-label={t('expenses.category', 'Filter by category')}
        >
          <option value="ALL">{t('expenses.allCategories', 'All Categories')}</option>
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
          aria-label={t('common.status', 'Filter by payment status')}
        >
          <option value="ALL">{t('common.allStatuses', 'All Statuses')}</option>
          <option value="PAID">{t('status.paid', 'Paid')}</option>
          <option value="PENDING">{t('status.pending', 'Pending')}</option>
        </select>

        {/* Reset */}
        {isFiltered && (
          <button
            type="button"
            className="agri-btn agri-btn--outline agri-btn--sm"
            onClick={onResetFilters}
            aria-label={t('common.clearFilters', 'Reset all filters')}
          >
            <X size={14} />
            <span>{t('common.clear', 'Reset')}</span>
          </button>
        )}

        {/* View Mode Toggle */}
        <div className="agri-expense-filters__view-toggles" role="group" aria-label={t('common.view', 'View toggle')}>
          <button
            type="button"
            className={`agri-expense-filters__view-btn ${
              viewMode === 'table' ? 'agri-expense-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('table')}
            title={t('common.table', 'Table View')}
            aria-label={t('common.table', 'Table View')}
          >
            <Table size={16} />
          </button>
          <button
            type="button"
            className={`agri-expense-filters__view-btn ${
              viewMode === 'cards' ? 'agri-expense-filters__view-btn--active' : ''
            }`}
            onClick={() => onViewModeChange('cards')}
            title={t('common.grid', 'Card View')}
            aria-label={t('common.grid', 'Card View')}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
