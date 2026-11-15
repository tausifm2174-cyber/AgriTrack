import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertCircle, Loader2, Info } from 'lucide-react';
import { Button } from '../common';
import { cropLifecycleStages, cropTypes } from '../../data/cropData';
import cropService from '../../services/cropService';

/**
 * AddCropModal component
 * Handles registering a new crop cycle or editing an existing crop cycle backed by REST APIs.
 * Includes farm -> field dependent filtering and validation.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Modal close handler
 * @param {Function} props.onCropSaved - Callback invoked when crop is added or edited
 * @param {Array} props.farms - List of farms
 * @param {Array} props.fields - List of fields
 * @param {Object} [props.cropToEdit] - Existing crop object if in edit mode
 * @param {string|number} [props.defaultFarmId] - Optional pre-selected farm ID
 * @param {string|number} [props.defaultFieldId] - Optional pre-selected field ID
 */
export default function AddCropModal({
  isOpen,
  onClose,
  onCropSaved,
  farms = [],
  fields = [],
  cropToEdit = null,
  defaultFarmId = '',
  defaultFieldId = '',
}) {
  const { t } = useTranslation();
  const isEditMode = Boolean(cropToEdit);

  // Compute initial farm and fields using string comparison for numeric IDs
  const initialFarmId = cropToEdit?.farmId || defaultFarmId || (farms.length > 0 ? farms[0].id : '');
  const initialFieldsForFarm = fields.filter((f) => String(f.farmId) === String(initialFarmId));
  const initialFieldId = cropToEdit?.fieldId || defaultFieldId || (initialFieldsForFarm.length > 0 ? initialFieldsForFarm[0].id : '');

  const [formData, setFormData] = useState({
    farmId: initialFarmId,
    fieldId: initialFieldId,
    cropName: cropToEdit?.cropName || (cropTypes.length > 0 ? cropTypes[0] : 'Wheat'),
    variety: cropToEdit?.variety || '',
    season: cropToEdit?.season || 'Rabi',
    sowingDate: cropToEdit?.sowingDate || new Date().toISOString().split('T')[0],
    expectedHarvestDate: cropToEdit?.expectedHarvestDate || '',
    actualHarvestDate: cropToEdit?.actualHarvestDate || '',
    initialStage: cropToEdit?.currentStage || 'Sowing',
    progressPercent: cropToEdit?.progressPercent != null ? cropToEdit.progressPercent : null,
    notes: cropToEdit?.notes || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  if (!isOpen) return null;

  // Filter available fields based on selected farm
  const availableFields = fields.filter((f) => String(f.farmId) === String(formData.farmId));

  // Handle farm change: also auto-update fieldId to first available field in that farm
  const handleFarmChange = (e) => {
    const newFarmId = e.target.value;
    const matchingFields = fields.filter((f) => String(f.farmId) === String(newFarmId));
    setFormData((prev) => ({
      ...prev,
      farmId: newFarmId,
      fieldId: matchingFields.length > 0 ? matchingFields[0].id : '',
    }));
    if (errors.farmId) {
      setErrors((prev) => ({ ...prev, farmId: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.farmId) newErrors.farmId = t('validation.required', 'Farm holding is required');
    if (!formData.fieldId) newErrors.fieldId = t('validation.required', 'Field parcel is required');
    if (!formData.cropName.trim()) newErrors.cropName = t('validation.required', 'Crop name is required');
    if (!formData.variety.trim()) newErrors.variety = t('validation.required', 'Crop variety is required');
    if (!formData.sowingDate) newErrors.sowingDate = t('validation.required', 'Sowing date is required');
    if (!formData.expectedHarvestDate) newErrors.expectedHarvestDate = t('validation.required', 'Expected harvest date is required');

    if (formData.sowingDate && formData.expectedHarvestDate) {
      if (new Date(formData.expectedHarvestDate) < new Date(formData.sowingDate)) {
        newErrors.expectedHarvestDate = t('validation.dateAfter', 'Harvest date cannot be before sowing date');
      }
    }

    if (formData.sowingDate && formData.actualHarvestDate) {
      if (new Date(formData.actualHarvestDate) < new Date(formData.sowingDate)) {
        newErrors.actualHarvestDate = t('validation.dateAfter', 'Actual harvest date cannot be before sowing date');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Resolve stage step & default progress
    let stageStep = 1;
    let defaultProgress = 15;

    if (formData.initialStage === 'Sowing') {
      stageStep = 1;
      defaultProgress = 15;
    } else if (formData.initialStage === 'Vegetative Growth') {
      stageStep = 2;
      defaultProgress = 45;
    } else if (formData.initialStage === 'Flowering') {
      stageStep = 3;
      defaultProgress = 65;
    } else if (formData.initialStage === 'Ripening') {
      stageStep = 4;
      defaultProgress = 85;
    } else if (formData.initialStage === 'Harvest Readiness') {
      stageStep = 5;
      defaultProgress = 100;
    }

    // Preserve existing progress if editing and valid, otherwise use stage default
    const progress = formData.progressPercent != null ? Number(formData.progressPercent) : defaultProgress;
    const status = isEditMode && cropToEdit?.status
      ? cropToEdit.status
      : (formData.initialStage === 'Harvest Readiness' ? 'Near Harvest' : 'Active');

    const payload = {
      cropName: formData.cropName.trim(),
      variety: formData.variety.trim(),
      season: formData.season,
      sowingDate: formData.sowingDate,
      expectedHarvestDate: formData.expectedHarvestDate,
      actualHarvestDate: formData.actualHarvestDate || null,
      currentStage: formData.initialStage,
      currentStageStep: stageStep,
      progressPercent: progress,
      status,
      notes: formData.notes ? formData.notes.trim() : null,
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (isEditMode) {
        const updatedCycle = await cropService.updateCropCycle(cropToEdit.id, payload);
        onCropSaved?.(updatedCycle, true);
      } else {
        const createdCycle = await cropService.createCropCycle(formData.fieldId, payload);
        onCropSaved?.(createdCycle, false);
      }
      onClose();
    } catch (err) {
      setSubmitError(err.message || t('common.error', 'Failed to save crop cycle. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasNoFarms = farms.length === 0;
  const hasNoFields = fields.length === 0;

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-crop-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        <div className="agri-modal-header">
          <div>
            <h3 id="add-crop-title" className="agri-modal-title">
              {isEditMode ? t('crops.editCrop', 'Edit Crop Cycle') : t('crops.addCrop', 'Add New Crop Cycle')}
            </h3>
            <p className="agri-modal-subtitle">
              {isEditMode
                ? t('crops.subtitle', 'Update planting details and lifecycle phase for this crop')
                : t('crops.subtitle', 'Assign a new crop variety to a cultivated field parcel')}
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label={t('common.close', 'Close dialog')}
            disabled={isSubmitting}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {hasNoFarms || hasNoFields ? (
          <div className="agri-modal-body" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <Info size={40} className="text-muted" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
              {hasNoFarms
                ? t('fields.noFarmsTitle', 'No Farm Holdings Found')
                : t('crops.noFieldsForFarm', 'No field parcels available')}
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {t('crops.noFarmsOrFields', 'No field parcels available. Please register a farm holding and map field plots before adding crop cycles.')}
            </p>
            <Button variant="secondary" onClick={onClose}>
              {t('common.close', 'Close')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="agri-modal-body">
              {submitError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    backgroundColor: '#fef2f2',
                    color: '#b91c1c',
                    border: '1px solid #fecaca',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="agri-form-grid">
                {/* Row 1: Farm and Field Dependent Dropdown */}
                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="crop-farm" className="agri-form-label agri-form-label--required">
                      {t('fields.farm', 'Farm Holding')}
                    </label>
                    <select
                      id="crop-farm"
                      name="farmId"
                      className={`agri-form-select ${errors.farmId ? 'agri-form-input--error' : ''}`}
                      value={formData.farmId}
                      onChange={handleFarmChange}
                      required
                      disabled={isEditMode || isSubmitting}
                    >
                      {farms.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                    {errors.farmId && <span className="agri-form-error">{errors.farmId}</span>}
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="crop-field" className="agri-form-label agri-form-label--required">
                      {t('fields.fieldName', 'Field Parcel')}
                    </label>
                    <select
                      id="crop-field"
                      name="fieldId"
                      className={`agri-form-select ${errors.fieldId ? 'agri-form-input--error' : ''}`}
                      value={formData.fieldId}
                      onChange={handleChange}
                      required
                      disabled={isEditMode || isSubmitting}
                    >
                      {availableFields.length === 0 ? (
                        <option value="">{t('fields.noFields', 'No fields available for this farm')}</option>
                      ) : (
                        availableFields.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} ({f.areaAcres || f.area} {t('units.acres', 'Ac')})
                          </option>
                        ))
                      )}
                    </select>
                    {errors.fieldId && <span className="agri-form-error">{errors.fieldId}</span>}
                  </div>
                </div>

                {/* Row 2: Crop Name & Variety */}
                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="crop-name" className="agri-form-label agri-form-label--required">
                      {t('crops.cropName', 'Crop Name')}
                    </label>
                    <input
                      id="crop-name"
                      name="cropName"
                      type="text"
                      list="crop-options"
                      required
                      placeholder="e.g. Wheat, Maize, Mustard"
                      className={`agri-form-input ${errors.cropName ? 'agri-form-input--error' : ''}`}
                      value={formData.cropName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    <datalist id="crop-options">
                      {cropTypes.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                    {errors.cropName && <span className="agri-form-error">{errors.cropName}</span>}
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="crop-variety" className="agri-form-label agri-form-label--required">
                      {t('crops.variety', 'Variety / Hybrid')}
                    </label>
                    <input
                      id="crop-variety"
                      name="variety"
                      type="text"
                      required
                      placeholder="e.g. Sharbati, Pusa Bold"
                      className={`agri-form-input ${errors.variety ? 'agri-form-input--error' : ''}`}
                      value={formData.variety}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {errors.variety && <span className="agri-form-error">{errors.variety}</span>}
                  </div>
                </div>

                {/* Row 3: Season & Initial Stage */}
                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="crop-season" className="agri-form-label agri-form-label--required">
                      {t('crops.season', 'Agricultural Season')}
                    </label>
                    <select
                      id="crop-season"
                      name="season"
                      className="agri-form-select"
                      value={formData.season}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="Rabi">{t('crops.rabi', 'Rabi')}</option>
                      <option value="Kharif">{t('crops.kharif', 'Kharif')}</option>
                      <option value="Zaid">{t('crops.zaid', 'Zaid')}</option>
                    </select>
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="crop-stage" className="agri-form-label agri-form-label--required">
                      {t('crops.currentStage', 'Lifecycle Stage')}
                    </label>
                    <select
                      id="crop-stage"
                      name="initialStage"
                      className="agri-form-select"
                      value={formData.initialStage}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      {cropLifecycleStages.map((stage) => (
                        <option key={stage.id} value={stage.name}>
                          {stage.step}. {stage.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 4: Sowing Date & Expected Harvest */}
                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="crop-sowing" className="agri-form-label agri-form-label--required">
                      {t('crops.sowingDate', 'Sowing Date')}
                    </label>
                    <input
                      id="crop-sowing"
                      name="sowingDate"
                      type="date"
                      required
                      className={`agri-form-input ${errors.sowingDate ? 'agri-form-input--error' : ''}`}
                      value={formData.sowingDate}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {errors.sowingDate && <span className="agri-form-error">{errors.sowingDate}</span>}
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="crop-harvest" className="agri-form-label agri-form-label--required">
                      {t('crops.expectedHarvest', 'Expected Harvest Date')}
                    </label>
                    <input
                      id="crop-harvest"
                      name="expectedHarvestDate"
                      type="date"
                      required
                      className={`agri-form-input ${errors.expectedHarvestDate ? 'agri-form-input--error' : ''}`}
                      value={formData.expectedHarvestDate}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {errors.expectedHarvestDate && (
                      <span className="agri-form-error">{errors.expectedHarvestDate}</span>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="agri-form-group">
                  <label htmlFor="crop-notes" className="agri-form-label">
                    {t('common.notes', 'Agronomic Notes & Seed Treatments')}
                  </label>
                  <textarea
                    id="crop-notes"
                    name="notes"
                    rows="2"
                    placeholder="Enter seed batch, fertility inputs, or irrigation arrangements..."
                    className="agri-form-textarea"
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="agri-modal-footer">
              <Button variant="secondary" onClick={onClose} type="button" disabled={isSubmitting}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{t('crops.saving', 'Saving Crop Cycle...')}</span>
                  </>
                ) : (
                  isEditMode ? t('common.update', 'Update Crop') : t('crops.addCrop', 'Save Crop Cycle')
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
