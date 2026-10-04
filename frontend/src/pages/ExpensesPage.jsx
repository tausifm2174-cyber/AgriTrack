import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { expenseRecords as initialExpenses } from '../data/expenseData';
import { farmData } from '../data/farmData';
import { fieldData } from '../data/fieldData';
import { EmptyState } from '../components/common';
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
import { filterExpenses } from '../utils/financialCalculations';
import '../components/expenses/expenses.css';

export default function ExpensesPage() {
  const [searchParams] = useSearchParams();

  // Query parameters
  const queryFarmId = searchParams.get('farmId') || 'ALL';
  const queryCrop = searchParams.get('crop') || 'ALL';
  const queryCategory = searchParams.get('category') || 'ALL';
  const queryId = searchParams.get('id');

  // State
  const [expenses, setExpenses] = useState(initialExpenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarm, setSelectedFarm] = useState(queryFarmId);
  const [selectedField, setSelectedField] = useState('ALL');
  const [selectedCrop, setSelectedCrop] = useState(queryCrop);
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');

  // Modals state
  const [activeExpenseDetails, setActiveExpenseDetails] = useState(() => {
    if (queryId) {
      return initialExpenses.find((e) => e.id === queryId) || null;
    }
    return null;
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Filter option lists
  const farmList = useMemo(() => {
    return (farmData.farms || []).map((f) => ({ id: f.id, name: f.name }));
  }, []);

  const fieldList = useMemo(() => {
    const list = fieldData.fields || [];
    if (selectedFarm === 'ALL') {
      return list.map((f) => ({ id: f.id, name: `${f.name} (${f.farmName})` }));
    }
    return list.filter((f) => f.farmId === selectedFarm).map((f) => ({ id: f.id, name: f.name }));
  }, [selectedFarm]);

  const cropList = useMemo(() => {
    const crops = new Set(expenses.map((e) => e.cropName).filter(Boolean));
    return Array.from(crops).sort();
  }, [expenses]);

  // Filtered expense records
  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, {
      farmId: selectedFarm,
      fieldId: selectedField,
      crop: selectedCrop,
      category: selectedCategory,
      status: selectedStatus,
      search: searchQuery,
    });
  }, [
    expenses,
    selectedFarm,
    selectedField,
    selectedCrop,
    selectedCategory,
    selectedStatus,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFarm('ALL');
    setSelectedField('ALL');
    setSelectedCrop('ALL');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
  };

  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
    setNotification({
      type: 'success',
      message: `Expense ${newExpense.id} for ${newExpense.description} (₹${newExpense.amount.toLocaleString('en-IN')}) successfully recorded!`,
    });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="agri-expenses-page">
      {/* Toast Notification */}
      {notification && (
        <div
          className="agri-demo-badge-banner"
          style={{
            backgroundColor: '#ecfdf5',
            borderColor: '#a7f3d0',
            color: '#065f46',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontWeight: 600 }}>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#065f46' }}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <ExpenseHeader onRecordExpense={() => setIsAddModalOpen(true)} />

      {/* Summary KPI Cards */}
      <ExpenseSummaryCards expenses={filteredExpenses} />

      {/* Expense Category Chart */}
      <ExpenseCategoryChart expenses={filteredExpenses} />

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
          title="No expenses found"
          message="No operational expense vouchers match the selected filter criteria. Try broadening your search or resetting filters."
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : viewMode === 'table' ? (
        <ExpenseTable
          expenses={filteredExpenses}
          onViewDetails={setActiveExpenseDetails}
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

      {/* Details Modal */}
      {activeExpenseDetails && (
        <ExpenseDetailsModal
          key={activeExpenseDetails.id}
          expense={activeExpenseDetails}
          onClose={() => setActiveExpenseDetails(null)}
        />
      )}

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <AddExpenseModal
          key="add-expense-modal"
          onClose={() => setIsAddModalOpen(false)}
          onAddExpense={handleAddExpense}
        />
      )}
    </div>
  );
}
