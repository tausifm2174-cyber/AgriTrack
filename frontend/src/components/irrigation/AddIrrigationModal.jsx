import { useState, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, Edit3, AlertCircle, Droplets, Loader2 } from 'lucide-react';
import { Button } from '../common';
import {
  IRRIGATION_METHODS,
  IRRIGATION_STATUSES,
  IRRIGATION_PRIORITIES,
} from '../../data/irrigationData';
import irrigationService from '../../services/irrigationService';

/**
 * IrrigationFormContent Component
 * Key-based reset component avoiding setState inside effect.
 */
function IrrigationFormContent({
  scheduleToEdit,
  farms = [],
  fields = [],
  crops = [],
  onSave,
  onClose,
}) {
  const { t } = useTranslation();
  const isEditMode = Boolean(scheduleToEdit);

  // Accessible unique IDs
  const titleId = useId();
  const farmSelectId = useId();
  const fieldSelectId = useId();
  const cropSelectId = useId();
  const methodId = useId();
  const dateId = useId();
  const timeId = useId();
  const durationId = useId();
  const volumeId = useId();
  const priorityId = useId();
  const statusId = useId();
  const moistureId = useId();
  const rainfallId = useId();
  const weatherCondId = useId();
  const notesId = useId();

  // Initial defaults
  const defaultFarmId = farms[0]?.id ? String(farms[0].id) : '';
  const initialFieldsForDefault = fields.filter((f) => String(f.farmId) === defaultFarmId);
  const defaultFieldId = initialFieldsForDefault[0]?.id ? String(initialFieldsForDefault[0].id) : '';

  // Form State
  const [formData, setFormData] = useState(() => {
    if (scheduleToEdit) {
      return {
        title: scheduleToEdit.title || '',
        farmId: scheduleToEdit.farmId ? String(scheduleToEdit.farmId) : defaultFarmId,
        fieldId: scheduleToEdit.fieldId ? String(scheduleToEdit.fieldId) : defaultFieldId,
        cropCycleId: scheduleToEdit.cropCycleId ? String(scheduleToEdit.cropCycleId) : '',
        irrigationMethod: scheduleToEdit.irrigationMethod || 'Drip',
        scheduledDate: scheduleToEdit.scheduledDate || new Date().toISOString().split('T')[0],
        scheduledTime: scheduleToEdit.scheduledTime || '04:00 PM',
        durationMinutes: scheduleToEdit.durationMinutes !== undefined && scheduleToEdit.durationMinutes !== null ? String(scheduleToEdit.durationMinutes) : '45',
        waterVolumeLitres: scheduleToEdit.waterVolumeLitres !== undefined && scheduleToEdit.waterVolumeLitres !== null ? String(scheduleToEdit.waterVolumeLitres) : '',
        priority: scheduleToEdit.priority || 'Medium',
        status: scheduleToEdit.status || 'Scheduled',
        soilMoisture: scheduleToEdit.soilMoisture !== undefined && scheduleToEdit.soilMoisture !== null ? String(scheduleToEdit.soilMoisture) : '',
        rainfallExpected: scheduleToEdit.rainfallExpected !== undefined && scheduleToEdit.rainfallExpected !== null ? String(scheduleToEdit.rainfallExpected) : '',
        weatherCondition: scheduleToEdit.weatherCondition || '',
        notes: scheduleToEdit.notes || '',
      };
    }
    return {
      title: '',
      farmId: defaultFarmId,
      fieldId: defaultFieldId,
      cropCycleId: '',
      irrigationMethod: 'Drip',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '04:00 PM',
      durationMinutes: '45',
      waterVolumeLitres: '',
      priority: 'Medium',
      status: 'Scheduled',
      soilMoisture: '',
      rainfallExpected: '',
      weatherCondition: '',
      notes: '',
    };
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Cascading fields for the current farm
  const availableFields = fields.filter((f) => String(f.farmId) === String(formData.farmId));

  // Crops filtered by currently selected field
  const availableCrops = crops.filter((c) => String(c.fieldId) === String(formData.fieldId));

  // Farm change handler
  const handleFarmChange = (e) => {
    const newFarmId = e.target.value;
    const newFields = fields.filter((f) => String(f.farmId) === String(newFarmId));
    const newField = newFields[0];

    setFormData((prev) => ({
      ...prev,
      farmId: newFarmId,
      fieldId: newField ? String(newField.id) : '',
      cropCycleId: '',
    }));

    if (errors.farmId) setErrors((prev) => ({ ...prev, farmId: null }));
    if (errors.fieldId && newField) setErrors((prev) => ({ ...prev, fieldId: null }));
  };

  // Field change handler
  const handleFieldChange = (e) => {
    const newFieldId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      fieldId: newFieldId,
      cropCycleId: '',
    }));

    if (errors.fieldId) setErrors((prev) => ({ ...prev, fieldId: null }));
  };

  // Standard input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t('validation.required');
    }
    if (!formData.farmId) {
      newErrors.farmId = t('validation.selectFarm', 'Please select a farm holding.');
    }
    if (!formData.fieldId) {
      newErrors.fieldId = t('validation.selectField', 'Please select a field parcel.');
    } else if (formData.farmId) {
      const fieldObj = fields.find((f) => String(f.id) === String(formData.fieldId));
      if (fieldObj && String(fieldObj.farmId) !== String(formData.farmId)) {
        newErrors.fieldId = t('validation.invalidField', 'Selected field does not belong to this farm.');
      }
    }

    if (formData.cropCycleId && formData.fieldId) {
      const cropObj = crops.find((c) => String(c.id) === String(formData.cropCycleId));
      if (cropObj && String(cropObj.fieldId) !== String(formData.fieldId)) {
        newErrors.cropCycleId = t('validation.invalidCrop', 'Selected crop does not belong to this field.');
      }
    }
    if (!formData.irrigationMethod) {
      newErrors.irrigationMethod = t('validation.required');
    }
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = t('validation.enterValidDate');
    }
    if (!formData.status) {
      newErrors.status = t('validation.required');
    }

    // Number validations
    const durationNum = Number(formData.durationMinutes);
    if (!formData.durationMinutes || isNaN(durationNum) || durationNum <= 0) {
      newErrors.durationMinutes = t('validation.enterValidNumber');
    }

    if (formData.waterVolumeLitres !== '') {
      const volumeNum = Number(formData.waterVolumeLitres);
      if (isNaN(volumeNum) || volumeNum < 0) {
        newErrors.waterVolumeLitres = t('validation.enterValidQuantity');
      }
    }

    if (formData.soilMoisture !== '') {
      const moistNum = Number(formData.soilMoisture);
      if (isNaN(moistNum) || moistNum < 0 || moistNum > 100) {
        newErrors.soilMoisture = t('validation.enterValidNumber');
      }
    }

    if (formData.rainfallExpected !== '') {
      const rainNum = Number(formData.rainfallExpected);
      if (isNaN(rainNum) || rainNum < 0) {
        newErrors.rainfallExpected = t('validation.enterValidNumber');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      title: formData.title.trim(),
      irrigationMethod: formData.irrigationMethod,
      status: formData.status || 'Scheduled',
      priority: formData.priority || 'Medium',
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime ? formData.scheduledTime.trim() : null,
      durationMinutes: Number(formData.durationMinutes),
      waterVolumeLitres: formData.waterVolumeLitres !== '' ? Number(formData.waterVolumeLitres) : null,
      soilMoisture: formData.soilMoisture !== '' ? Number(formData.soilMoisture) : null,
      weatherCondition: formData.weatherCondition ? formData.weatherCondition.trim() : null,
      rainfallExpected: formData.rainfallExpected !== '' ? Number(formData.rainfallExpected) : null,
      completedAt: formData.status === 'Completed'
        ? (scheduleToEdit?.completedAt || new Date().toISOString().split('.')[0])
        : null,
      notes: formData.notes ? formData.notes.trim() : null,
      cropCycleId: formData.cropCycleId ? Number(formData.cropCycleId) : null,
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let result;
      if (isEditMode) {
        result = await irrigationService.updateIrrigation(scheduleToEdit.id, payload);
      } else {
        result = await irrigationService.createIrrigation(Number(formData.fieldId), payload);
      }
      onSave(result, isEditMode);
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasNoFarms = farms.length === 0;
  const hasNoFields = fields.length === 0;
  const selectedFarmHasNoFields = Boolean(formData.farmId && availableFields.length === 0);
  const prerequisiteMissing = hasNoFarms || hasNoFields || selectedFarmHasNoFields;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="agri-modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
        {hasNoFarms && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--warning-bg, #fffbeb)',
              border: '1px solid var(--warning-border, #fef3c7)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--warning-text, #92400e)',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={18} aria-hidden="true" />
            <span>{t('irrigation.noFarms', 'No farms available. Create a farm before scheduling irrigation.')}</span>
          </div>
        )}

        {!hasNoFarms && (hasNoFields || selectedFarmHasNoFields) && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--warning-bg, #fffbeb)',
              border: '1px solid var(--warning-border, #fef3c7)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--warning-text, #92400e)',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={18} aria-hidden="true" />
            <span>
              {selectedFarmHasNoFields
                ? t('irrigation.noFieldsForFarm', 'No fields available for this farm. Create a field first.')
                : t('irrigation.noFields', 'No fields available. Create a field first.')}
            </span>
          </div>
        )}

        {submitError && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--danger-bg, #fef2f2)',
              border: '1px solid var(--danger-border, #fecaca)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--danger-text, #991b1b)',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={18} aria-hidden="true" />
            <span>{submitError}</span>
          </div>
        )}

        <div className="agri-form-grid">
          {/* Title */}
          <div className="agri-form-group agri-form-group--full">
            <label htmlFor={titleId} className="agri-form-label agri-form-label--required">
              {t('irrigation.title')}
            </label>
            <input
              id={titleId}
              name="title"
              type="text"
              placeholder="e.g., Block A Morning Drip Pulse"
              className={`agri-form-input ${errors.title ? 'agri-form-input--error' : ''}`}
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.title && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.title}
              </span>
            )}
          </div>

          {/* Farm Selection */}
          <div className="agri-form-group">
            <label htmlFor={farmSelectId} className="agri-form-label agri-form-label--required">
              {t('navigation.farms')}
            </label>
            <select
              id={farmSelectId}
              name="farmId"
              className={`agri-form-select ${errors.farmId ? 'agri-form-select--error' : ''}`}
              value={formData.farmId}
              onChange={handleFarmChange}
              disabled={isSubmitting || hasNoFarms}
            >
              <option value="">-- {t('navigation.farms')} --</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name || f.farmName || `Farm #${f.id}`}
                </option>
              ))}
            </select>
            {errors.farmId && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.farmId}
              </span>
            )}
          </div>

          {/* Field Selection (Cascading child) */}
          <div className="agri-form-group">
            <label htmlFor={fieldSelectId} className="agri-form-label agri-form-label--required">
              {t('navigation.fields')}
            </label>
            <select
              id={fieldSelectId}
              name="fieldId"
              className={`agri-form-select ${errors.fieldId ? 'agri-form-select--error' : ''}`}
              value={formData.fieldId}
              onChange={handleFieldChange}
              disabled={isSubmitting || availableFields.length === 0}
            >
              <option value="">
                {availableFields.length === 0 && formData.farmId
                  ? `-- ${t('irrigation.noFieldsForFarm', 'No fields available for this farm')} --`
                  : `-- ${t('navigation.fields')} --`}
              </option>
              {availableFields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name || f.fieldName || `Field #${f.id}`}
                </option>
              ))}
            </select>
            {errors.fieldId && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.fieldId}
              </span>
            )}
          </div>

          {/* Crop Selection (Optional) */}
          <div className="agri-form-group">
            <label htmlFor={cropSelectId} className="agri-form-label">
              {t('crops.cropName')}
            </label>
            <select
              id={cropSelectId}
              name="cropCycleId"
              className="agri-form-select"
              value={formData.cropCycleId}
              onChange={handleChange}
              disabled={isSubmitting || !formData.fieldId}
            >
              <option value="">{t('irrigation.generalFieldIrrigation', 'General Field Irrigation (No Crop)')}</option>
              {availableCrops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.cropName || c.name} {c.variety ? `(${c.variety})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Irrigation Method */}
          <div className="agri-form-group">
            <label htmlFor={methodId} className="agri-form-label agri-form-label--required">
              {t('irrigation.method')}
            </label>
            <select
              id={methodId}
              name="irrigationMethod"
              className={`agri-form-select ${errors.irrigationMethod ? 'agri-form-select--error' : ''}`}
              value={formData.irrigationMethod}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              {IRRIGATION_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.irrigationMethod && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.irrigationMethod}
              </span>
            )}
          </div>

          {/* Scheduled Date */}
          <div className="agri-form-group">
            <label htmlFor={dateId} className="agri-form-label agri-form-label--required">
              {t('irrigation.irrigationDate')}
            </label>
            <input
              id={dateId}
              name="scheduledDate"
              type="date"
              className={`agri-form-input ${errors.scheduledDate ? 'agri-form-input--error' : ''}`}
              value={formData.scheduledDate}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.scheduledDate && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.scheduledDate}
              </span>
            )}
          </div>

          {/* Scheduled Time */}
          <div className="agri-form-group">
            <label htmlFor={timeId} className="agri-form-label">
              {t('common.time')}
            </label>
            <input
              id={timeId}
              name="scheduledTime"
              type="text"
              placeholder="e.g., 04:00 PM"
              className="agri-form-input"
              value={formData.scheduledTime}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Duration in Minutes */}
          <div className="agri-form-group">
            <label htmlFor={durationId} className="agri-form-label agri-form-label--required">
              {t('irrigation.duration')} ({t('units.minutes', 'min')})
            </label>
            <input
              id={durationId}
              name="durationMinutes"
              type="number"
              min="1"
              placeholder="e.g., 45"
              className={`agri-form-input ${errors.durationMinutes ? 'agri-form-input--error' : ''}`}
              value={formData.durationMinutes}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.durationMinutes && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.durationMinutes}
              </span>
            )}
          </div>

          {/* Water Volume (Litres) */}
          <div className="agri-form-group">
            <label htmlFor={volumeId} className="agri-form-label">
              {t('irrigation.waterQuantity')} ({t('units.liters')})
            </label>
            <input
              id={volumeId}
              name="waterVolumeLitres"
              type="number"
              min="0"
              placeholder="e.g., 15000"
              className={`agri-form-input ${errors.waterVolumeLitres ? 'agri-form-input--error' : ''}`}
              value={formData.waterVolumeLitres}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.waterVolumeLitres && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.waterVolumeLitres}
              </span>
            )}
          </div>

          {/* Priority */}
          <div className="agri-form-group">
            <label htmlFor={priorityId} className="agri-form-label">
              {t('activities.priority', 'Priority')}
            </label>
            <select
              id={priorityId}
              name="priority"
              className="agri-form-select"
              value={formData.priority}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              {IRRIGATION_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="agri-form-group">
            <label htmlFor={statusId} className="agri-form-label agri-form-label--required">
              {t('common.status')}
            </label>
            <select
              id={statusId}
              name="status"
              className={`agri-form-select ${errors.status ? 'agri-form-select--error' : ''}`}
              value={formData.status}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              {IRRIGATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.status}
              </span>
            )}
          </div>

          {/* Soil Moisture (%) */}
          <div className="agri-form-group">
            <label htmlFor={moistureId} className="agri-form-label">
              {t('soil.title')} (%)
            </label>
            <input
              id={moistureId}
              name="soilMoisture"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="e.g., 38"
              className={`agri-form-input ${errors.soilMoisture ? 'agri-form-input--error' : ''}`}
              value={formData.soilMoisture}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.soilMoisture && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.soilMoisture}
              </span>
            )}
          </div>

          {/* Weather Condition */}
          <div className="agri-form-group">
            <label htmlFor={weatherCondId} className="agri-form-label">
              {t('navigation.weather')}
            </label>
            <input
              id={weatherCondId}
              name="weatherCondition"
              type="text"
              placeholder="e.g., Sunny, Partly Cloudy"
              className="agri-form-input"
              value={formData.weatherCondition}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Expected Rainfall (mm) */}
          <div className="agri-form-group">
            <label htmlFor={rainfallId} className="agri-form-label">
              {t('dashboard.rainfall')} ({t('units.mm')})
            </label>
            <input
              id={rainfallId}
              name="rainfallExpected"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g., 0"
              className={`agri-form-input ${errors.rainfallExpected ? 'agri-form-input--error' : ''}`}
              value={formData.rainfallExpected}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.rainfallExpected && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.rainfallExpected}
              </span>
            )}
          </div>

          {/* Notes */}
          <div className="agri-form-group agri-form-group--full">
            <label htmlFor={notesId} className="agri-form-label">
              {t('activities.notes')}
            </label>
            <textarea
              id={notesId}
              name="notes"
              rows={2}
              placeholder="Notes on pump pressure, fertilizer inject, or soil condition..."
              className="agri-form-textarea"
              value={formData.notes}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Modal Actions Footer */}
      <div className="agri-modal-footer">
        <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button variant="primary" size="sm" type="submit" disabled={isSubmitting || prerequisiteMissing}>
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="agri-animate-spin" aria-hidden="true" />
              <span>{t('irrigation.saving', 'Saving schedule...')}</span>
            </>
          ) : (
            <>
              <Check size={14} aria-hidden="true" />
              <span>{isEditMode ? t('common.save') : t('irrigation.addSchedule')}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

/**
 * AddIrrigationModal Component
 * Accessible dialog modal wrapping the IrrigationFormContent.
 */
export default function AddIrrigationModal({
  isOpen,
  onClose,
  onSaveSchedule,
  scheduleToEdit = null,
  farms = [],
  fields = [],
  crops = [],
}) {
  const { t } = useTranslation();
  const isEditMode = Boolean(scheduleToEdit);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (savedSchedule, isEdit) => {
    onSaveSchedule(savedSchedule, isEdit);
    onClose();
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="irrigation-modal-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog" style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="agri-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-hidden="true"
            >
              {isEditMode ? <Edit3 size={18} /> : <Droplets size={18} />}
            </div>
            <div>
              <h3 id="irrigation-modal-heading" className="agri-modal-title">
                {isEditMode ? t('common.edit') : t('irrigation.addSchedule')}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>
                {isEditMode
                  ? `${scheduleToEdit?.id}`
                  : t('irrigation.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Form Body keyed to target schedule */}
        <IrrigationFormContent
          key={scheduleToEdit ? scheduleToEdit.id : 'new-schedule'}
          scheduleToEdit={scheduleToEdit}
          farms={farms}
          fields={fields}
          crops={crops}
          onSave={handleSave}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
