import { useState, useEffect, useId } from 'react';
import { X, Check, Edit3, AlertCircle, Droplets } from 'lucide-react';
import { Button } from '../common';
import {
  IRRIGATION_METHODS,
  IRRIGATION_STATUSES,
  IRRIGATION_PRIORITIES,
} from '../../data/irrigationData';

/**
 * IrrigationFormContent Component
 * Key-based reset component avoiding setState inside effect.
 */
function IrrigationFormContent({
  scheduleToEdit,
  farms,
  fields,
  onSave,
  onClose,
}) {
  const isEditMode = Boolean(scheduleToEdit);

  // Accessible unique IDs
  const titleId = useId();
  const farmSelectId = useId();
  const fieldSelectId = useId();
  const cropInputId = useId();
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
  const defaultFarmId = farms[0]?.id || 'farm-1';
  const initialFieldsForDefault = fields.filter((f) => f.farmId === defaultFarmId);
  const defaultFieldId = initialFieldsForDefault[0]?.id || 'field-1a';
  const defaultCrop = initialFieldsForDefault[0]?.currentCrop || 'Wheat';

  // Form State
  const [formData, setFormData] = useState(() => {
    if (scheduleToEdit) {
      return {
        title: scheduleToEdit.title || '',
        farmId: scheduleToEdit.farmId || defaultFarmId,
        fieldId: scheduleToEdit.fieldId || defaultFieldId,
        cropName: scheduleToEdit.cropName || '',
        irrigationMethod: scheduleToEdit.irrigationMethod || 'Drip',
        scheduledDate: scheduleToEdit.scheduledDate || new Date().toISOString().split('T')[0],
        scheduledTime: scheduleToEdit.scheduledTime || '04:00 PM',
        durationMinutes: scheduleToEdit.durationMinutes !== undefined && scheduleToEdit.durationMinutes !== null ? String(scheduleToEdit.durationMinutes) : '45',
        waterVolumeLitres: scheduleToEdit.waterVolumeLitres !== undefined && scheduleToEdit.waterVolumeLitres !== null ? String(scheduleToEdit.waterVolumeLitres) : '15000',
        priority: scheduleToEdit.priority || 'Medium',
        status: scheduleToEdit.status || 'Scheduled',
        soilMoisture: scheduleToEdit.soilMoisture !== undefined && scheduleToEdit.soilMoisture !== null ? String(scheduleToEdit.soilMoisture) : '',
        rainfallExpected: scheduleToEdit.rainfallExpected !== undefined && scheduleToEdit.rainfallExpected !== null ? String(scheduleToEdit.rainfallExpected) : '0',
        weatherCondition: scheduleToEdit.weatherCondition || 'Normal',
        notes: scheduleToEdit.notes || '',
      };
    }
    return {
      title: '',
      farmId: defaultFarmId,
      fieldId: defaultFieldId,
      cropName: defaultCrop,
      irrigationMethod: 'Drip',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '04:00 PM',
      durationMinutes: '45',
      waterVolumeLitres: '15000',
      priority: 'Medium',
      status: 'Scheduled',
      soilMoisture: '38',
      rainfallExpected: '0',
      weatherCondition: 'Partly Cloudy',
      notes: '',
    };
  });

  const [errors, setErrors] = useState({});

  // Cascading fields for the current farm
  const availableFields = fields.filter((f) => f.farmId === formData.farmId);

  // Farm change handler
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

  // Field change handler
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

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Schedule title is required';
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
    if (!formData.irrigationMethod) {
      newErrors.irrigationMethod = 'Irrigation method is required';
    }
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Date is required';
    }
    if (!formData.scheduledTime.trim()) {
      newErrors.scheduledTime = 'Time is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    // Number validations
    const durationNum = Number(formData.durationMinutes);
    if (!formData.durationMinutes || isNaN(durationNum) || durationNum <= 0) {
      newErrors.durationMinutes = 'Duration must be greater than 0 minutes';
    }

    const volumeNum = Number(formData.waterVolumeLitres);
    if (!formData.waterVolumeLitres || isNaN(volumeNum) || volumeNum <= 0) {
      newErrors.waterVolumeLitres = 'Water volume must be greater than 0 Litres';
    }

    if (formData.soilMoisture !== '') {
      const moistNum = Number(formData.soilMoisture);
      if (isNaN(moistNum) || moistNum < 0 || moistNum > 100) {
        newErrors.soilMoisture = 'Soil moisture must be between 0 and 100%';
      }
    }

    if (formData.rainfallExpected !== '') {
      const rainNum = Number(formData.rainfallExpected);
      if (isNaN(rainNum) || rainNum < 0) {
        newErrors.rainfallExpected = 'Rainfall cannot be negative';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      id: isEditMode
        ? scheduleToEdit.id
        : `IRR-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
      title: formData.title.trim(),
      farmId: formData.farmId,
      fieldId: formData.fieldId,
      cropName: formData.cropName.trim(),
      irrigationMethod: formData.irrigationMethod,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime.trim(),
      durationMinutes: Number(formData.durationMinutes),
      waterVolumeLitres: Number(formData.waterVolumeLitres),
      priority: formData.priority,
      status: formData.status,
      soilMoisture: formData.soilMoisture !== '' ? Number(formData.soilMoisture) : null,
      rainfallExpected: formData.rainfallExpected !== '' ? Number(formData.rainfallExpected) : 0,
      weatherCondition: formData.weatherCondition.trim() || 'Normal',
      notes: formData.notes.trim(),
      createdAt: isEditMode && scheduleToEdit.createdAt
        ? scheduleToEdit.createdAt
        : new Date().toISOString(),
      completedAt: formData.status === 'Completed'
        ? (scheduleToEdit?.completedAt || new Date().toISOString())
        : null,
      updatedAt: new Date().toISOString(),
    };

    onSave(payload, isEditMode);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="agri-modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
        <div className="agri-form-grid">
          {/* Title (Full Width) */}
          <div className="agri-form-group agri-form-grid--full">
            <label htmlFor={titleId} className="agri-form-label agri-form-label--required">
              Schedule Title
            </label>
            <input
              id={titleId}
              name="title"
              type="text"
              placeholder="e.g., Field 2B Maize Drip Cycle - Flowering Phase"
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

          {/* Farm Selection (Cascading parent) */}
          <div className="agri-form-group">
            <label htmlFor={farmSelectId} className="agri-form-label agri-form-label--required">
              Farm Holding
            </label>
            <select
              id={farmSelectId}
              name="farmId"
              className={`agri-form-select ${errors.farmId ? 'agri-form-select--error' : ''}`}
              value={formData.farmId}
              onChange={handleFarmChange}
            >
              <option value="">-- Select Farm --</option>
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

          {/* Field Selection (Cascading child) */}
          <div className="agri-form-group">
            <label htmlFor={fieldSelectId} className="agri-form-label agri-form-label--required">
              Field / Parcel
            </label>
            <select
              id={fieldSelectId}
              name="fieldId"
              className={`agri-form-select ${errors.fieldId ? 'agri-form-select--error' : ''}`}
              value={formData.fieldId}
              onChange={handleFieldChange}
              disabled={availableFields.length === 0}
            >
              <option value="">-- Select Field --</option>
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
              Target Crop
            </label>
            <input
              id={cropInputId}
              name="cropName"
              type="text"
              placeholder="e.g., Maize, Wheat"
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

          {/* Irrigation Method */}
          <div className="agri-form-group">
            <label htmlFor={methodId} className="agri-form-label agri-form-label--required">
              Irrigation Method
            </label>
            <select
              id={methodId}
              name="irrigationMethod"
              className={`agri-form-select ${errors.irrigationMethod ? 'agri-form-select--error' : ''}`}
              value={formData.irrigationMethod}
              onChange={handleChange}
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
              Scheduled Date
            </label>
            <input
              id={dateId}
              name="scheduledDate"
              type="date"
              className={`agri-form-input ${errors.scheduledDate ? 'agri-form-input--error' : ''}`}
              value={formData.scheduledDate}
              onChange={handleChange}
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
            <label htmlFor={timeId} className="agri-form-label agri-form-label--required">
              Scheduled Time
            </label>
            <input
              id={timeId}
              name="scheduledTime"
              type="text"
              placeholder="e.g. 04:00 PM"
              className={`agri-form-input ${errors.scheduledTime ? 'agri-form-input--error' : ''}`}
              value={formData.scheduledTime}
              onChange={handleChange}
            />
            {errors.scheduledTime && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.scheduledTime}
              </span>
            )}
          </div>

          {/* Duration (mins) */}
          <div className="agri-form-group">
            <label htmlFor={durationId} className="agri-form-label agri-form-label--required">
              Duration (minutes)
            </label>
            <input
              id={durationId}
              name="durationMinutes"
              type="number"
              min="1"
              step="1"
              placeholder="e.g., 45"
              className={`agri-form-input ${errors.durationMinutes ? 'agri-form-input--error' : ''}`}
              value={formData.durationMinutes}
              onChange={handleChange}
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
            <label htmlFor={volumeId} className="agri-form-label agri-form-label--required">
              Water Volume (Litres)
            </label>
            <input
              id={volumeId}
              name="waterVolumeLitres"
              type="number"
              min="1"
              step="500"
              placeholder="e.g., 15000"
              className={`agri-form-input ${errors.waterVolumeLitres ? 'agri-form-input--error' : ''}`}
              value={formData.waterVolumeLitres}
              onChange={handleChange}
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
              Priority
            </label>
            <select
              id={priorityId}
              name="priority"
              className="agri-form-select"
              value={formData.priority}
              onChange={handleChange}
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
              Status
            </label>
            <select
              id={statusId}
              name="status"
              className={`agri-form-select ${errors.status ? 'agri-form-select--error' : ''}`}
              value={formData.status}
              onChange={handleChange}
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

          {/* Soil Moisture */}
          <div className="agri-form-group">
            <label htmlFor={moistureId} className="agri-form-label">
              Soil Moisture (% Optional)
            </label>
            <input
              id={moistureId}
              name="soilMoisture"
              type="number"
              min="0"
              max="100"
              placeholder="e.g., 38"
              className={`agri-form-input ${errors.soilMoisture ? 'agri-form-input--error' : ''}`}
              value={formData.soilMoisture}
              onChange={handleChange}
            />
            {errors.soilMoisture && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.soilMoisture}
              </span>
            )}
          </div>

          {/* Expected Rainfall */}
          <div className="agri-form-group">
            <label htmlFor={rainfallId} className="agri-form-label">
              Expected Rainfall (mm Optional)
            </label>
            <input
              id={rainfallId}
              name="rainfallExpected"
              type="number"
              min="0"
              step="1"
              placeholder="e.g., 0"
              className={`agri-form-input ${errors.rainfallExpected ? 'agri-form-input--error' : ''}`}
              value={formData.rainfallExpected}
              onChange={handleChange}
            />
            {errors.rainfallExpected && (
              <span className="agri-form-error">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.rainfallExpected}
              </span>
            )}
          </div>

          {/* Weather Condition */}
          <div className="agri-form-group agri-form-grid--full">
            <label htmlFor={weatherCondId} className="agri-form-label">
              Weather Condition / Forecast
            </label>
            <input
              id={weatherCondId}
              name="weatherCondition"
              type="text"
              placeholder="e.g., Partly Cloudy, Low Rain Chance"
              className="agri-form-input"
              value={formData.weatherCondition}
              onChange={handleChange}
            />
          </div>

          {/* Operational Notes */}
          <div className="agri-form-group agri-form-grid--full">
            <label htmlFor={notesId} className="agri-form-label">
              Agronomic Delivery Notes
            </label>
            <textarea
              id={notesId}
              name="notes"
              rows={2}
              placeholder="Add nozzle pressures, valve numbers, pump guidelines, or soil conditions..."
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
          <span>{isEditMode ? 'Update Schedule' : 'Schedule Irrigation'}</span>
        </Button>
      </div>
    </form>
  );
}

/**
 * AddIrrigationModal Component
 * Accessible dialog modal wrapping the IrrigationFormContent.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onSaveSchedule
 * @param {Object} [props.scheduleToEdit]
 * @param {Array} [props.farms]
 * @param {Array} [props.fields]
 */
export default function AddIrrigationModal({
  isOpen,
  onClose,
  onSaveSchedule,
  scheduleToEdit = null,
  farms = [],
  fields = [],
}) {
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
                backgroundColor: '#ecfeff',
                color: '#0891b2',
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
                {isEditMode ? 'Edit Irrigation Schedule' : 'Schedule Precision Irrigation'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>
                {isEditMode
                  ? `Updating schedule ${scheduleToEdit?.id}`
                  : 'Assign method, water volume, and field delivery window'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label="Close irrigation modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Form Body keyed to current edit target */}
        <IrrigationFormContent
          key={scheduleToEdit ? scheduleToEdit.id : 'new-irrigation'}
          scheduleToEdit={scheduleToEdit}
          farms={farms}
          fields={fields}
          onSave={handleSave}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
