import { useState, useId, useMemo } from 'react';
import { X, Receipt, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '../common';
import { marketPriceRecords } from '../../data/marketPriceData';
import { formatCurrency, formatWeight } from '../../utils/formatters';

function getNextSaleId() {
  return `SAL-00${Math.floor(Math.random() * 900) + 100}`;
}

function getNextInvoiceNumber() {
  return `INV-2026-${Math.floor(Math.random() * 9000) + 1000}`;
}

export default function AddSaleModal({
  harvests = [],
  preselectedHarvestId,
  preselectedCrop,
  preselectedMarket,
  onClose,
  onAddSale,
}) {
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
  const notesInputId = useId();

  // Filter harvests that have available quantity
  const availableHarvests = useMemo(() => {
    return harvests.filter((h) => h.availableQuantityKg > 0);
  }, [harvests]);

  // Initial harvest
  const initialHarvest = useMemo(() => {
    if (preselectedHarvestId) {
      const found = availableHarvests.find((h) => h.id === preselectedHarvestId);
      if (found) return found;
    }
    if (preselectedCrop) {
      const found = availableHarvests.find(
        (h) => h.cropName.toLowerCase() === preselectedCrop.toLowerCase()
      );
      if (found) return found;
    }
    return availableHarvests[0] || null;
  }, [availableHarvests, preselectedHarvestId, preselectedCrop]);

  const [harvestId, setHarvestId] = useState(initialHarvest ? initialHarvest.id : '');
  const selectedHarvest = availableHarvests.find((h) => h.id === harvestId) || initialHarvest;

  const [buyerName, setBuyerName] = useState('AgroPure Foods & Mills');
  const [saleDate, setSaleDate] = useState('2026-10-03');
  const [market, setMarket] = useState(preselectedMarket || 'APMC Nashik');
  const [quantityKg, setQuantityKg] = useState('500');

  // Match default price based on APMC benchmark if available
  const matchedBenchmark = useMemo(() => {
    if (!selectedHarvest) return null;
    return marketPriceRecords.find(
      (mp) =>
        mp.crop.toLowerCase() === selectedHarvest.cropName.toLowerCase() &&
        (market === 'ALL' || mp.market.toLowerCase().includes(market.toLowerCase()) || true)
    ) || marketPriceRecords.find(
      (mp) => mp.crop.toLowerCase() === selectedHarvest.cropName.toLowerCase()
    );
  }, [selectedHarvest, market]);

  const defaultPriceKg = matchedBenchmark ? String(matchedBenchmark.pricePerKg) : '25.00';
  const [pricePerKg, setPricePerKg] = useState(defaultPriceKg);

  const [paymentStatus, setPaymentStatus] = useState('PAID');
  const [paidAmount, setPaidAmount] = useState('');
  const [saleStatus, setSaleStatus] = useState('COMPLETED');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer (NEFT)');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  // Calculations
  const numQty = Number(quantityKg) || 0;
  const numPriceKg = Number(pricePerKg) || 0;
  const pricePerQuintal = Math.round(numPriceKg * 100);
  const totalAmount = Math.round(numQty * numPriceKg);

  const computedPaidAmount =
    paymentStatus === 'PAID'
      ? totalAmount
      : paymentStatus === 'PENDING'
      ? 0
      : Number(paidAmount) || 0;

  const computedBalanceDue = Math.max(0, totalAmount - computedPaidAmount);

  // Mandi benchmark differential
  const diffPerQ =
    matchedBenchmark && pricePerQuintal
      ? pricePerQuintal - matchedBenchmark.pricePerQuintal
      : null;

  const validate = () => {
    const errs = {};
    if (!harvestId || !selectedHarvest) {
      errs.harvestId = 'Please select an available harvest lot';
    }
    if (!buyerName.trim()) {
      errs.buyerName = 'Buyer name is required';
    }
    if (!saleDate) {
      errs.saleDate = 'Sale date is required';
    }
    if (isNaN(numQty) || numQty <= 0) {
      errs.quantityKg = 'Quantity must be greater than 0';
    } else if (selectedHarvest && numQty > selectedHarvest.availableQuantityKg) {
      errs.quantityKg = `Quantity cannot exceed available stock (${selectedHarvest.availableQuantityKg} kg)`;
    }

    if (isNaN(numPriceKg) || numPriceKg <= 0) {
      errs.pricePerKg = 'Price per kg must be greater than 0';
    }

    if (paymentStatus === 'PARTIAL') {
      const pAmt = Number(paidAmount);
      if (isNaN(pAmt) || pAmt < 0) {
        errs.paidAmount = 'Paid amount must be 0 or greater';
      } else if (pAmt > totalAmount) {
        errs.paidAmount = 'Paid amount cannot exceed total sale amount';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newSale = {
      id: getNextSaleId(),
      harvestId: selectedHarvest.id,
      farmId: selectedHarvest.farmId,
      farmName: selectedHarvest.farmName,
      fieldId: selectedHarvest.fieldId,
      fieldName: selectedHarvest.fieldName,
      cropId: selectedHarvest.cropId,
      cropName: selectedHarvest.cropName,
      variety: selectedHarvest.variety,
      buyerName: buyerName.trim(),
      saleDate,
      quantityKg: numQty,
      pricePerKg: numPriceKg,
      pricePerQuintal,
      totalAmount,
      market,
      status: saleStatus,
      paymentStatus,
      paidAmount: computedPaidAmount,
      balanceDue: computedBalanceDue,
      paymentMethod,
      invoiceNumber: getNextInvoiceNumber(),
      referenceMarketPricePerQ: matchedBenchmark ? matchedBenchmark.pricePerQuintal : null,
      notes: notes.trim() || 'Executed produce sale with agreed settlement terms.',
    };

    onAddSale(newSale, numQty);
    onClose();
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-sale-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog agri-modal-dialog--lg">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontSize: '0.75rem', fontWeight: 600 }}>
              <Receipt size={14} />
              <span>Commercial Trade Execution</span>
            </div>
            <h3 id="add-sale-title" className="agri-modal-title">
              Record Produce Sale
            </h3>
            <p className="agri-modal-subtitle">
              Offload available harvest stock, establish buyer agreements, and invoice transaction.
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
            {/* Harvest Selection */}
            <div className="agri-form-group">
              <label htmlFor={harvestSelectId} className="agri-form-label agri-form-label--required">
                Select Available Harvest Lot
              </label>
              {availableHarvests.length === 0 ? (
                <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#b91c1c', fontSize: '0.85rem' }}>
                  No harvest lots currently have available inventory. Record a harvest first.
                </div>
              ) : (
                <select
                  id={harvestSelectId}
                  className="agri-form-select"
                  value={harvestId}
                  onChange={(e) => {
                    setHarvestId(e.target.value);
                    const selected = availableHarvests.find((h) => h.id === e.target.value);
                    if (selected) {
                      const bm = marketPriceRecords.find(
                        (mp) => mp.crop.toLowerCase() === selected.cropName.toLowerCase()
                      );
                      if (bm) setPricePerKg(String(bm.pricePerKg));
                    }
                  }}
                >
                  {availableHarvests.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.id} — {h.cropName} ({h.variety}) | {h.farmName} — Available:{' '}
                      {formatWeight(h.availableQuantityKg, 'kg')} ({(h.availableQuantityKg / 100).toFixed(1)} q)
                    </option>
                  ))}
                </select>
              )}
              {errors.harvestId && <span className="agri-form-help text-danger">{errors.harvestId}</span>}
            </div>

            {/* Buyer & Date & Market */}
            <div className="agri-form-grid agri-form-grid--3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="agri-form-group">
                <label htmlFor={buyerInputId} className="agri-form-label agri-form-label--required">
                  Buyer Name / Trader
                </label>
                <input
                  id={buyerInputId}
                  type="text"
                  className="agri-form-input"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Kisan Agro Processing"
                />
                {errors.buyerName && <span className="agri-form-help text-danger">{errors.buyerName}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={dateInputId} className="agri-form-label agri-form-label--required">
                  Sale Date
                </label>
                <input
                  id={dateInputId}
                  type="date"
                  className="agri-form-input"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                />
                {errors.saleDate && <span className="agri-form-help text-danger">{errors.saleDate}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={marketSelectId} className="agri-form-label">
                  Market / Mandi
                </label>
                <select
                  id={marketSelectId}
                  className="agri-form-select"
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                >
                  <option value="APMC Nashik">APMC Nashik</option>
                  <option value="Karnal Mandi">Karnal Mandi</option>
                  <option value="Vashi Mumbai">Vashi Mumbai</option>
                  <option value="Khanna Punjab">Khanna Punjab</option>
                  <option value="Direct Farm Gate">Direct Farm Gate</option>
                </select>
              </div>
            </div>

            {/* Quantity, Unit Price, and Auto-Calculated Total */}
            <div className="agri-form-grid agri-form-grid--3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="agri-form-group">
                <label htmlFor={qtyInputId} className="agri-form-label agri-form-label--required">
                  Quantity Sold (kg)
                </label>
                <input
                  id={qtyInputId}
                  type="number"
                  className="agri-form-input"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(e.target.value)}
                  min="1"
                  max={selectedHarvest ? selectedHarvest.availableQuantityKg : undefined}
                />
                <span className="agri-form-help">
                  {(numQty / 100).toFixed(1)} q (Max: {selectedHarvest ? selectedHarvest.availableQuantityKg : 0} kg)
                </span>
                {errors.quantityKg && <span className="agri-form-help text-danger">{errors.quantityKg}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={priceKgInputId} className="agri-form-label agri-form-label--required">
                  Price Per Kg (₹)
                </label>
                <input
                  id={priceKgInputId}
                  type="number"
                  step="0.25"
                  className="agri-form-input"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(e.target.value)}
                  min="0.1"
                />
                <span className="agri-form-help">
                  = ₹{pricePerQuintal}/quintal
                </span>
                {errors.pricePerKg && <span className="agri-form-help text-danger">{errors.pricePerKg}</span>}
              </div>

              <div className="agri-form-group">
                <label className="agri-form-label">
                  Total Sale Amount
                </label>
                <div
                  style={{
                    padding: '0.55rem 0.75rem',
                    backgroundColor: 'var(--slate-100)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    color: 'var(--primary-700)',
                    border: '1px solid var(--slate-300)',
                    minHeight: '38px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {formatCurrency(totalAmount)}
                </div>
                <span className="agri-form-help">
                  Auto-calculated ({numQty} kg × ₹{numPriceKg}/kg)
                </span>
              </div>
            </div>

            {/* APMC Mandi Benchmark Reference Box */}
            {matchedBenchmark && (
              <div
                className={`agri-reference-banner ${
                  diffPerQ >= 0 ? 'agri-reference-banner--premium' : 'agri-reference-banner--discount'
                }`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} />
                  <div>
                    <div>
                      <strong>APMC Mandi Reference:</strong> {matchedBenchmark.crop} —{' '}
                      <strong>₹{matchedBenchmark.pricePerQuintal}/quintal</strong> (₹{matchedBenchmark.pricePerKg}/kg)
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      Source: {matchedBenchmark.market} ({matchedBenchmark.date})
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800 }}>
                  {diffPerQ >= 0 ? (
                    <>
                      <ArrowUpRight size={16} />
                      <span>+₹{diffPerQ}/q Premium</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight size={16} />
                      <span>-₹{Math.abs(diffPerQ)}/q Discount</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Payment & Sale Status */}
            <div className="agri-form-grid agri-form-grid--3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="agri-form-group">
                <label htmlFor={paymentStatusSelectId} className="agri-form-label">
                  Payment Status
                </label>
                <select
                  id={paymentStatusSelectId}
                  className="agri-form-select"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="PAID">Paid in Full</option>
                  <option value="PARTIAL">Partial Payment</option>
                  <option value="PENDING">Pending (Receivable)</option>
                </select>
              </div>

              {paymentStatus === 'PARTIAL' && (
                <div className="agri-form-group">
                  <label htmlFor={paidAmountInputId} className="agri-form-label agri-form-label--required">
                    Amount Paid (₹)
                  </label>
                  <input
                    id={paidAmountInputId}
                    type="number"
                    className="agri-form-input"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    placeholder="e.g. 10000"
                  />
                  <span className="agri-form-help">
                    Balance due: {formatCurrency(computedBalanceDue)}
                  </span>
                  {errors.paidAmount && <span className="agri-form-help text-danger">{errors.paidAmount}</span>}
                </div>
              )}

              <div className="agri-form-group">
                <label htmlFor={saleStatusSelectId} className="agri-form-label">
                  Sale Status
                </label>
                <select
                  id={saleStatusSelectId}
                  className="agri-form-select"
                  value={saleStatus}
                  onChange={(e) => setSaleStatus(e.target.value)}
                >
                  <option value="COMPLETED">Completed</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>

              <div className="agri-form-group">
                <label htmlFor={paymentMethodSelectId} className="agri-form-label">
                  Payment Settlement Method
                </label>
                <select
                  id={paymentMethodSelectId}
                  className="agri-form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT)</option>
                  <option value="RTGS">RTGS Direct</option>
                  <option value="UPI Direct">UPI Direct</option>
                  <option value="Cheque / Clearing">Cheque / Clearing</option>
                  <option value="Cash / Mandi Yard">Cash / Mandi Yard</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="agri-form-group">
              <label htmlFor={notesInputId} className="agri-form-label">
                Contract & Delivery Notes
              </label>
              <textarea
                id={notesInputId}
                className="agri-form-textarea"
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dispatched from granary bay, quality inspection cleared, invoice issued..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="agri-modal-footer">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={availableHarvests.length === 0}
            >
              Complete Sale & Record Revenue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
