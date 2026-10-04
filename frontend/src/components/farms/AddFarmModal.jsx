import { useState } from 'react';
import { X, CheckCircle, Info } from 'lucide-react';
import { Button } from '../common';

/**
 * AddFarmModal component
 * Polished modal dialog for demo "Add Farm" registration.
 */
export default function AddFarmModal({ isOpen, onClose, onFarmAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    district: 'Karnal',
    state: 'Haryana',
    areaAcres: '',
    soilType: 'Alluvial Loam',
    waterSource: 'Borewell / Tube Well',
    primaryCrop: '',
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

    const newFarm = {
      id: `farm-${Date.now()}`,
      name: formData.name,
      code: `FRM-00${Math.floor(Math.random() * 90 + 10)}`,
      location: formData.location || 'Demo Village',
      district: formData.district,
      state: formData.state,
      areaAcres: parseFloat(formData.areaAcres) || 5.0,
      fieldsCount: 0,
      fieldIds: [],
      primaryCrops: formData.primaryCrop ? [formData.primaryCrop] : ['Wheat'],
      soilSummary: `${formData.soilType} (Demo Logged)`,
      irrigationSummary: formData.waterSource,
      waterSource: formData.waterSource,
      status: 'Active',
      statusVariant: 'success',
      establishedYear: new Date().getFullYear(),
      owner: 'XYZ (Farmer)',
      notes: formData.notes || 'Newly registered demo farm holding.',
    };

    setSubmitted(true);
    setTimeout(() => {
      onFarmAdded?.(newFarm);
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-farm-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitted) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        <div className="agri-modal-header">
          <div>
            <h3 id="add-farm-title" className="agri-modal-title">
              Register New Farm Holding
            </h3>
            <p className="agri-modal-subtitle">
              Add a new property or land parcel to your operational portfolio
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
                <strong>Demo Mode:</strong> New farms are stored in memory for this session without backend persistence.
              </span>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={48} className="text-success" style={{ margin: '0 auto 1rem auto' }} aria-hidden="true" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                  Farm Holding Registered Successfully!
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                  Adding &ldquo;{formData.name}&rdquo; to your farm portfolio...
                </p>
              </div>
            ) : (
              <div className="agri-form-grid">
                <div className="agri-form-group">
                  <label htmlFor="farm-name" className="agri-form-label agri-form-label--required">
                    Farm / Holding Name
                  </label>
                  <input
                    id="farm-name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. West Canal Ridge Farm"
                    className="agri-form-input"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="farm-location" className="agri-form-label agri-form-label--required">
                      Location / Village
                    </label>
                    <input
                      id="farm-location"
                      name="location"
                      type="text"
                      required
                      placeholder="e.g. Sector 4, Demo Village"
                      className="agri-form-input"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="farm-area" className="agri-form-label agri-form-label--required">
                      Total Area (Acres)
                    </label>
                    <input
                      id="farm-area"
                      name="areaAcres"
                      type="number"
                      step="0.1"
                      min="0.5"
                      required
                      placeholder="e.g. 10.5"
                      className="agri-form-input"
                      value={formData.areaAcres}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="farm-soil" className="agri-form-label">
                      Dominant Soil Type
                    </label>
                    <select
                      id="farm-soil"
                      name="soilType"
                      className="agri-form-select"
                      value={formData.soilType}
                      onChange={handleChange}
                    >
                      <option value="Alluvial Loam">Alluvial Loam</option>
                      <option value="Deep Black Soil">Deep Black Soil</option>
                      <option value="Medium Black Soil">Medium Black Soil</option>
                      <option value="Sandy Loam">Sandy Loam</option>
                      <option value="Clay Loam">Clay Loam</option>
                      <option value="Red Sandy Loam">Red Sandy Loam</option>
                    </select>
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="farm-water" className="agri-form-label">
                      Primary Water Source
                    </label>
                    <select
                      id="farm-water"
                      name="waterSource"
                      className="agri-form-select"
                      value={formData.waterSource}
                      onChange={handleChange}
                    >
                      <option value="Borewell / Tube Well">Borewell / Tube Well</option>
                      <option value="Drip Irrigation Network">Drip Irrigation Network</option>
                      <option value="Canal Lift + Pump">Canal Lift + Pump</option>
                      <option value="Farm Pond & Solar Pump">Farm Pond & Solar Pump</option>
                      <option value="Rainfed Catchment">Rainfed Catchment</option>
                    </select>
                  </div>
                </div>

                <div className="agri-form-group">
                  <label htmlFor="farm-crop" className="agri-form-label">
                    Primary Crop (Initial Planting)
                  </label>
                  <input
                    id="farm-crop"
                    name="primaryCrop"
                    type="text"
                    placeholder="e.g. Wheat (HD 2967) or Maize"
                    className="agri-form-input"
                    value={formData.primaryCrop}
                    onChange={handleChange}
                  />
                </div>

                <div className="agri-form-group">
                  <label htmlFor="farm-notes" className="agri-form-label">
                    Operational Notes (Optional)
                  </label>
                  <textarea
                    id="farm-notes"
                    name="notes"
                    rows="2"
                    placeholder="Add topography or infrastructure details..."
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
                Register Farm (Demo)
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
