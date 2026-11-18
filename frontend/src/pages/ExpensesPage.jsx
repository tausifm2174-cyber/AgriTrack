import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { EmptyState, Button } from '../components/common';
import { formatCurrency } from '../utils/formatters';
import {
  ExpenseHeader,
  ExpenseSummaryCards,
  ExpenseFilters,
  ExpenseTable,
  ExpenseCard,
  ExpenseDetailsModal,
  AddExpenseModal,
  ExpenseCategoryChart,
} from '../components/expenses';
import expenseService from '../services/expenseService';
import farmService from '../services/farmService';
import fieldService from '../services/fieldService';
import cropService from '../services/cropService';
import {
  adaptExpense,
  adaptExpenseSummary,
  adaptFarm,
  adaptField,
  adaptCropCycle,
} from '../utils/adapters';
import '../components/expenses/expenses.css';

export default function ExpensesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL Query parameters
  const queryFarmId = searchParams.get('farmId') || 'ALL';
  const queryCrop = searchParams.get('crop') || 'ALL';
  const queryCategory = searchParams.get('category') || 'ALL';
  const queryId = searchParams.get('id');

  // Core Data State
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [cropCycles, setCropCycles] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarm, setSelectedFarm] = useState(queryFarmId);
  const [selectedField, setSelectedField] = useState('ALL');
  const [selectedCrop, setSelectedCrop] = useState(queryCrop);
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');

  // Modals & Action State
  const [activeExpenseDetails, setActiveExpenseDetails] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch all live data from backend
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Fetch auxiliary reference entities in parallel
        const [rawFarms, rawFields, rawCrops] = await Promise.all([
          farmService.getAllFarms(),
          fieldService.getAllFields(),
          cropService.getAllCropCycles(),
        ]);

        if (!isMounted) return;

        const adaptedCrops = Array.isArray(rawCrops) ? rawCrops.map((c) => adaptCropCycle(c)) : [];
        setCropCycles(adaptedCrops);

        const adaptedFarms = Array.isArray(rawFarms) ? rawFarms.map((f) => adaptFarm(f, rawFields)) : [];
        setFarms(adaptedFarms);

        const allFields = Array.isArray(rawFields) ? rawFields.map((fld) => adaptField(fld, adaptedCrops)) : [];
        setFields(allFields);

        // 3. Fetch expenses & summary
        const params = {};
        if (selectedFarm !== 'ALL') params.farmId = selectedFarm;
        if (selectedField !== 'ALL') params.fieldId = selectedField;
        if (selectedCategory !== 'ALL') params.category = selectedCategory;
        if (selectedStatus !== 'ALL') params.paymentStatus = selectedStatus;

        const summaryParams = {};
        if (selectedFarm !== 'ALL') summaryParams.farmId = selectedFarm;

        const [rawExpenses, rawSummary] = await Promise.all([
          expenseService.getAllExpenses(params),
          expenseService.getExpenseSummary(summaryParams),
        ]);

        if (!isMounted) return;

        const adaptedExpenses = Array.isArray(rawExpenses) ? rawExpenses.map(adaptExpense) : [];
        setExpenses(adaptedExpenses);
        setSummary(adaptExpenseSummary(rawSummary));

        // Handle direct link to expense ID if queryId is set
        if (queryId) {
          const found = adaptedExpenses.find((e) => String(e.id) === String(queryId));
          if (found) {
            setActiveExpenseDetails(found);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || 'Failed to load expense records. Please check network connection.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey, selectedFarm, selectedField, selectedCategory, selectedStatus, queryId]);

  // Filter option lists
  const farmList = useMemo(() => {
    return farms.map((f) => ({ id: f.id, name: f.name }));
  }, [farms]);

  const fieldList = useMemo(() => {
    if (selectedFarm === 'ALL') {
      return fields.map((f) => ({ id: f.id, name: `${f.name} (${f.farmName || ''})` }));
    }
    return fields.filter((f) => String(f.farmId) === String(selectedFarm)).map((f) => ({ id: f.id, name: f.name }));
  }, [fields, selectedFarm]);

  const cropList = useMemo(() => {
    const crops = new Set(expenses.map((e) => e.cropName).filter(Boolean));
    return Array.from(crops).sort();
  }, [expenses]);

  // Client-side filtering for search query and crop selection
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = String(exp.id || '').toLowerCase().includes(q);
        const matchDesc = (exp.description || '').toLowerCase().includes(q);
        const matchVendor = (exp.vendorName || exp.vendor || '').toLowerCase().includes(q);
        const matchFarm = (exp.farmName || '').toLowerCase().includes(q);
        const matchField = (exp.fieldName || '').toLowerCase().includes(q);
        const matchCrop = (exp.cropName || '').toLowerCase().includes(q);
        const matchReceipt = (exp.receiptNumber || '').toLowerCase().includes(q);
        if (!matchId && !matchDesc && !matchVendor && !matchFarm && !matchField && !matchCrop && !matchReceipt) {
          return false;
        }
      }

      // 2. Crop filter
      if (selectedCrop !== 'ALL') {
        if (!exp.cropName || exp.cropName.toLowerCase() !== selectedCrop.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [expenses, searchQuery, selectedCrop]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFarm('ALL');
    setSelectedField('ALL');
    setSelectedCrop('ALL');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
  };

  // Create or Update Expense Handler
  const handleSaveExpense = async (payload, id) => {
    if (id) {
      await expenseService.updateExpense(id, payload);
      setNotification({
        type: 'success',
        message: `${t('expenses.expense', 'Expense')} #${id} ${t('alerts.expenseUpdated', 'successfully updated!')}`,
      });
    } else {
      const created = await expenseService.createExpense(payload);
      setNotification({
        type: 'success',
        message: `${t('expenses.expense', 'Expense')} ${created.id ? `#${created.id}` : ''} (${formatCurrency(payload.amount)}) ${t('alerts.expenseAdded', 'successfully recorded!')}`,
      });
    }
    setRefreshKey((k) => k + 1);
    setTimeout(() => setNotification(null), 5000);
  };

  // Delete Expense Handler
  const confirmDeleteExpense = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    try {
      await expenseService.deleteExpense(expenseToDelete.id);
      setNotification({
        type: 'success',
        message: `${t('expenses.expense', 'Expense')} #${expenseToDelete.id} ${t('alerts.expenseDeleted', 'successfully deleted.')}`,
      });
      setExpenseToDelete(null);
      if (activeExpenseDetails?.id === expenseToDelete.id) {
        setActiveExpenseDetails(null);
      }
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err?.message || 'Failed to delete expense voucher.',
      });
    } finally {
      setIsDeleting(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className="agri-expenses-page">
      {/* Toast Notification */}
      {notification && (
        <div
          className="agri-demo-badge-banner"
          style={{
            backgroundColor: notification.type === 'error' ? '#fef2f2' : '#ecfdf5',
            borderColor: notification.type === 'error' ? '#fecaca' : '#a7f3d0',
            color: notification.type === 'error' ? '#991b1b' : '#065f46',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {notification.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
            <span style={{ fontWeight: 600 }}>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: notification.type === 'error' ? '#991b1b' : '#065f46' }}
            aria-label={t('common.close', 'Dismiss notification')}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <ExpenseHeader
        onRecordExpense={() => {
          setExpenseToEdit(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Initial Loading Skeleton */}
      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--primary-600)' }} />
          <p>{t('common.loading', 'Loading expense records and ledger summaries...')}</p>
        </div>
      ) : error ? (
        <div className="agri-alert agri-alert--error" style={{ margin: '2rem 0' }}>
          <AlertTriangle size={20} />
          <div>
            <strong>{t('common.error', 'Error loading expenses')}:</strong> {error}
          </div>
          <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)} style={{ marginLeft: 'auto' }}>
            {t('common.retry', 'Retry')}
          </Button>
        </div>
      ) : farms.length === 0 ? (
        <EmptyState
          title={t('farms.noFarms', 'No farms registered yet')}
          message={t('expenses.createFarmFirst', 'To record farm input vouchers, labor costs, and machinery expenses, please register your first farm holding.')}
          actionText={t('farms.addFarm', 'Create Farm Holding')}
          onAction={() => navigate('/farms')}
        />
      ) : (
        <>
          {/* Summary KPI Cards */}
          <ExpenseSummaryCards expenses={filteredExpenses} summary={summary} />

          {/* Expense Category Chart */}
          <ExpenseCategoryChart
            expenses={filteredExpenses}
            categoryBreakdown={summary?.categoryBreakdown}
          />

          {/* Filters Bar */}
          <ExpenseFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFarm={selectedFarm}
            onFarmChange={(val) => {
              setSelectedFarm(val);
              setSelectedField('ALL');
            }}
            selectedField={selectedField}
            onFieldChange={setSelectedField}
            selectedCrop={selectedCrop}
            onCropChange={setSelectedCrop}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onResetFilters={handleResetFilters}
            farmList={farmList}
            fieldList={fieldList}
            cropList={cropList}
          />

          {/* Main Content Area */}
          {filteredExpenses.length === 0 ? (
            <EmptyState
              title={t('expenses.noExpenses', 'No expenses found')}
              message={
                expenses.length === 0
                  ? t('expenses.noExpensesLogged', 'No expense vouchers have been recorded yet. Click "Record Farm Expense" to log your first voucher.')
                  : t('expenses.noExpensesDesc', 'No operational expense vouchers match the selected filter criteria. Try broadening your search or resetting filters.')
              }
              actionText={
                expenses.length === 0
                  ? t('expenses.addExpense', 'Record Farm Expense')
                  : t('common.clearFilters', 'Reset Filters')
              }
              onAction={
                expenses.length === 0
                  ? () => {
                      setExpenseToEdit(null);
                      setIsAddModalOpen(true);
                    }
                  : handleResetFilters
              }
            />
          ) : viewMode === 'table' ? (
            <ExpenseTable
              expenses={filteredExpenses}
              onViewDetails={setActiveExpenseDetails}
              onEdit={(exp) => {
                setExpenseToEdit(exp);
                setIsAddModalOpen(true);
              }}
              onDelete={(exp) => setExpenseToDelete(exp)}
            />
          ) : (
            <div className="agri-expense-cards-grid">
              {filteredExpenses.map((exp) => (
                <ExpenseCard
                  key={exp.id}
                  expense={exp}
                  onViewDetails={setActiveExpenseDetails}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Details Modal */}
      {activeExpenseDetails && (
        <ExpenseDetailsModal
          key={activeExpenseDetails.id}
          expense={activeExpenseDetails}
          onClose={() => setActiveExpenseDetails(null)}
          onEdit={(exp) => {
            setExpenseToEdit(exp);
            setIsAddModalOpen(true);
          }}
          onDelete={(exp) => setExpenseToDelete(exp)}
        />
      )}

      {/* Add / Edit Expense Modal */}
      {isAddModalOpen && (
        <AddExpenseModal
          key={expenseToEdit ? `edit-${expenseToEdit.id}` : 'add-expense-modal'}
          farms={farms}
          fields={fields}
          cropCycles={cropCycles}
          preselectedFarmId={selectedFarm}
          preselectedFieldId={selectedField}
          expenseToEdit={expenseToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setExpenseToEdit(null);
          }}
          onSave={handleSaveExpense}
        />
      )}

      {/* Delete Confirmation Modal */}
      {expenseToDelete && (
        <div
          className="agri-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => {
            if (!isDeleting) setExpenseToDelete(null);
          }}
        >
          <div className="agri-modal-dialog agri-modal-dialog--sm">
            <div className="agri-modal-header">
              <h3 className="agri-modal-title" style={{ color: '#dc2626' }}>
                {t('expenses.deleteTitle', 'Delete Expense Voucher')}
              </h3>
            </div>
            <div className="agri-modal-body">
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-700)' }}>
                {t(
                  'expenses.deleteConfirmMsg',
                  'Are you sure you want to permanently delete expense voucher #{{id}} for "{{desc}}" ({{amount}})? This will reconcile accounting ledger totals.',
                  {
                    id: expenseToDelete.id,
                    desc: expenseToDelete.description,
                    amount: formatCurrency(expenseToDelete.amount),
                  }
                )}
              </p>
            </div>
            <div className="agri-modal-footer">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setExpenseToDelete(null)}
                disabled={isDeleting}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={confirmDeleteExpense}
                disabled={isDeleting}
                style={{ backgroundColor: '#dc2626', color: '#fff' }}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{t('common.deleting', 'Deleting...')}</span>
                  </>
                ) : (
                  <span>{t('common.delete', 'Confirm Delete')}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
