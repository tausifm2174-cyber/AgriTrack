import { useState } from 'react';
import { X, CheckCircle, Info } from 'lucide-react';
import { Button } from '../common';
import { cropLifecycleStages, cropTypes } from '../../data/cropData';

/**
 * AddCropModal component
 * Handles registering a new crop cycle or editing an existing crop cycle.
 * Includes farm -> field dependent filtering and validation.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Modal close handler
 * @param {Function} props.onCropSaved - Callback invoked when crop is added or edited
 * @param {Array} props.farms - List of farms
 * @param {Array} props.fields - List of fields
 * @param {Object} [props.cropToEdit] - Existing crop object if in edit mode
 * @param {string} [props.defaultFarmId] - Optional pre-selected farm ID
 * @param {string} [props.defaultFieldId] - Optional pre-selected field ID
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
  const isEditMode = Boolean(cropToEdit);

  // Compute initial farm and fields
  const initialFarmId = cropToEdit?.farmId || defaultFarmId || farms[0]?.id || '';
  const initialFieldsForFarm = fields.filter((f) => f.farmId === initialFarmId);
  const initialFieldId = cropToEdit?.fieldId || defaultFieldId || initialFieldsForFarm[0]?.id || '';

  const [formData, setFormData] = useState({
    farmId: initialFarmId,
    fieldId: initialFieldId,
    cropName: cropToEdit?.cropName || 'Wheat',
    variety: cropToEdit?.variety || 'Sharbati',
    season: cropToEdit?.season || 'Rabi',
    sowingDate: cropToEdit?.sowingDate || new Date().toISOString().split('T')[0],
    expectedHarvestDate: cropToEdit?.expectedHarvestDate || '2027-03-15',
    initialStage: cropToEdit?.currentStage || 'Sowing',
    notes: cropToEdit?.notes || '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Filter available fields based on selected farm
  const availableFields = fields.filter((f) => f.farmId === formData.farmId);

  // Handle farm change: also auto-update fieldId to first available field in that farm
  const handleFarmChange = (e) => {
    const newFarmId = e.target.value;
    const matchingFields = fields.filter((f) => f.farmId === newFarmId);
    setFormData((prev) => ({
      ...prev,
      farmId: newFarmId,
      fieldId: matchingFields[0]?.id || '',
    }));
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
    if (!formData.farmId) newErrors.farmId = 'Farm holding is required';
    if (!formData.fieldId) newErrors.fieldId = 'Field parcel is required';
    if (!formData.cropName.trim()) newErrors.cropName = 'Crop name is required';
    if (!formData.variety.trim()) newErrors.variety = 'Crop variety is required';
    if (!formData.sowingDate) newErrors.sowingDate = 'Sowing date is required';
    if (!formData.expectedHarvestDate) newErrors.expectedHarvestDate = 'Expected harvest date is required';

    if (formData.sowingDate && formData.expectedHarvestDate) {
      if (new Date(formData.expectedHarvestDate) <= new Date(formData.sowingDate)) {
        newErrors.expectedHarvestDate = 'Harvest date must be after sowing date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedFarm = farms.find((f) => f.id === formData.farmId);
    const selectedField = fields.find((f) => f.id === formData.fieldId);

    // Compute progress % based on initial stage
    let progress = 10;
    let stageStep = 1;
    let status = 'Active';
    let statusVariant = 'success';

    if (formData.initialStage === 'Sowing') {
      progress = 15;
      stageStep = 1;
    } else if (formData.initialStage === 'Vegetative Growth') {
      progress = 45;
      stageStep = 2;
    } else if (formData.initialStage === 'Flowering') {
      progress = 65;
      stageStep = 3;
    } else if (formData.initialStage === 'Ripening') {
      progress = 85;
      stageStep = 4;
      status = 'Near Harvest';
      statusVariant = 'warning';
    } else if (formData.initialStage === 'Harvest Readiness') {
      progress = 100;
      stageStep = 5;
      status = 'Ready for Harvest';
      statusVariant = 'success';
    }

    const savedCrop = {
      id: cropToEdit?.id || `crop-cycle-${Date.now()}`,
      cropName: formData.cropName.trim(),
      variety: formData.variety.trim(),
      farmId: formData.farmId,
      farmName: selectedFarm?.name || 'Farm Holding',
      fieldId: formData.fieldId,
      fieldName: selectedField?.name || 'Field Parcel',
      areaAcres: selectedField?.areaAcres || 5.0,
      season: formData.season,
      soilType: selectedField?.soilType || 'Loamy Soil',
      sowingDate: formData.sowingDate,
      expectedHarvestDate: formData.expectedHarvestDate,
      currentStage: formData.initialStage,
      currentStageStep: stageStep,
      progressPercent: progress,
      status,
      statusVariant,
      irrigationMethod: selectedField?.irrigationMethod || 'Drip Irrigation',
      upcomingMilestone: `${formData.initialStage === 'Harvest Readiness' ? 'Harvesting and Storage' : 'Growth Monitoring & Fertigation'}`,
      upcomingMilestoneDate: formData.expectedHarvestDate,
      notes: formData.notes.trim() || 'New crop cycle initiated under farm management guidelines.',
      stageHistory: cropToEdit?.stageHistory || [
        { stage: 'Sowing', date: formData.sowingDate, status: 'Completed', notes: 'Sowing recorded.' },
        { stage: 'Vegetative Growth', date: '', status: stageStep >= 2 ? 'In Progress' : 'Upcoming', notes: '' },
        { stage: 'Flowering', date: '', status: stageStep >= 3 ? 'In Progress' : 'Upcoming', notes: '' },
        { stage: 'Ripening', date: '', status: stageStep >= 4 ? 'In Progress' : 'Upcoming', notes: '' },
        { stage: 'Harvest Readiness', date: formData.expectedHarvestDate, status: stageStep === 5 ? 'In Progress' : 'Upcoming', notes: '' },
      ],
    };

    setSubmitted(true);
    setTimeout(() => {
      onCropSaved?.(savedCrop, isEditMode);
      setSubmitted(false);
      onClose();
    }, 1100);
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-crop-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitted) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        <div className="agri-modal-header">
          <div>
            <h3 id="add-crop-title" className="agri-modal-title">
              {isEditMode ? 'Edit Crop Cycle' : 'Add New Crop Cycle'}
            </h3>
            <p className="agri-modal-subtitle">
              {isEditMode
                ? 'Update planting details and lifecycle phase for this crop'
                : 'Assign a new crop variety to a cultivated field parcel'}
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={submitted}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="agri-modal-body">
            <div className="agri-demo-badge-banner">
              <Info size={16} aria-hidden="true" />
              <span>
                <strong>Demo Mode:</strong> Crop cycle will be recorded in memory for this session without backend API calls.
              </span>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={48} className="text-primary" style={{ margin: '0 auto 1rem auto' }} aria-hidden="true" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                  {isEditMode ? 'Crop Cycle Updated!' : 'Crop Cycle Registered Successfully!'}
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                  Updating field cultivation status and agronomic milestones...
                </p>
              </div>
            ) : (
              <div className="agri-form-grid">
                {/* Row 1: Farm and Field Dependent Dropdown */}
                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="crop-farm" className="agri-form-label agri-form-label--required">
                      Farm Holding
                    </label>
                    <select
                      id="crop-farm"
                      name="farmId"
                      className={`agri-form-select ${errors.farmId ? 'agri-form-input--error' : ''}`}
                      value={formData.farmId}
                      onChange={handleFarmChange}
                      required
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
                      Field Parcel
                    </label>
                    <select
                      id="crop-field"
                      name="fieldId"
                      className={`agri-form-select ${errors.fieldId ? 'agri-form-input--error' : ''}`}
                      value={formData.fieldId}
                      onChange={handleChange}
                      required
                    >
                      {availableFields.length === 0 ? (
                        <option value="">No fields available for this farm</option>
                      ) : (
                        availableFields.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} ({f.areaAcres} Ac)
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
                      Crop Name
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
                      Variety / Hybrid
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
                    />
                    {errors.variety && <span className="agri-form-error">{errors.variety}</span>}
                  </div>
                </div>

                {/* Row 3: Season & Initial Stage */}
                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="crop-season" className="agri-form-label agri-form-label--required">
                      Agricultural Season
                    </label>
                    <select
                      id="crop-season"
                      name="season"
                      className="agri-form-select"
                      value={formData.season}
                      onChange={handleChange}
                    >
                      <option value="Rabi">Rabi (Winter - Spring)</option>
                      <option value="Kharif">Kharif (Monsoon - Autumn)</option>
                      <option value="Zaid">Zaid (Summer)</option>
                    </select>
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="crop-stage" className="agri-form-label agri-form-label--required">
                      Lifecycle Stage
                    </label>
                    <select
                      id="crop-stage"
                      name="initialStage"
                      className="agri-form-select"
                      value={formData.initialStage}
                      onChange={handleChange}
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
                      Sowing Date
                    </label>
                    <input
                      id="crop-sowing"
                      name="sowingDate"
                      type="date"
                      required
                      className={`agri-form-input ${errors.sowingDate ? 'agri-form-input--error' : ''}`}
                      value={formData.sowingDate}
                      onChange={handleChange}
                    />
                    {errors.sowingDate && <span className="agri-form-error">{errors.sowingDate}</span>}
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="crop-harvest" className="agri-form-label agri-form-label--required">
                      Expected Harvest Date
                    </label>
                    <input
                      id="crop-harvest"
                      name="expectedHarvestDate"
                      type="date"
                      required
                      className={`agri-form-input ${errors.expectedHarvestDate ? 'agri-form-input--error' : ''}`}
                      value={formData.expectedHarvestDate}
                      onChange={handleChange}
                    />
                    {errors.expectedHarvestDate && (
                      <span className="agri-form-error">{errors.expectedHarvestDate}</span>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="agri-form-group">
                  <label htmlFor="crop-notes" className="agri-form-label">
                    Agronomic Notes & Seed Treatments
                  </label>
                  <textarea
                    id="crop-notes"
                    name="notes"
                    rows="2"
                    placeholder="Enter seed batch, fertility inputs, or irrigation arrangements..."
                    className="agri-form-textarea"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>

          {!submitted && (
            <div className="agri-modal-footer">
              <Button variant="secondary" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Update Crop' : 'Save Crop Cycle (Demo)'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
