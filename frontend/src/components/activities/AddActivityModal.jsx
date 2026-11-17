import { useState, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, CalendarPlus, Edit3, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../common';
import { ACTIVITY_TYPES, ACTIVITY_STATUSES } from '../../data/activityData';
import activityService from '../../services/activityService';

/**
 * ActivityFormContent Component
 * Uses key prop from parent so it re-mounts with fresh state whenever activityToEdit changes.
 * Avoids calling setState synchronously inside useEffect.
 */
function ActivityFormContent({
  activityToEdit,
  farms = [],
  fields = [],
  crops = [],
  onSave,
  onClose,
}) {
  const { t } = useTranslation();
  const isEditMode = Boolean(activityToEdit);

  // Form field unique IDs for accessibility
  const titleId = useId();
  const typeId = useId();
  const farmSelectId = useId();
  const fieldSelectId = useId();
  const cropSelectId = useId();
  const dateId = useId();
  const timeId = useId();
  const durationId = useId();
  const statusId = useId();
  const priorityId = useId();
  const operatorId = useId();
  const quantityId = useId();
  const quantityUnitId = useId();
  const descriptionId = useId();
  const notesId = useId();

  // Initial farm & field
  const defaultFarmId = farms[0]?.id ? String(farms[0].id) : '';
  const initialFieldsForDefault = fields.filter((f) => String(f.farmId) === defaultFarmId);
  const defaultFieldId = initialFieldsForDefault[0]?.id ? String(initialFieldsForDefault[0].id) : '';

  // Initialize form state
  const [formData, setFormData] = useState(() => {
    if (activityToEdit) {
      return {
        activityType: activityToEdit.activityType || 'Fertilizing',
        title: activityToEdit.title || '',
        farmId: activityToEdit.farmId ? String(activityToEdit.farmId) : defaultFarmId,
        fieldId: activityToEdit.fieldId ? String(activityToEdit.fieldId) : defaultFieldId,
        cropCycleId: activityToEdit.cropCycleId ? String(activityToEdit.cropCycleId) : '',
        date: activityToEdit.date || activityToEdit.activityDate || new Date().toISOString().split('T')[0],
        time: activityToEdit.time || activityToEdit.activityTime || '',
        duration: activityToEdit.duration !== undefined && activityToEdit.duration !== null ? String(activityToEdit.duration) : '',
        status: activityToEdit.status || 'Planned',
        priority: activityToEdit.priority || 'Medium',
        operator: activityToEdit.operator || '',
        quantity: activityToEdit.quantity !== undefined && activityToEdit.quantity !== null ? String(activityToEdit.quantity) : '',
        quantityUnit: activityToEdit.quantityUnit || 'kg',
        description: activityToEdit.description || '',
        notes: activityToEdit.notes || '',
      };
    }
    return {
      activityType: 'Fertilizing',
      title: '',
      farmId: defaultFarmId,
      fieldId: defaultFieldId,
      cropCycleId: '',
      date: new Date().toISOString().split('T')[0],
      time: '08:00 AM',
      duration: '',
      status: 'Planned',
      priority: 'Medium',
      operator: '',
      quantity: '',
      quantityUnit: 'kg',
      description: '',
      notes: '',
    };
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fields filtered by the currently chosen farm
  const availableFields = fields.filter((f) => String(f.farmId) === String(formData.farmId));

  // Crops filtered by the currently chosen field
  const availableCrops = crops.filter((c) => String(c.fieldId) === String(formData.fieldId));

  // Handle cascading Farm change
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

  // Handle cascading Field change
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

  // Validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t('validation.required');
    }
    if (!formData.activityType) {
      newErrors.activityType = t('validation.required');
    }
    if (!formData.farmId) {
      newErrors.farmId = t('validation.selectFarm');
    }
    if (!formData.fieldId) {
      newErrors.fieldId = t('validation.selectField');
    }
    if (!formData.date) {
      newErrors.date = t('validation.enterValidDate');
    }
    if (!formData.status) {
      newErrors.status = t('validation.required');
    }

    if (formData.duration && (isNaN(Number(formData.duration)) || Number(formData.duration) < 0)) {
      newErrors.duration = t('validation.enterValidNumber');
    }

    if (formData.quantity && (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0)) {
      newErrors.quantity = t('validation.enterValidQuantity');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      title: formData.title.trim(),
      activityType: formData.activityType,
      status: formData.status || 'Planned',
      priority: formData.priority || 'Medium',
      activityDate: formData.date,
      activityTime: formData.time ? formData.time.trim() : null,
      durationHours: formData.duration !== '' ? Number(formData.duration) : null,
      operator: formData.operator ? formData.operator.trim() : null,
      quantity: formData.quantity !== '' ? Number(formData.quantity) : null,
      quantityUnit: formData.quantity !== '' && formData.quantityUnit ? formData.quantityUnit.trim() : null,
      description: formData.description ? formData.description.trim() : null,
      notes: formData.notes ? formData.notes.trim() : null,
      cropCycleId: formData.cropCycleId ? Number(formData.cropCycleId) : null,
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let result;
      if (isEditMode) {
        result = await activityService.updateActivity(activityToEdit.id, payload);
      } else {
        result = await activityService.createActivity(Number(formData.fieldId), payload);
      }
      onSave(result, isEditMode);
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasNoFarmsOrFields = farms.length === 0 || fields.length === 0;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="agri-modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
        {hasNoFarmsOrFields && (
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
            <span>{t('activities.noFarmsOrFields', 'You need to add at least one farm and field before creating an activity.')}</span>
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
          {/* Activity Type */}
          <div className="agri-form-group">
            <label htmlFor={typeId} className="agri-form-label agri-form-label--required">
              {t('activities.activityType')}
            </label>
            <select
              id={typeId}
              name="activityType"
              className={`agri-form-select ${errors.activityType ? 'agri-form-select--error' : ''}`}
              value={formData.activityType}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              {ACTIVITY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.activityType && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.activityType}
              </span>
            )}
          </div>

          {/* Activity Status */}
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
              {ACTIVITY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
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

          {/* Title */}
          <div className="agri-form-group agri-form-group--full">
            <label htmlFor={titleId} className="agri-form-label agri-form-label--required">
              {t('activities.title')}
            </label>
            <input
              id={titleId}
              name="title"
              type="text"
              placeholder="e.g., Foliar Zinc Fertilizer Application"
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

          {/* Farm Selection (Dependent parent) */}
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
              disabled={isSubmitting || hasNoFarmsOrFields}
            >
              <option value="">-- {t('navigation.farms')} --</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
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

          {/* Field Selection (Dependent child) */}
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
              <option value="">-- {t('navigation.fields')} --</option>
              {availableFields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
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

          {/* Optional Crop Selection for Field */}
          <div className="agri-form-group">
            <label htmlFor={cropSelectId} className="agri-form-label">
              {t('navigation.crops')}
            </label>
            <select
              id={cropSelectId}
              name="cropCycleId"
              className="agri-form-select"
              value={formData.cropCycleId}
              onChange={handleChange}
              disabled={isSubmitting || !formData.fieldId}
            >
              <option value="">{t('activities.generalFieldActivity', 'General Field Activity (No Crop)')}</option>
              {availableCrops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.cropName || c.name} {c.variety ? `(${c.variety})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="agri-form-group">
            <label htmlFor={priorityId} className="agri-form-label">
              {t('activities.priorityLevels', 'Priority')}
            </label>
            <select
              id={priorityId}
              name="priority"
              className="agri-form-select"
              value={formData.priority}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="Low">{t('status.low', 'Low')}</option>
              <option value="Medium">{t('status.medium', 'Medium')}</option>
              <option value="High">{t('status.high', 'High')}</option>
            </select>
          </div>

          {/* Scheduled Date */}
          <div className="agri-form-group">
            <label htmlFor={dateId} className="agri-form-label agri-form-label--required">
              {t('activities.activityDate')}
            </label>
            <input
              id={dateId}
              name="date"
              type="date"
              className={`agri-form-input ${errors.date ? 'agri-form-input--error' : ''}`}
              value={formData.date}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.date && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.date}
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
              name="time"
              type="text"
              placeholder="e.g., 07:00 AM"
              className="agri-form-input"
              value={formData.time}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Duration in Hours */}
          <div className="agri-form-group">
            <label htmlFor={durationId} className="agri-form-label">
              {t('irrigation.duration')} ({t('units.hours')})
            </label>
            <input
              id={durationId}
              name="duration"
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g., 2.5"
              className={`agri-form-input ${errors.duration ? 'agri-form-input--error' : ''}`}
              value={formData.duration}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.duration && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.duration}
              </span>
            )}
          </div>

          {/* Operator */}
          <div className="agri-form-group">
            <label htmlFor={operatorId} className="agri-form-label">
              {t('activities.operator')}
            </label>
            <input
              id={operatorId}
              name="operator"
              type="text"
              placeholder="e.g., Field Operator"
              className="agri-form-input"
              value={formData.operator}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Quantity & Unit */}
          <div className="agri-form-group">
            <label htmlFor={quantityId} className="agri-form-label">
              Quantity / Input Applied
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                id={quantityId}
                name="quantity"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g., 50"
                className={`agri-form-input ${errors.quantity ? 'agri-form-input--error' : ''}`}
                style={{ flex: 2 }}
                value={formData.quantity}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <input
                id={quantityUnitId}
                name="quantityUnit"
                type="text"
                placeholder="kg / L / bags"
                className="agri-form-input"
                style={{ flex: 1.5 }}
                value={formData.quantityUnit}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.quantity && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.quantity}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="agri-form-group agri-form-group--full">
            <label htmlFor={descriptionId} className="agri-form-label">
              {t('common.description')}
            </label>
            <textarea
              id={descriptionId}
              name="description"
              rows={2}
              placeholder="Operational details and goals for this intervention..."
              className="agri-form-textarea"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
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
              placeholder="Observations, weather constraints, or machine equipment numbers..."
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
        <Button variant="primary" size="sm" type="submit" disabled={isSubmitting || hasNoFarmsOrFields}>
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="agri-animate-spin" aria-hidden="true" />
              <span>{t('activities.saving', 'Saving activity...')}</span>
            </>
          ) : (
            <>
              <Check size={14} aria-hidden="true" />
              <span>{isEditMode ? t('common.save') : t('activities.addActivity')}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

/**
 * AddActivityModal Component
 * Accessible dialog modal wrapping the ActivityFormContent.
 */
export default function AddActivityModal({
  isOpen,
  onClose,
  onSaveActivity,
  activityToEdit = null,
  farms = [],
  fields = [],
  crops = [],
}) {
  const { t } = useTranslation();
  const isEditMode = Boolean(activityToEdit);

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

  const handleSave = (savedActivity, isEdit) => {
    onSaveActivity(savedActivity, isEdit);
    onClose();
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-modal-heading"
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
              {isEditMode ? <Edit3 size={18} /> : <CalendarPlus size={18} />}
            </div>
            <div>
              <h3 id="activity-modal-heading" className="agri-modal-title">
                {isEditMode ? t('activities.editActivity') : t('activities.addActivity')}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>
                {isEditMode
                  ? `${activityToEdit?.id}`
                  : t('activities.subtitle')}
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

        {/* Form Body keyed to current edit target */}
        <ActivityFormContent
          key={activityToEdit ? activityToEdit.id : 'new-activity'}
          activityToEdit={activityToEdit}
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
