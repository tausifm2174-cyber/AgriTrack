import { useState, useEffect, useId } from 'react';
import { X, Check, CalendarPlus, Edit3, AlertCircle } from 'lucide-react';
import { Button } from '../common';
import { ACTIVITY_TYPES, ACTIVITY_STATUSES } from '../../data/activityData';

/**
 * ActivityFormContent Component
 * Uses key prop from parent so it re-mounts with fresh state whenever activityToEdit changes.
 * Avoids calling setState synchronously inside useEffect.
 */
function ActivityFormContent({
  activityToEdit,
  farms,
  fields,
  onSave,
  onClose,
}) {
  const isEditMode = Boolean(activityToEdit);

  // Form field unique IDs for accessibility
  const titleId = useId();
  const typeId = useId();
  const farmSelectId = useId();
  const fieldSelectId = useId();
  const cropInputId = useId();
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
  const defaultFarmId = farms[0]?.id || 'farm-1';
  const initialFieldsForDefault = fields.filter((f) => f.farmId === defaultFarmId);
  const defaultFieldId = initialFieldsForDefault[0]?.id || 'field-1a';
  const defaultCrop = initialFieldsForDefault[0]?.currentCrop || 'Wheat';

  // Initialize form state
  const [formData, setFormData] = useState(() => {
    if (activityToEdit) {
      return {
        activityType: activityToEdit.activityType || 'Other',
        title: activityToEdit.title || '',
        farmId: activityToEdit.farmId || defaultFarmId,
        fieldId: activityToEdit.fieldId || defaultFieldId,
        cropName: activityToEdit.cropName || '',
        date: activityToEdit.date || new Date().toISOString().split('T')[0],
        time: activityToEdit.time || '',
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
      cropName: defaultCrop,
      date: new Date().toISOString().split('T')[0],
      time: '08:00 AM',
      duration: '2.5',
      status: 'Planned',
      priority: 'Medium',
      operator: 'Ramesh Patel',
      quantity: '',
      quantityUnit: 'kg',
      description: '',
      notes: '',
    };
  });

  const [errors, setErrors] = useState({});

  // Fields filtered by the currently chosen farm
  const availableFields = fields.filter((f) => f.farmId === formData.farmId);

  // Handle cascading Farm change
  const handleFarmChange = (e) => {
    const newFarmId = e.target.value;
    const newFields = fields.filter((f) => f.farmId === newFarmId);
    const newField = newFields[0];

    setFormData((prev) => ({
      ...prev,
      farmId: newFarmId,
      fieldId: newField ? newField.id : '',
      cropName: newField?.currentCrop || '',
    }));

    if (errors.farmId) setErrors((prev) => ({ ...prev, farmId: null }));
    if (errors.fieldId && newField) setErrors((prev) => ({ ...prev, fieldId: null }));
  };

  // Handle cascading Field change
  const handleFieldChange = (e) => {
    const newFieldId = e.target.value;
    const f = fields.find((item) => item.id === newFieldId);

    setFormData((prev) => ({
      ...prev,
      fieldId: newFieldId,
      cropName: f?.currentCrop || prev.cropName,
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
      newErrors.title = 'Activity title is required';
    }
    if (!formData.activityType) {
      newErrors.activityType = 'Activity type is required';
    }
    if (!formData.farmId) {
      newErrors.farmId = 'Farm selection is required';
    }
    if (!formData.fieldId) {
      newErrors.fieldId = 'Field selection is required';
    }
    if (!formData.cropName.trim()) {
      newErrors.cropName = 'Crop name is required';
    }
    if (!formData.date) {
      newErrors.date = 'Activity date is required';
    }
    if (!formData.status) {
      newErrors.status = 'Activity status is required';
    }

    if (formData.duration && (isNaN(Number(formData.duration)) || Number(formData.duration) <= 0)) {
      newErrors.duration = 'Duration must be a positive number';
    }

    if (formData.quantity && (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0)) {
      newErrors.quantity = 'Quantity must be zero or a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const activityPayload = {
      id: isEditMode
        ? activityToEdit.id
        : `ACT-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
      activityType: formData.activityType,
      title: formData.title.trim(),
      farmId: formData.farmId,
      fieldId: formData.fieldId,
      cropName: formData.cropName.trim(),
      date: formData.date,
      time: formData.time.trim(),
      duration: formData.duration ? Number(formData.duration) : null,
      status: formData.status,
      priority: formData.priority,
      operator: formData.operator.trim(),
      quantity: formData.quantity ? Number(formData.quantity) : null,
      quantityUnit: formData.quantity ? formData.quantityUnit : '',
      description: formData.description.trim(),
      notes: formData.notes.trim(),
      createdAt: isEditMode && activityToEdit.createdAt
        ? activityToEdit.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(activityPayload, isEditMode);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="agri-modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
        <div className="agri-form-grid">
          {/* Activity Type */}
          <div className="agri-form-group">
            <label htmlFor={typeId} className="agri-form-label agri-form-label--required">
              Activity Type
            </label>
            <select
              id={typeId}
              name="activityType"
              className={`agri-form-select ${errors.activityType ? 'agri-form-select--error' : ''}`}
              value={formData.activityType}
              onChange={handleChange}
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

          {/* Status */}
          <div className="agri-form-group">
            <label htmlFor={statusId} className="agri-form-label agri-form-label--required">
              Activity Status
            </label>
            <select
              id={statusId}
              name="status"
              className={`agri-form-select ${errors.status ? 'agri-form-select--error' : ''}`}
              value={formData.status}
              onChange={handleChange}
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

          {/* Title (Full Width) */}
          <div className="agri-form-group agri-form-grid--full">
            <label htmlFor={titleId} className="agri-form-label agri-form-label--required">
              Activity Title
            </label>
            <input
              id={titleId}
              name="title"
              type="text"
              placeholder="e.g., Urea Top Dressing - Stage 2"
              className={`agri-form-input ${errors.title ? 'agri-form-input--error' : ''}`}
              value={formData.title}
              onChange={handleChange}
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
              Select Farm
            </label>
            <select
              id={farmSelectId}
              name="farmId"
              className={`agri-form-select ${errors.farmId ? 'agri-form-select--error' : ''}`}
              value={formData.farmId}
              onChange={handleFarmChange}
            >
              <option value="">-- Choose Farm --</option>
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
              Select Field
            </label>
            <select
              id={fieldSelectId}
              name="fieldId"
              className={`agri-form-select ${errors.fieldId ? 'agri-form-select--error' : ''}`}
              value={formData.fieldId}
              onChange={handleFieldChange}
              disabled={availableFields.length === 0}
            >
              <option value="">-- Choose Field --</option>
              {availableFields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.currentCrop || 'No standing crop'})
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

          {/* Crop Name */}
          <div className="agri-form-group">
            <label htmlFor={cropInputId} className="agri-form-label agri-form-label--required">
              Associated Crop
            </label>
            <input
              id={cropInputId}
              name="cropName"
              type="text"
              placeholder="e.g., Wheat, Mustard"
              className={`agri-form-input ${errors.cropName ? 'agri-form-input--error' : ''}`}
              value={formData.cropName}
              onChange={handleChange}
            />
            {errors.cropName && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.cropName}
              </span>
            )}
          </div>

          {/* Priority */}
          <div className="agri-form-group">
            <label htmlFor={priorityId} className="agri-form-label">
              Priority
            </label>
            <select
              id={priorityId}
              name="priority"
              className="agri-form-select"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Date */}
          <div className="agri-form-group">
            <label htmlFor={dateId} className="agri-form-label agri-form-label--required">
              Activity Date
            </label>
            <input
              id={dateId}
              name="date"
              type="date"
              className={`agri-form-input ${errors.date ? 'agri-form-input--error' : ''}`}
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.date}
              </span>
            )}
          </div>

          {/* Time */}
          <div className="agri-form-group">
            <label htmlFor={timeId} className="agri-form-label">
              Scheduled Time
            </label>
            <input
              id={timeId}
              name="time"
              type="text"
              placeholder="e.g. 08:00 AM"
              className="agri-form-input"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          {/* Duration */}
          <div className="agri-form-group">
            <label htmlFor={durationId} className="agri-form-label">
              Duration (hours)
            </label>
            <input
              id={durationId}
              name="duration"
              type="number"
              step="0.5"
              min="0.5"
              placeholder="e.g., 2.5"
              className={`agri-form-input ${errors.duration ? 'agri-form-input--error' : ''}`}
              value={formData.duration}
              onChange={handleChange}
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
              Assigned Operator
            </label>
            <input
              id={operatorId}
              name="operator"
              type="text"
              placeholder="e.g., Ramesh Patel"
              className="agri-form-input"
              value={formData.operator}
              onChange={handleChange}
            />
          </div>

          {/* Quantity & Unit */}
          <div className="agri-form-group">
            <label htmlFor={quantityId} className="agri-form-label">
              Input Quantity (Optional)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                id={quantityId}
                name="quantity"
                type="number"
                step="any"
                min="0"
                placeholder="e.g., 50"
                className={`agri-form-input ${errors.quantity ? 'agri-form-input--error' : ''}`}
                value={formData.quantity}
                onChange={handleChange}
                style={{ flex: 2 }}
              />
              <select
                id={quantityUnitId}
                name="quantityUnit"
                className="agri-form-select"
                value={formData.quantityUnit}
                onChange={handleChange}
                style={{ flex: 1 }}
              >
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="bags">bags</option>
                <option value="hours">hours</option>
                <option value="units">units</option>
              </select>
            </div>
            {errors.quantity && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.quantity}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="agri-form-group agri-form-grid--full">
            <label htmlFor={descriptionId} className="agri-form-label">
              Description / Objective
            </label>
            <textarea
              id={descriptionId}
              name="description"
              rows={2}
              placeholder="Detail the operational purpose or guidelines..."
              className="agri-form-textarea"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Notes */}
          <div className="agri-form-group agri-form-grid--full">
            <label htmlFor={notesId} className="agri-form-label">
              Field Observations & Agronomic Notes
            </label>
            <textarea
              id={notesId}
              name="notes"
              rows={2}
              placeholder="Observations on soil moisture, crop stage, weather conditions..."
              className="agri-form-textarea"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="agri-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" type="submit">
          <Check size={14} aria-hidden="true" />
          <span>{isEditMode ? 'Update Activity' : 'Save Activity'}</span>
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
}) {
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
                {isEditMode ? 'Edit Activity' : 'Schedule New Activity'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>
                {isEditMode
                  ? `Updating record ${activityToEdit?.id}`
                  : 'Assign tasks, operations, and agronomic events'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label="Close activity modal"
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
          onSave={handleSave}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
