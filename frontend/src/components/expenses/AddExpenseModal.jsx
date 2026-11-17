import { useState, useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '../common';
import {
  CANONICAL_CATEGORIES,
  CANONICAL_PAYMENT_METHODS,
  CANONICAL_PAYMENT_STATUSES,
} from '../../services/expenseService';

export default function AddExpenseModal({
  farms = [],
  fields = [],
  cropCycles = [],
  preselectedFarmId,
  preselectedFieldId,
  preselectedCropCycleId,
  expenseToEdit = null,
  onClose,
  onSave,
}) {
  const { t } = useTranslation();
  const farmSelectId = useId();
  const fieldSelectId = useId();
  const cropCycleSelectId = useId();
  const categorySelectId = useId();
  const descInputId = useId();
  const amountInputId = useId();
  const dateInputId = useId();
  const vendorInputId = useId();
  const paymentMethodSelectId = useId();
  const paymentStatusSelectId = useId();
  const receiptInputId = useId();
  const notesInputId = useId();

  const isEditMode = Boolean(expenseToEdit);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Form State
  const [farmId, setFarmId] = useState(() => {
    if (expenseToEdit?.farmId) return String(expenseToEdit.farmId);
    if (preselectedFarmId && preselectedFarmId !== 'ALL') return String(preselectedFarmId);
    return farms[0]?.id ? String(farms[0].id) : '';
  });

  const availableFields = useMemo(() => {
    if (!farmId) return [];
    return fields.filter((f) => String(f.farmId) === String(farmId));
  }, [fields, farmId]);

  const [fieldId, setFieldId] = useState(() => {
    if (expenseToEdit?.fieldId) return String(expenseToEdit.fieldId);
    if (preselectedFieldId && preselectedFieldId !== 'ALL') return String(preselectedFieldId);
    return '';
  });

  const availableCropCycles = useMemo(() => {
    if (!farmId) return [];
    return cropCycles.filter((c) => {
      const matchFarm = String(c.farmId) === String(farmId);
      if (!matchFarm) return false;
      if (fieldId) {
        return String(c.fieldId) === String(fieldId);
      }
      return true;
    });
  }, [cropCycles, farmId, fieldId]);

  const [cropCycleId, setCropCycleId] = useState(() => {
    if (expenseToEdit?.cropCycleId) return String(expenseToEdit.cropCycleId);
    if (preselectedCropCycleId && preselectedCropCycleId !== 'ALL') return String(preselectedCropCycleId);
    return '';
  });

  const [category, setCategory] = useState(expenseToEdit?.category || 'Fertilizer');
  const [description, setDescription] = useState(expenseToEdit?.description || '');
  const [amount, setAmount] = useState(expenseToEdit?.amount != null ? String(expenseToEdit.amount) : '');
  const [expenseDate, setExpenseDate] = useState(expenseToEdit?.expenseDate || expenseToEdit?.date || todayStr);
  const [vendorName, setVendorName] = useState(expenseToEdit?.vendorName || expenseToEdit?.vendor || '');
  const [paymentMethod, setPaymentMethod] = useState(expenseToEdit?.paymentMethod || 'UPI');
  const [paymentStatus, setPaymentStatus] = useState(expenseToEdit?.paymentStatus || expenseToEdit?.status || 'PAID');
  const [receiptNumber, setReceiptNumber] = useState(expenseToEdit?.receiptNumber || expenseToEdit?.voucherNumber || '');
  const [notes, setNotes] = useState(expenseToEdit?.notes || '');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleFarmChange = (newFarmId) => {
    setFarmId(newFarmId);
    setFieldId('');
    setCropCycleId('');
  };

  const handleFieldChange = (newFieldId) => {
    setFieldId(newFieldId);
    setCropCycleId('');
  };

  const validate = () => {
    const errs = {};
    if (!farmId) errs.farmId = t('validation.selectFarm', 'Please select a farm');
    if (!category) errs.category = t('validation.required', 'Please select an expense category');
    if (!description.trim()) errs.description = t('validation.required', 'Description is required');
    if (!expenseDate) {
      errs.expenseDate = t('validation.enterValidDate', 'Expense date is required');
    } else if (expenseDate > todayStr) {
      errs.expenseDate = t('validation.dateNotInFuture', 'Expense date cannot be in the future');
    }

    const numAmt = Number(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      errs.amount = t('validation.enterValidAmount', 'Amount must be greater than ₹0');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      farmId: Number(farmId),
      fieldId: fieldId ? Number(fieldId) : null,
      cropCycleId: cropCycleId ? Number(cropCycleId) : null,
      category,
      description: description.trim(),
      amount: Number(amount),
      expenseDate,
      vendorName: vendorName.trim() || null,
      paymentMethod: paymentMethod || 'CASH',
      paymentStatus: paymentStatus || 'PAID',
      receiptNumber: receiptNumber.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      await onSave(payload, expenseToEdit?.id);
      onClose();
    } catch (err) {
      setSubmitError(err?.message || 'Failed to save expense voucher. Please check inputs and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-expense-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="agri-modal-dialog agri-modal-dialog--lg">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600 }}>
              <CreditCard size={14} />
              <span>{t('expenses.costAccounting', 'Operational Expense Ledger')}</span>
            </div>
            <h3 id="add-expense-title" className="agri-modal-title">
              {isEditMode ? t('expenses.editExpense', 'Edit Expense Voucher') : t('expenses.addExpense', 'Record Farm Expense')}
            </h3>
            <p className="agri-modal-subtitle">
              {t('expenses.recordSubtitle', 'Log input purchase vouchers, farm labor settlements, and machinery charges.')}
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={t('common.close', 'Close modal')}
          >
            <X size={18} />
          </button>
        </div>

        {submitError && (
          <div className="agri-alert agri-alert--error" style={{ margin: '1rem 1.5rem 0' }}>
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="agri-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            {/* Farm & Field Selection */}
            <div className="agri-form-grid agri-form-grid--2">
              <div className="agri-form-group">
                <label htmlFor={farmSelectId} className="agri-form-label agri-form-label--required">
                  {t('fields.farm', 'Farm Holding')}
                </label>
                <select
                  id={farmSelectId}
                  className="agri-form-select"
                  value={farmId}
                  onChange={(e) => handleFarmChange(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">{t('validation.selectFarm', 'Select a farm')}</option>
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                {errors.farmId && <span className="agri-form-help text-danger">{errors.farmId}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={fieldSelectId} className="agri-form-label">
                  {t('expenses.fieldCostCenter', 'Field Parcel (Optional)')}
                </label>
                <select
                  id={fieldSelectId}
                  className="agri-form-select"
                  value={fieldId}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  disabled={isSubmitting || !farmId}
                >
                  <option value="">{t('expenses.generalFarm', 'Farm-wide / No specific field')}</option>
                  {availableFields.map((fld) => (
                    <option key={fld.id} value={fld.id}>
                      {fld.name}
                    </option>
                  ))}
                </select>
                {errors.fieldId && <span className="agri-form-help text-danger">{errors.fieldId}</span>}
              </div>
            </div>

            {/* Crop Cycle, Category, Amount */}
            <div className="agri-form-grid agri-form-grid--3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="agri-form-group">
                <label htmlFor={cropCycleSelectId} className="agri-form-label">
                  {t('expenses.assignedCrop', 'Standing Crop Cycle')}
                </label>
                <select
                  id={cropCycleSelectId}
                  className="agri-form-select"
                  value={cropCycleId}
                  onChange={(e) => setCropCycleId(e.target.value)}
                  disabled={isSubmitting || !farmId}
                >
                  <option value="">{t('expenses.generalFarm', 'None / General Farm')}</option>
                  {availableCropCycles.map((cycle) => (
                    <option key={cycle.id} value={cycle.id}>
                      {cycle.cropName} {cycle.variety ? `(${cycle.variety})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="agri-form-group">
                <label htmlFor={categorySelectId} className="agri-form-label agri-form-label--required">
                  {t('expenses.category', 'Expense Category')}
                </label>
                <select
                  id={categorySelectId}
                  className="agri-form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitting}
                >
                  {CANONICAL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {t(`expenseCategories.${cat.toLowerCase().replace(/\s+/g, '')}`, cat)}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="agri-form-help text-danger">{errors.category}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={amountInputId} className="agri-form-label agri-form-label--required">
                  {t('expenses.amount', 'Amount (₹)')}
                </label>
                <input
                  id={amountInputId}
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="agri-form-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 4500"
                  disabled={isSubmitting}
                />
                {errors.amount && <span className="agri-form-help text-danger">{errors.amount}</span>}
              </div>
            </div>

            {/* Description & Vendor */}
            <div className="agri-form-grid agri-form-grid--2">
              <div className="agri-form-group">
                <label htmlFor={descInputId} className="agri-form-label agri-form-label--required">
                  {t('expenses.voucherDesc', 'Voucher Description')}
                </label>
                <input
                  id={descInputId}
                  type="text"
                  maxLength={255}
                  className="agri-form-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('expenses.voucherDescPlaceholder', 'e.g. Urea & NPK application for vegetative growth')}
                  disabled={isSubmitting}
                />
                {errors.description && <span className="agri-form-help text-danger">{errors.description}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={vendorInputId} className="agri-form-label">
                  {t('expenses.vendorPayee', 'Vendor / Supplier / Payee')}
                </label>
                <input
                  id={vendorInputId}
                  type="text"
                  maxLength={150}
                  className="agri-form-input"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. IFFCO Kisan Sewa Kendra"
                  disabled={isSubmitting}
                />
                {errors.vendorName && <span className="agri-form-help text-danger">{errors.vendorName}</span>}
              </div>
            </div>

            {/* Date, Payment Method, Status */}
            <div className="agri-form-grid agri-form-grid--3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="agri-form-group">
                <label htmlFor={dateInputId} className="agri-form-label agri-form-label--required">
                  {t('common.date', 'Date')}
                </label>
                <input
                  id={dateInputId}
                  type="date"
                  max={todayStr}
                  className="agri-form-input"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.expenseDate && <span className="agri-form-help text-danger">{errors.expenseDate}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={paymentMethodSelectId} className="agri-form-label">
                  {t('expenses.paymentMethod', 'Payment Method')}
                </label>
                <select
                  id={paymentMethodSelectId}
                  className="agri-form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={isSubmitting}
                >
                  {CANONICAL_PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method === 'BANK_TRANSFER' ? t('expenses.paymentMethods.bankTransfer', 'Bank Transfer') :
                       method === 'CASH' ? t('expenses.paymentMethods.cash', 'Cash') :
                       method === 'UPI' ? t('expenses.paymentMethods.upi', 'UPI') :
                       t('expenses.paymentMethods.cheque', 'Cheque')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="agri-form-group">
                <label htmlFor={paymentStatusSelectId} className="agri-form-label">
                  {t('expenses.settlementStatus', 'Settlement Status')}
                </label>
                <select
                  id={paymentStatusSelectId}
                  className="agri-form-select"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  disabled={isSubmitting}
                >
                  {CANONICAL_PAYMENT_STATUSES.map((statusVal) => (
                    <option key={statusVal} value={statusVal}>
                      {statusVal === 'PAID' ? t('status.paid', 'Paid') : t('status.pending', 'Pending')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Receipt / Invoice Number */}
            <div className="agri-form-group">
              <label htmlFor={receiptInputId} className="agri-form-label">
                {t('expenses.voucherNumber', 'Receipt / Invoice Number (Optional)')}
              </label>
              <input
                id={receiptInputId}
                type="text"
                maxLength={100}
                className="agri-form-input"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                placeholder="e.g. INV-2026-4012"
                disabled={isSubmitting}
              />
            </div>

            {/* Notes */}
            <div className="agri-form-group">
              <label htmlFor={notesInputId} className="agri-form-label">
                {t('expenses.accountingNotes', 'Accounting Notes & Remarks')}
              </label>
              <textarea
                id={notesInputId}
                className="agri-form-textarea"
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('expenses.notesPlaceholder', 'Include invoice reference, batch details or work order comments...')}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="agri-modal-footer">
            <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t('common.saving', 'Saving...')}</span>
                </>
              ) : (
                <span>{isEditMode ? t('common.saveChanges', 'Save Changes') : t('expenses.saveVoucher', 'Save Expense Voucher')}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
