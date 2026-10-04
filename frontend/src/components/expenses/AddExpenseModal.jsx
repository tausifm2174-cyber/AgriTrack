import { useState, useId } from 'react';
import { X, CreditCard } from 'lucide-react';
import { Button } from '../common';
import { farmData } from '../../data/farmData';
import { fieldData } from '../../data/fieldData';
import { EXPENSE_CATEGORIES } from '../../data/expenseData';

function getNextExpenseId() {
  return `EXP-00${Math.floor(Math.random() * 900) + 100}`;
}

function getNextVoucherNumber() {
  return `VOUCH-2026-${Math.floor(Math.random() * 9000) + 1000}`;
}

export default function AddExpenseModal({ onClose, onAddExpense }) {
  const farmSelectId = useId();
  const fieldSelectId = useId();
  const cropInputId = useId();
  const categorySelectId = useId();
  const descInputId = useId();
  const amountInputId = useId();
  const dateInputId = useId();
  const vendorInputId = useId();
  const paymentMethodSelectId = useId();
  const paymentStatusSelectId = useId();
  const notesInputId = useId();

  const farms = farmData.farms || [];
  const allFields = fieldData.fields || [];

  const [farmId, setFarmId] = useState(farms[0]?.id || 'farm-1');
  const availableFields = allFields.filter((f) => f.farmId === farmId);
  const [fieldId, setFieldId] = useState(availableFields[0]?.id || 'field-1a');

  const selectedField = allFields.find((f) => f.id === fieldId) || availableFields[0];
  const [cropName, setCropName] = useState(selectedField?.currentCrop || 'Wheat');

  const [category, setCategory] = useState('Fertilizer');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2026-10-03');
  const [vendor, setVendor] = useState('IFFCO Kisan Sewa Kendra');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [status, setStatus] = useState('PAID');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});

  const handleFarmChange = (newFarmId) => {
    setFarmId(newFarmId);
    const newFields = allFields.filter((f) => f.farmId === newFarmId);
    if (newFields.length > 0) {
      setFieldId(newFields[0].id);
      setCropName(newFields[0].currentCrop || 'Wheat');
    } else {
      setFieldId('');
      setCropName('');
    }
  };

  const handleFieldChange = (newFieldId) => {
    setFieldId(newFieldId);
    const f = allFields.find((field) => field.id === newFieldId);
    if (f) {
      setCropName(f.currentCrop || 'Wheat');
    }
  };

  const validate = () => {
    const errs = {};
    if (!farmId) errs.farmId = 'Please select a farm';
    if (!fieldId) errs.fieldId = 'Please select a field';
    if (!category) errs.category = 'Please select an expense category';
    if (!description.trim()) errs.description = 'Description is required';
    if (!vendor.trim()) errs.vendor = 'Vendor / Supplier is required';
    if (!date) errs.date = 'Expense date is required';

    const numAmt = Number(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      errs.amount = 'Amount must be greater than ₹0';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const farmObj = farms.find((f) => f.id === farmId);
    const fieldObj = allFields.find((f) => f.id === fieldId);

    const newExpense = {
      id: getNextExpenseId(),
      farmId,
      farmName: farmObj ? farmObj.name : 'Green Valley Farm',
      fieldId,
      fieldName: fieldObj ? fieldObj.name : 'Field 1A',
      cropId: fieldObj?.currentCrop ? `crop-cycle-${fieldId}` : null,
      cropName: cropName.trim() || 'General Farm',
      category,
      description: description.trim(),
      amount: Number(amount),
      date,
      vendor: vendor.trim(),
      paymentMethod,
      status,
      receiptNumber: getNextVoucherNumber(),
      notes: notes.trim() || 'Input voucher cleared and logged into accounts ledger.',
    };

    onAddExpense(newExpense);
    onClose();
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-expense-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog agri-modal-dialog--lg">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600 }}>
              <CreditCard size={14} />
              <span>Operational Expense Ledger</span>
            </div>
            <h3 id="add-expense-title" className="agri-modal-title">
              Record Farm Expense
            </h3>
            <p className="agri-modal-subtitle">
              Log input purchase vouchers, farm labor settlements, and machinery charges.
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="agri-modal-body">
            {/* Dependent Farm and Field */}
            <div className="agri-form-grid agri-form-grid--2">
              <div className="agri-form-group">
                <label htmlFor={farmSelectId} className="agri-form-label agri-form-label--required">
                  Farm / Holding
                </label>
                <select
                  id={farmSelectId}
                  className="agri-form-select"
                  value={farmId}
                  onChange={(e) => handleFarmChange(e.target.value)}
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.district})
                    </option>
                  ))}
                </select>
                {errors.farmId && <span className="agri-form-help text-danger">{errors.farmId}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={fieldSelectId} className="agri-form-label agri-form-label--required">
                  Field Cost Center
                </label>
                <select
                  id={fieldSelectId}
                  className="agri-form-select"
                  value={fieldId}
                  onChange={(e) => handleFieldChange(e.target.value)}
                >
                  {availableFields.map((fld) => (
                    <option key={fld.id} value={fld.id}>
                      {fld.name} ({fld.currentCrop})
                    </option>
                  ))}
                </select>
                {errors.fieldId && <span className="agri-form-help text-danger">{errors.fieldId}</span>}
              </div>
            </div>

            {/* Crop, Category, Amount */}
            <div className="agri-form-grid agri-form-grid--3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="agri-form-group">
                <label htmlFor={cropInputId} className="agri-form-label">
                  Assigned Crop
                </label>
                <input
                  id={cropInputId}
                  type="text"
                  className="agri-form-input"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="e.g. Wheat"
                />
              </div>

              <div className="agri-form-group">
                <label htmlFor={categorySelectId} className="agri-form-label agri-form-label--required">
                  Expense Category
                </label>
                <select
                  id={categorySelectId}
                  className="agri-form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="agri-form-help text-danger">{errors.category}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={amountInputId} className="agri-form-label agri-form-label--required">
                  Amount (₹)
                </label>
                <input
                  id={amountInputId}
                  type="number"
                  className="agri-form-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 4500"
                  min="1"
                />
                {errors.amount && <span className="agri-form-help text-danger">{errors.amount}</span>}
              </div>
            </div>

            {/* Description & Vendor */}
            <div className="agri-form-grid agri-form-grid--2">
              <div className="agri-form-group">
                <label htmlFor={descInputId} className="agri-form-label agri-form-label--required">
                  Voucher Description
                </label>
                <input
                  id={descInputId}
                  type="text"
                  className="agri-form-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Urea & NPK application for vegetative growth"
                />
                {errors.description && <span className="agri-form-help text-danger">{errors.description}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={vendorInputId} className="agri-form-label agri-form-label--required">
                  Vendor / Supplier / Payee
                </label>
                <input
                  id={vendorInputId}
                  type="text"
                  className="agri-form-input"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g. IFFCO Kisan Sewa Kendra"
                />
                {errors.vendor && <span className="agri-form-help text-danger">{errors.vendor}</span>}
              </div>
            </div>

            {/* Date, Payment Method, Status */}
            <div className="agri-form-grid agri-form-grid--3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="agri-form-group">
                <label htmlFor={dateInputId} className="agri-form-label agri-form-label--required">
                  Date
                </label>
                <input
                  id={dateInputId}
                  type="date"
                  className="agri-form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {errors.date && <span className="agri-form-help text-danger">{errors.date}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={paymentMethodSelectId} className="agri-form-label">
                  Payment Method
                </label>
                <select
                  id={paymentMethodSelectId}
                  className="agri-form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="UPI">UPI Direct</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT)</option>
                  <option value="Cash">Cash Voucher</option>
                  <option value="Credit">Vendor Credit</option>
                </select>
              </div>

              <div className="agri-form-group">
                <label htmlFor={paymentStatusSelectId} className="agri-form-label">
                  Settlement Status
                </label>
                <select
                  id={paymentStatusSelectId}
                  className="agri-form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PAID">Paid in Full</option>
                  <option value="PENDING">Pending Payment</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="agri-form-group">
              <label htmlFor={notesInputId} className="agri-form-label">
                Accounting Notes & Remarks
              </label>
              <textarea
                id={notesInputId}
                className="agri-form-textarea"
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Include invoice reference, batch details or work order comments..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="agri-modal-footer">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Expense Voucher
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
