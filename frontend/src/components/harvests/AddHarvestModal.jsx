import { useState, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { X, PackageCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../common';
import harvestService from '../../services/harvestService';
import { translateCrop, translateVariety, translateSeason, formatFieldName } from '../../utils/displayLabels';

export default function AddHarvestModal({
  onClose,
  onSave,
  cropCycles = [],
  harvestToEdit = null,
}) {
  const { t } = useTranslation();
  const cropCycleSelectId = useId();
  const dateInputId = useId();
  const expectedYieldId = useId();
  const actualQtyId = useId();
  const qualityGradeId = useId();
  const qualityScoreId = useId();
  const moistureId = useId();
  const storageId = useId();
  const notesId = useId();

  const isEditMode = Boolean(harvestToEdit);

  // Available crop cycles for new harvest
  const eligibleCropCycles = cropCycles.filter(
    (c) => c.status !== 'Completed' && c.status !== 'Failed' && c.status !== 'Cancelled'
  );
  const activeCycleList = eligibleCropCycles.length > 0 ? eligibleCropCycles : cropCycles;

  const defaultCycleId = harvestToEdit?.cropCycleId
    ? String(harvestToEdit.cropCycleId)
    : (activeCycleList[0] ? String(activeCycleList[0].id) : '');

  const [cropCycleId, setCropCycleId] = useState(defaultCycleId);
  const [harvestDate, setHarvestDate] = useState(
    harvestToEdit?.harvestDate || new Date().toISOString().split('T')[0]
  );
  const [expectedYieldKg, setExpectedYieldKg] = useState(
    harvestToEdit?.expectedYieldKg != null ? String(harvestToEdit.expectedYieldKg) : ''
  );
  const [harvestedQuantityKg, setHarvestedQuantityKg] = useState(
    harvestToEdit?.harvestedQuantityKg != null ? String(harvestToEdit.harvestedQuantityKg) : ''
  );
  const [qualityGrade, setQualityGrade] = useState(harvestToEdit?.qualityGrade || 'A');
  const [qualityScore, setQualityScore] = useState(
    harvestToEdit?.qualityScore != null ? String(harvestToEdit.qualityScore) : '85'
  );
  const [moisturePercent, setMoisturePercent] = useState(
    harvestToEdit?.moisturePercent != null ? String(harvestToEdit.moisturePercent) : ''
  );
  const [storageLocation, setStorageLocation] = useState(harvestToEdit?.storageLocation || '');
  const [notes, setNotes] = useState(harvestToEdit?.notes || '');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Selected crop cycle object for contextual display
  const selectedCropCycle = activeCycleList.find((c) => String(c.id) === String(cropCycleId)) || activeCycleList[0];

  const validate = () => {
    const errs = {};
    if (!isEditMode && !cropCycleId) {
      errs.cropCycleId = t('validation.required', 'Please select a crop cycle');
    }
    if (!harvestDate) {
      errs.harvestDate = t('validation.required', 'Harvest date is required');
    }

    const actualQty = Number(harvestedQuantityKg);
    if (harvestedQuantityKg === '' || isNaN(actualQty) || actualQty < 0) {
      errs.harvestedQuantityKg = t('validation.positiveNumber', 'Harvested quantity must be 0 or greater');
    }

    if (expectedYieldKg !== '') {
      const expYield = Number(expectedYieldKg);
      if (isNaN(expYield) || expYield < 0) {
        errs.expectedYieldKg = t('validation.positiveNumber', 'Expected yield must be 0 or greater');
      }
    }

    if (qualityScore !== '') {
      const score = Number(qualityScore);
      if (isNaN(score) || score < 0 || score > 100) {
        errs.qualityScore = t('validation.range', 'Score must be between 0 and 100');
      }
    }

    if (moisturePercent !== '') {
      const moisture = Number(moisturePercent);
      if (isNaN(moisture) || moisture < 0 || moisture > 100) {
        errs.moisturePercent = t('validation.range', 'Moisture must be between 0 and 100%');
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const actual = Number(harvestedQuantityKg);
    const status = actual === 0 ? 'PLANNED' : 'HARVESTED';

    const payload = {
      harvestDate,
      harvestedQuantityKg: actual,
      expectedYieldKg: expectedYieldKg !== '' ? Number(expectedYieldKg) : null,
      availableQuantityKg: isEditMode && harvestToEdit?.availableQuantityKg != null
        ? harvestToEdit.availableQuantityKg
        : actual,
      soldQuantityKg: isEditMode && harvestToEdit?.soldQuantityKg != null
        ? harvestToEdit.soldQuantityKg
        : 0,
      qualityGrade: qualityGrade || 'A',
      qualityScore: qualityScore !== '' ? Number(qualityScore) : null,
      moisturePercent: moisturePercent !== '' ? Number(moisturePercent) : null,
      status: isEditMode ? harvestToEdit.status : status,
      storageLocation: storageLocation ? storageLocation.trim() : null,
      notes: notes ? notes.trim() : null,
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let result;
      if (isEditMode) {
        result = await harvestService.updateHarvest(harvestToEdit.id, payload);
      } else {
        result = await harvestService.createHarvest(Number(cropCycleId), payload);
      }
      onSave(result, isEditMode);
      onClose();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || t('common.error', 'An error occurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasNoCycles = !isEditMode && activeCycleList.length === 0;

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-harvest-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="agri-modal-dialog agri-modal-dialog--lg">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontSize: '0.75rem', fontWeight: 600 }}>
              <PackageCheck size={14} />
              <span>{t('harvests.intakeLogging', 'Produce Intake & Logging')}</span>
            </div>
            <h3 id="add-harvest-title" className="agri-modal-title">
              {isEditMode ? t('harvests.editHarvest', 'Edit Harvest Record') : t('harvests.addHarvest', 'Record New Harvest')}
            </h3>
            <p className="agri-modal-subtitle">
              {t('harvests.intakeSubtitle', 'Enter harvested lot metrics, quality evaluation, and granary storage allocation.')}
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
            {/* Warning if no crop cycles exist */}
            {hasNoCycles && (
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
                <span>{t('harvests.noCropCycles', 'No active crop cycles available. Please register and plant a crop cycle first.')}</span>
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

            {/* Standing Crop Cycle Selection */}
            {!isEditMode ? (
              <div className="agri-form-group">
                <label htmlFor={cropCycleSelectId} className="agri-form-label agri-form-label--required">
                  {t('crops.cropCycle', 'Standing Crop Cycle')}
                </label>
                <select
                  id={cropCycleSelectId}
                  className="agri-form-select"
                  value={cropCycleId}
                  onChange={(e) => setCropCycleId(e.target.value)}
                  disabled={hasNoCycles || isSubmitting}
                >
                  {activeCycleList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {translateCrop(c.cropName, t)} ({translateVariety(c.variety, t)}) — {c.fieldName || c.farmName || `Cycle #${c.id}`} [{translateSeason(c.season, t)}]
                    </option>
                  ))}
                </select>
                {errors.cropCycleId && <span className="agri-form-help text-danger">{errors.cropCycleId}</span>}
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--slate-200)', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--slate-700)' }}>
                  {translateCrop(harvestToEdit.cropName, t)} ({translateVariety(harvestToEdit.variety, t)})
                </span>
                <div style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>
                  {harvestToEdit.farmName} • {formatFieldName(harvestToEdit.fieldName, t)}
                </div>
              </div>
            )}

            {/* Crop Info Preview if new */}
            {!isEditMode && selectedCropCycle && (
              <div
                style={{
                  backgroundColor: 'var(--slate-50)',
                  padding: '0.625rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--slate-200)',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  color: 'var(--slate-600)',
                }}
              >
                <div>
                  <strong>{t('farms.farm', 'Farm')}:</strong> {selectedCropCycle.farmName || '—'}
                </div>
                <div>
                  <strong>{t('fields.field', 'Field')}:</strong> {selectedCropCycle.fieldName || '—'}
                </div>
                <div>
                  <strong>{t('crops.season', 'Season')}:</strong> {translateSeason(selectedCropCycle.season, t) || '—'}
                </div>
              </div>
            )}

            {/* Harvest Date, Expected Yield, Actual Yield */}
            <div className="agri-form-grid agri-form-grid--3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="agri-form-group">
                <label htmlFor={dateInputId} className="agri-form-label agri-form-label--required">
                  {t('harvests.harvestDate', 'Harvest Date')}
                </label>
                <input
                  id={dateInputId}
                  type="date"
                  className="agri-form-input"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.harvestDate && <span className="agri-form-help text-danger">{errors.harvestDate}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={expectedYieldId} className="agri-form-label">
                  {t('crops.expectedYield', 'Expected Yield')} (kg)
                </label>
                <input
                  id={expectedYieldId}
                  type="number"
                  className="agri-form-input"
                  value={expectedYieldKg}
                  onChange={(e) => setExpectedYieldKg(e.target.value)}
                  min="0"
                  placeholder="e.g. 2500"
                  disabled={isSubmitting}
                />
                {errors.expectedYieldKg && <span className="agri-form-help text-danger">{errors.expectedYieldKg}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={actualQtyId} className="agri-form-label agri-form-label--required">
                  {t('harvests.harvestQuantity', 'Harvested Qty')} (kg)
                </label>
                <input
                  id={actualQtyId}
                  type="number"
                  className="agri-form-input"
                  value={harvestedQuantityKg}
                  onChange={(e) => setHarvestedQuantityKg(e.target.value)}
                  min="0"
                  placeholder="e.g. 2400"
                  disabled={isSubmitting}
                />
                <span className="agri-form-help">
                  {(Number(harvestedQuantityKg || 0) / 100).toFixed(1)} {t('units.quintals', 'quintals')}
                </span>
                {errors.harvestedQuantityKg && <span className="agri-form-help text-danger">{errors.harvestedQuantityKg}</span>}
              </div>
            </div>

            {/* Quality Grade, Score, Moisture */}
            <div className="agri-form-grid agri-form-grid--3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="agri-form-group">
                <label htmlFor={qualityGradeId} className="agri-form-label">
                  {t('harvests.quality', 'Quality Grade')}
                </label>
                <select
                  id={qualityGradeId}
                  className="agri-form-select"
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="A">{t('harvests.gradeA', 'Grade A (Premium)')}</option>
                  <option value="B">{t('harvests.gradeB', 'Grade B (Standard)')}</option>
                  <option value="C">{t('harvests.gradeC', 'Grade C (Commercial)')}</option>
                </select>
              </div>

              <div className="agri-form-group">
                <label htmlFor={qualityScoreId} className="agri-form-label">
                  {t('harvests.qualityScore', 'Quality Score')} (0-100)
                </label>
                <input
                  id={qualityScoreId}
                  type="number"
                  className="agri-form-input"
                  value={qualityScore}
                  onChange={(e) => setQualityScore(e.target.value)}
                  min="0"
                  max="100"
                  disabled={isSubmitting}
                />
                {errors.qualityScore && <span className="agri-form-help text-danger">{errors.qualityScore}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={moistureId} className="agri-form-label">
                  {t('harvests.moisturePercent', 'Moisture (%)')}
                </label>
                <input
                  id={moistureId}
                  type="number"
                  step="0.1"
                  className="agri-form-input"
                  value={moisturePercent}
                  onChange={(e) => setMoisturePercent(e.target.value)}
                  placeholder="e.g. 11.5"
                  disabled={isSubmitting}
                />
                {errors.moisturePercent && <span className="agri-form-help text-danger">{errors.moisturePercent}</span>}
              </div>
            </div>

            {/* Storage Location */}
            <div className="agri-form-group">
              <label htmlFor={storageId} className="agri-form-label">
                {t('harvests.storageLocation', 'Storage Allocation')}
              </label>
              <input
                id={storageId}
                type="text"
                className="agri-form-input"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                placeholder="e.g. Central Granary - Silo #1"
                disabled={isSubmitting}
              />
            </div>

            {/* Notes */}
            <div className="agri-form-group">
              <label htmlFor={notesId} className="agri-form-label">
                {t('harvests.observations', 'Field & Grain Inspection Notes')}
              </label>
              <textarea
                id={notesId}
                className="agri-form-textarea"
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Record observation notes, grain color, drying status..."
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
              disabled={hasNoCycles || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t('harvests.saving', 'Recording Harvest...')}</span>
                </>
              ) : (
                <span>{isEditMode ? t('common.save', 'Save Changes') : t('common.save', 'Save Harvest Record')}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
