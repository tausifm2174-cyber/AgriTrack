import { useState, useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Receipt, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../common';
import saleService from '../../services/saleService';
import { formatCurrency, formatWeight } from '../../utils/formatters';
import { translateCrop, translateVariety } from '../../utils/displayLabels';

export default function AddSaleModal({
  harvests = [],
  marketPrices = [],
  preselectedHarvestId,
  preselectedCrop,
  preselectedMarket,
  onClose,
  onSave,
  saleToEdit = null,
}) {
  const { t } = useTranslation();
  const harvestSelectId = useId();
  const buyerInputId = useId();
  const dateInputId = useId();
  const marketSelectId = useId();
  const qtyInputId = useId();
  const priceKgInputId = useId();
  const paymentStatusSelectId = useId();
  const paidAmountInputId = useId();
  const saleStatusSelectId = useId();
  const paymentMethodSelectId = useId();
  const invoiceInputId = useId();
  const notesInputId = useId();

  const isEditMode = Boolean(saleToEdit);

  // Filter harvests that have available quantity
  const availableHarvests = useMemo(() => {
    return harvests.filter((h) => {
      if (isEditMode && String(h.id) === String(saleToEdit?.harvestId)) return true;
      return Number(h.availableQuantityKg) > 0;
    });
  }, [harvests, isEditMode, saleToEdit]);

  // Initial harvest
  const initialHarvest = useMemo(() => {
    if (saleToEdit) {
      return availableHarvests.find((h) => String(h.id) === String(saleToEdit.harvestId)) || null;
    }
    if (preselectedHarvestId) {
      const found = availableHarvests.find((h) => String(h.id) === String(preselectedHarvestId));
      if (found) return found;
    }
    if (preselectedCrop) {
      const found = availableHarvests.find(
        (h) => h.cropName?.toLowerCase() === preselectedCrop.toLowerCase()
      );
      if (found) return found;
    }
    return availableHarvests[0] || null;
  }, [availableHarvests, saleToEdit, preselectedHarvestId, preselectedCrop]);

  const [harvestId, setHarvestId] = useState(
    saleToEdit?.harvestId ? String(saleToEdit.harvestId) : (initialHarvest ? String(initialHarvest.id) : '')
  );

  const selectedHarvest = availableHarvests.find((h) => String(h.id) === String(harvestId)) || initialHarvest;

  const [buyerName, setBuyerName] = useState(saleToEdit?.buyerName || '');
  const [saleDate, setSaleDate] = useState(
    saleToEdit?.saleDate || new Date().toISOString().split('T')[0]
  );
  const [market, setMarket] = useState(
    saleToEdit?.market || preselectedMarket || (marketPrices[0]?.market || marketPrices[0]?.marketName || '')
  );
  const [quantityKg, setQuantityKg] = useState(
    saleToEdit?.quantityKg != null ? String(saleToEdit.quantityKg) : ''
  );

  // Match benchmark price from market prices
  const matchedBenchmark = useMemo(() => {
    if (!selectedHarvest) return null;
    return marketPrices.find(
      (mp) =>
        (mp.crop || mp.cropName)?.toLowerCase() === selectedHarvest.cropName?.toLowerCase() &&
        (market === 'ALL' || (mp.market || mp.marketName)?.toLowerCase().includes(market.toLowerCase()))
    ) || marketPrices.find(
      (mp) => (mp.crop || mp.cropName)?.toLowerCase() === selectedHarvest.cropName?.toLowerCase()
    );
  }, [selectedHarvest, market, marketPrices]);

  const defaultPriceKg = saleToEdit?.pricePerKg != null
    ? String(saleToEdit.pricePerKg)
    : (matchedBenchmark ? String(matchedBenchmark.pricePerKg) : '');

  const [pricePerKg, setPricePerKg] = useState(defaultPriceKg);
  const [paymentChoice, setPaymentChoice] = useState(
    saleToEdit?.paymentStatus || 'PAID'
  );
  const [paidAmount, setPaidAmount] = useState(
    saleToEdit?.paidAmount != null ? String(saleToEdit.paidAmount) : ''
  );
  const [saleStatus, setSaleStatus] = useState(saleToEdit?.status || 'COMPLETED');
  const [paymentMethod, setPaymentMethod] = useState(
    saleToEdit?.paymentMethod || 'Bank Transfer (NEFT)'
  );
  const [invoiceNumber, setInvoiceNumber] = useState(saleToEdit?.invoiceNumber || '');
  const [notes, setNotes] = useState(saleToEdit?.notes || '');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Preview calculations for the user UI
  const numQty = Number(quantityKg) || 0;
  const numPriceKg = Number(pricePerKg) || 0;
  const previewTotalAmount = Number((numQty * numPriceKg).toFixed(2));
  const previewPricePerQ = Number((numPriceKg * 100).toFixed(2));

  // Determine paid amount based on choice
  const calculatedPaidAmount = useMemo(() => {
    if (paymentChoice === 'PAID') return previewTotalAmount;
    if (paymentChoice === 'PENDING') return 0;
    return paidAmount !== '' ? Number(paidAmount) : 0;
  }, [paymentChoice, previewTotalAmount, paidAmount]);

  const previewBalanceDue = Math.max(0, Number((previewTotalAmount - calculatedPaidAmount).toFixed(2)));

  const maxAvailable = selectedHarvest
    ? (isEditMode && String(selectedHarvest.id) === String(saleToEdit?.harvestId)
        ? Number(selectedHarvest.availableQuantityKg) + Number(saleToEdit.quantityKg)
        : Number(selectedHarvest.availableQuantityKg))
    : 0;

  const validate = () => {
    const errs = {};
    if (!isEditMode && (!harvestId || !selectedHarvest)) {
      errs.harvestId = t('validation.required', 'Please select an available harvest lot');
    }
    if (!buyerName.trim()) {
      errs.buyerName = t('validation.required', 'Buyer name is required');
    }
    if (!saleDate) {
      errs.saleDate = t('validation.required', 'Sale date is required');
    }
    if (isNaN(numQty) || numQty <= 0) {
      errs.quantityKg = t('validation.positiveNumber', 'Quantity must be greater than 0');
    } else if (selectedHarvest && numQty > maxAvailable) {
      errs.quantityKg = `${t('sales.cannotExceed', 'Quantity cannot exceed available stock')} (${maxAvailable} kg)`;
    }

    if (isNaN(numPriceKg) || numPriceKg <= 0) {
      errs.pricePerKg = t('validation.positiveNumber', 'Price per kg must be greater than 0');
    }

    if (paymentChoice === 'PARTIAL') {
      const pAmt = Number(paidAmount);
      if (isNaN(pAmt) || pAmt < 0) {
        errs.paidAmount = t('validation.positiveNumber', 'Paid amount must be 0 or greater');
      } else if (pAmt > previewTotalAmount) {
        errs.paidAmount = t('validation.invalidAmount', 'Paid amount cannot exceed total sale amount');
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      buyerName: buyerName.trim(),
      saleDate,
      quantityKg: numQty,
      pricePerKg: numPriceKg,
      market: market ? market.trim() : null,
      status: saleStatus || 'COMPLETED',
      paidAmount: calculatedPaidAmount,
      paymentMethod: paymentMethod ? paymentMethod.trim() : null,
      invoiceNumber: invoiceNumber ? invoiceNumber.trim() : null,
      referenceMarketPricePerQ: matchedBenchmark ? Number(matchedBenchmark.pricePerQuintal) : null,
      notes: notes ? notes.trim() : null,
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let result;
      if (isEditMode) {
        result = await saleService.updateSale(saleToEdit.id, payload);
      } else {
        result = await saleService.createSale(Number(harvestId), payload);
      }
      onSave(result, isEditMode);
      onClose();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || t('common.error', 'An error occurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasNoHarvests = !isEditMode && availableHarvests.length === 0;

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-sale-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="agri-modal-dialog agri-modal-dialog--lg">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontSize: '0.75rem', fontWeight: 600 }}>
              <Receipt size={14} />
              <span>{t('sales.tradeExecution', 'Commercial Produce Trade & Invoice')}</span>
            </div>
            <h3 id="add-sale-title" className="agri-modal-title">
              {isEditMode ? t('sales.editSale', 'Edit Sale Order') : t('sales.addSale', 'Record Commercial Produce Sale')}
            </h3>
            <p className="agri-modal-subtitle">
              {t('sales.recordSaleSubtitle', 'Execute produce sale against available harvest inventory and generate financial receivables.')}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="agri-modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
            {/* Warning if no harvest stock is available */}
            {hasNoHarvests && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: 'var(--radius-md)',
                  color: '#92400e',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>{t('sales.noHarvestsForSale', 'No harvest lots with available stock found. Please record a harvest before logging sales.')}</span>
              </div>
            )}

            {submitError && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 'var(--radius-md)',
                  color: '#dc2626',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                {submitError}
              </div>
            )}

            {/* Select Harvest Lot */}
            {!isEditMode ? (
              <div className="agri-form-group">
                <label htmlFor={harvestSelectId} className="agri-form-label agri-form-label--required">
                  {t('sales.selectHarvestLot', 'Available Harvest Stock')}
                </label>
                <select
                  id={harvestSelectId}
                  className="agri-form-select"
                  value={harvestId}
                  onChange={(e) => setHarvestId(e.target.value)}
                  disabled={hasNoHarvests || isSubmitting}
                >
                  {availableHarvests.map((h) => (
                    <option key={h.id} value={h.id}>
                      #{h.id} — {translateCrop(h.cropName, t)} ({translateVariety(h.variety, t)}) • {formatWeight(h.availableQuantityKg, 'kg')} {t('harvests.availableQuantity', 'available')} [{h.farmName} • {h.fieldName}]
                    </option>
                  ))}
                </select>
                {errors.harvestId && <span className="agri-form-help text-danger">{errors.harvestId}</span>}
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--slate-200)', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--slate-700)' }}>
                  {translateCrop(saleToEdit.cropName, t)} ({translateVariety(saleToEdit.variety, t)})
                </span>
                <div style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>
                  {saleToEdit.farmName} • {saleToEdit.fieldName} • {t('sales.harvestRef', 'Harvest Lot')}: #{saleToEdit.harvestId}
                </div>
              </div>
            )}

            {/* Buyer Name & Terminal Mandi */}
            <div className="agri-form-grid agri-form-grid--2">
              <div className="agri-form-group">
                <label htmlFor={buyerInputId} className="agri-form-label agri-form-label--required">
                  {t('sales.buyerName', 'Commercial Buyer')}
                </label>
                <input
                  id={buyerInputId}
                  type="text"
                  className="agri-form-input"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. AgroPure Foods & Mills"
                  disabled={isSubmitting}
                />
                {errors.buyerName && <span className="agri-form-help text-danger">{errors.buyerName}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={marketSelectId} className="agri-form-label">
                  {t('sales.marketMandi', 'Terminal Mandi / Market')}
                </label>
                <input
                  id={marketSelectId}
                  type="text"
                  className="agri-form-input"
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  placeholder="e.g. APMC Nashik"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Sale Date & Quantity */}
            <div className="agri-form-grid agri-form-grid--2">
              <div className="agri-form-group">
                <label htmlFor={dateInputId} className="agri-form-label agri-form-label--required">
                  {t('sales.saleDate', 'Execution Date')}
                </label>
                <input
                  id={dateInputId}
                  type="date"
                  className="agri-form-input"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.saleDate && <span className="agri-form-help text-danger">{errors.saleDate}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={qtyInputId} className="agri-form-label agri-form-label--required">
                  {t('sales.quantitySold', 'Quantity Sold')} (kg)
                </label>
                <input
                  id={qtyInputId}
                  type="number"
                  className="agri-form-input"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(e.target.value)}
                  min="0.1"
                  step="any"
                  placeholder="e.g. 500"
                  disabled={isSubmitting}
                />
                <span className="agri-form-help">
                  {(numQty / 100).toFixed(2)} {t('units.quintals', 'quintals')} (Max: {maxAvailable} kg)
                </span>
                {errors.quantityKg && <span className="agri-form-help text-danger">{errors.quantityKg}</span>}
              </div>
            </div>

            {/* Unit Price & Benchmark Reference */}
            <div className="agri-form-grid agri-form-grid--2">
              <div className="agri-form-group">
                <label htmlFor={priceKgInputId} className="agri-form-label agri-form-label--required">
                  {t('sales.pricePerKg', 'Negotiated Price / Kg')} (₹)
                </label>
                <input
                  id={priceKgInputId}
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="agri-form-input"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(e.target.value)}
                  placeholder="e.g. 25.00"
                  disabled={isSubmitting}
                />
                <span className="agri-form-help">
                  ≈ {formatCurrency(previewPricePerQ)} / {t('units.quintal', 'quintal')}
                </span>
                {errors.pricePerKg && <span className="agri-form-help text-danger">{errors.pricePerKg}</span>}
              </div>

              {/* Mandi Benchmark Info */}
              <div className="agri-form-group">
                <label className="agri-form-label">
                  {t('sales.apmcReference', 'APMC Benchmark Rate')}
                </label>
                <div
                  style={{
                    padding: '0.625rem 0.75rem',
                    backgroundColor: 'var(--slate-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-200)',
                    fontSize: '0.85rem',
                    color: 'var(--slate-700)',
                  }}
                >
                  {matchedBenchmark ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{matchedBenchmark.market || matchedBenchmark.marketName}:</span>
                      <strong>{formatCurrency(matchedBenchmark.pricePerQuintal)}/q</strong>
                    </div>
                  ) : (
                    <span>{t('sales.marketReference', 'No active APMC rate found for')} {selectedHarvest?.cropName || 'crop'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Financials Box */}
            <div
              style={{
                backgroundColor: 'var(--primary-50, #f0fdf4)',
                border: '1px solid var(--primary-100, #dcfce7)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '0.75rem',
                textAlign: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)', display: 'block' }}>
                  {t('sales.totalAmount', 'Total Sale Amount')}
                </span>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                  {formatCurrency(previewTotalAmount)}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)', display: 'block' }}>
                  {t('sales.paidAmount', 'Amount Received')}
                </span>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#059669' }}>
                  {formatCurrency(calculatedPaidAmount)}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--slate-500)', display: 'block' }}>
                  {t('sales.balanceDue', 'Balance Due')}
                </span>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: previewBalanceDue > 0 ? '#d97706' : 'var(--slate-600)' }}>
                  {formatCurrency(previewBalanceDue)}
                </span>
              </div>
            </div>

            {/* Payment Settlement Terms */}
            <div className="agri-form-grid agri-form-grid--3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="agri-form-group">
                <label htmlFor={paymentStatusSelectId} className="agri-form-label">
                  {t('sales.paymentStatus', 'Payment Settlement')}
                </label>
                <select
                  id={paymentStatusSelectId}
                  className="agri-form-select"
                  value={paymentChoice}
                  onChange={(e) => setPaymentChoice(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="PAID">{t('status.paid', 'Fully Settled (Paid)')}</option>
                  <option value="PARTIAL">{t('status.partiallyPaid', 'Partial Advance')}</option>
                  <option value="PENDING">{t('status.unpaid', 'Payment Pending (Credit)')}</option>
                </select>
              </div>

              {paymentChoice === 'PARTIAL' ? (
                <div className="agri-form-group">
                  <label htmlFor={paidAmountInputId} className="agri-form-label agri-form-label--required">
                    {t('sales.paidAmount', 'Advance Received (₹)')}
                  </label>
                  <input
                    id={paidAmountInputId}
                    type="number"
                    step="0.01"
                    min="0"
                    className="agri-form-input"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    disabled={isSubmitting}
                  />
                  {errors.paidAmount && <span className="agri-form-help text-danger">{errors.paidAmount}</span>}
                </div>
              ) : (
                <div className="agri-form-group">
                  <label htmlFor={saleStatusSelectId} className="agri-form-label">
                    {t('common.status', 'Order Status')}
                  </label>
                  <select
                    id={saleStatusSelectId}
                    className="agri-form-select"
                    value={saleStatus}
                    onChange={(e) => setSaleStatus(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="COMPLETED">{t('status.completed', 'Completed')}</option>
                    <option value="PENDING">{t('status.pending', 'Pending Delivery')}</option>
                    <option value="CANCELLED">{t('status.cancelled', 'Cancelled')}</option>
                  </select>
                </div>
              )}

              <div className="agri-form-group">
                <label htmlFor={paymentMethodSelectId} className="agri-form-label">
                  {t('sales.settlementMethod', 'Settlement Method')}
                </label>
                <select
                  id={paymentMethodSelectId}
                  className="agri-form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT/RTGS)</option>
                  <option value="UPI / Online">UPI / QR Payment</option>
                  <option value="Cash">Cash on Delivery</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
            </div>

            {/* Invoice Number */}
            <div className="agri-form-group">
              <label htmlFor={invoiceInputId} className="agri-form-label">
                {t('sales.invoiceNo', 'Invoice / Bill Reference')}
              </label>
              <input
                id={invoiceInputId}
                type="text"
                className="agri-form-input"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g. INV-2026-0042"
                disabled={isSubmitting}
              />
            </div>

            {/* Notes */}
            <div className="agri-form-group">
              <label htmlFor={notesInputId} className="agri-form-label">
                {t('sales.contractNotes', 'Transaction & Contract Notes')}
              </label>
              <textarea
                id={notesInputId}
                className="agri-form-textarea"
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment terms, delivery receipt remarks, truck number..."
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="agri-modal-footer">
            <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={hasNoHarvests || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t('sales.saving', 'Executing Sale...')}</span>
                </>
              ) : (
                <span>{isEditMode ? t('common.save', 'Save Changes') : t('sales.completeSale', 'Execute Sale')}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
