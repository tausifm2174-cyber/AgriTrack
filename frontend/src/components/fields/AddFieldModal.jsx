import { useState } from 'react';
import { X, CheckCircle, Info } from 'lucide-react';
import { Button } from '../common';

/**
 * AddFieldModal component
 * Polished demo modal for mapping a new field plot under a farm holding.
 */
export default function AddFieldModal({
  isOpen,
  onClose,
  onFieldAdded,
  farms = [],
  defaultFarmId = '',
}) {
  const [formData, setFormData] = useState({
    name: '',
    farmId: defaultFarmId || (farms[0]?.id || 'farm-1'),
    areaAcres: '',
    currentCrop: 'Wheat',
    cropVariety: 'Sharbati',
    cropSeason: 'Rabi',
    cropStage: 'Vegetative Growth',
    soilType: 'Alluvial Loam',
    irrigationMethod: 'Drip Irrigation',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.areaAcres) return;

    const farmObj = farms.find((f) => f.id === formData.farmId) || farms[0];

    const newField = {
      id: `field-${Date.now()}`,
      name: formData.name,
      code: `FLD-${formData.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4)}`,
      farmId: formData.farmId,
      farmName: farmObj ? farmObj.name : 'Green Valley Farm',
      areaAcres: parseFloat(formData.areaAcres) || 4.0,
      currentCrop: formData.currentCrop,
      cropVariety: formData.cropVariety,
      cropSeason: formData.cropSeason,
      cropStage: formData.cropStage,
      cropProgress: 30,
      soilType: formData.soilType,
      soilHealthStatus: 'Good',
      soilHealthVariant: 'success',
      irrigationMethod: formData.irrigationMethod,
      irrigationStatus: 'Active',
      isIrrigated: formData.irrigationMethod !== 'Canal Flow / Rainfed',
      healthStatus: 'Optimal',
      healthVariant: 'success',
      lastActivity: 'Plot boundary mapped',
      lastActivityDate: 'Just now (Demo)',
      soilMoisture: '40%',
      nitrogenStatus: 'Medium (260 kg/ha)',
      phLevel: 6.8,
      notes: formData.notes || 'Newly surveyed parcel added to holding.',
    };

    setSubmitted(true);
    setTimeout(() => {
      onFieldAdded?.(newField);
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-field-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitted) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        <div className="agri-modal-header">
          <div>
            <h3 id="add-field-title" className="agri-modal-title">
              Map New Field Plot
            </h3>
            <p className="agri-modal-subtitle">
              Register a cultivation parcel and associate it with a farm holding
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
                <strong>Demo Mode:</strong> New fields are mapped in session memory for immediate testing.
              </span>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={48} className="text-success" style={{ margin: '0 auto 1rem auto' }} aria-hidden="true" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                  Field Plot Mapped Successfully!
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                  Adding &ldquo;{formData.name}&rdquo; to your operational acreage...
                </p>
              </div>
            ) : (
              <div className="agri-form-grid">
                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="field-name" className="agri-form-label agri-form-label--required">
                      Field Identifier / Name
                    </label>
                    <input
                      id="field-name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Field 1D or North Plot #3"
                      className="agri-form-input"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="field-farm" className="agri-form-label agri-form-label--required">
                      Farm / Holding
                    </label>
                    <select
                      id="field-farm"
                      name="farmId"
                      className="agri-form-select"
                      value={formData.farmId}
                      onChange={handleChange}
                    >
                      {farms.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="field-area" className="agri-form-label agri-form-label--required">
                      Area (Acres)
                    </label>
                    <input
                      id="field-area"
                      name="areaAcres"
                      type="number"
                      step="0.1"
                      min="0.2"
                      required
                      placeholder="e.g. 5.5"
                      className="agri-form-input"
                      value={formData.areaAcres}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="field-soil" className="agri-form-label">
                      Soil Type
                    </label>
                    <select
                      id="field-soil"
                      name="soilType"
                      className="agri-form-select"
                      value={formData.soilType}
                      onChange={handleChange}
                    >
                      <option value="Alluvial Loam">Alluvial Loam</option>
                      <option value="Loamy Soil">Loamy Soil</option>
                      <option value="Deep Black Soil">Deep Black Soil</option>
                      <option value="Medium Black Soil">Medium Black Soil</option>
                      <option value="Sandy Loam">Sandy Loam</option>
                      <option value="Clay Loam">Clay Loam</option>
                      <option value="Red Sandy Loam">Red Sandy Loam</option>
                    </select>
                  </div>
                </div>

                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="field-crop" className="agri-form-label">
                      Current Standing Crop
                    </label>
                    <input
                      id="field-crop"
                      name="currentCrop"
                      type="text"
                      placeholder="e.g. Wheat, Maize, Mustard"
                      className="agri-form-input"
                      value={formData.currentCrop}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="field-irrigation" className="agri-form-label">
                      Irrigation Method
                    </label>
                    <select
                      id="field-irrigation"
                      name="irrigationMethod"
                      className="agri-form-select"
                      value={formData.irrigationMethod}
                      onChange={handleChange}
                    >
                      <option value="Drip Irrigation">Drip Irrigation</option>
                      <option value="Sprinkler Irrigation">Sprinkler Irrigation</option>
                      <option value="Furrow Irrigation">Furrow Irrigation</option>
                      <option value="Canal Flow / Rainfed">Canal Flow / Rainfed</option>
                    </select>
                  </div>
                </div>

                <div className="agri-form-group">
                  <label htmlFor="field-notes" className="agri-form-label">
                    Plot Boundary Notes
                  </label>
                  <textarea
                    id="field-notes"
                    name="notes"
                    rows="2"
                    placeholder="Enter parcel landmarks, survey numbers, or notes..."
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
                Save Field Plot (Demo)
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
