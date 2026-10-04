import { useState } from 'react';
import { X, CheckCircle, Info } from 'lucide-react';
import { Button } from '../common';
import { cropTypes } from '../../data/cropData';

/**
 * AddMilestoneModal component
 * Allows scheduling a new crop milestone or agronomic field task in demo state.
 */
export default function AddMilestoneModal({
  isOpen,
  onClose,
  onMilestoneAdded,
  fields = [],
}) {
  const [formData, setFormData] = useState({
    title: '',
    fieldId: fields[0]?.id || 'field-1a',
    crop: 'Wheat',
    eventType: 'lifecycle',
    date: new Date().toISOString().split('T')[0],
    time: '08:00 AM',
    priority: 'Medium',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Milestone title is required');
      return;
    }

    const selectedField = fields.find((f) => f.id === formData.fieldId) || fields[0];

    let category = 'Crop Milestone';
    let statusVariant = 'info';
    if (formData.eventType === 'fertilizer') {
      category = 'Agronomic Input';
      statusVariant = 'neutral';
    } else if (formData.eventType === 'irrigation') {
      category = 'Water Management';
      statusVariant = 'info';
    } else if (formData.eventType === 'harvest') {
      category = 'Harvest Readiness';
      statusVariant = 'success';
    } else if (formData.eventType === 'crop_protection') {
      category = 'Crop Protection';
      statusVariant = 'warning';
    }

    const newMilestone = {
      id: `cal-${Date.now()}`,
      title: formData.title.trim(),
      crop: formData.crop,
      variety: selectedField?.cropVariety || 'Standard',
      fieldId: selectedField?.id || 'field-1a',
      fieldName: selectedField?.name || 'Field 1A',
      farmId: selectedField?.farmId || 'farm-1',
      farmName: selectedField?.farmName || 'Green Valley Farm',
      eventType: formData.eventType,
      category,
      date: formData.date,
      displayDate: formData.date,
      stage: selectedField?.cropStage || 'Vegetative Growth',
      status: 'Scheduled',
      statusVariant,
      priority: formData.priority,
      description: formData.description.trim() || 'Scheduled agronomic field task.',
    };

    setSubmitted(true);
    setTimeout(() => {
      onMilestoneAdded?.(newMilestone);
      setSubmitted(false);
      onClose();
    }, 1100);
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-milestone-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitted) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        <div className="agri-modal-header">
          <div>
            <h3 id="add-milestone-title" className="agri-modal-title">
              Schedule Crop Milestone
            </h3>
            <p className="agri-modal-subtitle">
              Add a lifecycle event, fertigation cycle, or harvest window
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
                <strong>Demo Mode:</strong> Scheduled milestone will be saved in memory for this session.
              </span>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={48} className="text-primary" style={{ margin: '0 auto 1rem auto' }} aria-hidden="true" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                  Milestone Scheduled!
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                  Adding to crop calendar and operational agenda...
                </p>
              </div>
            ) : (
              <div className="agri-form-grid">
                <div className="agri-form-group">
                  <label htmlFor="mile-title" className="agri-form-label agri-form-label--required">
                    Milestone Title
                  </label>
                  <input
                    id="mile-title"
                    name="title"
                    type="text"
                    required
                    placeholder="e.g. Wheat Anthesis Inspection & Nutrient Spray"
                    className={`agri-form-input ${error ? 'agri-form-input--error' : ''}`}
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {error && <span className="agri-form-error">{error}</span>}
                </div>

                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="mile-field" className="agri-form-label agri-form-label--required">
                      Target Field
                    </label>
                    <select
                      id="mile-field"
                      name="fieldId"
                      className="agri-form-select"
                      value={formData.fieldId}
                      onChange={handleChange}
                    >
                      {fields.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.farmName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="mile-crop" className="agri-form-label agri-form-label--required">
                      Standing Crop
                    </label>
                    <select
                      id="mile-crop"
                      name="crop"
                      className="agri-form-select"
                      value={formData.crop}
                      onChange={handleChange}
                    >
                      {cropTypes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="mile-type" className="agri-form-label agri-form-label--required">
                      Event Category
                    </label>
                    <select
                      id="mile-type"
                      name="eventType"
                      className="agri-form-select"
                      value={formData.eventType}
                      onChange={handleChange}
                    >
                      <option value="lifecycle">Crop Lifecycle Stage</option>
                      <option value="fertilizer">Fertilizer & Nutrition</option>
                      <option value="irrigation">Irrigation Pulse</option>
                      <option value="crop_protection">Crop Protection & Weeding</option>
                      <option value="harvest">Harvest Readiness Window</option>
                    </select>
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="mile-date" className="agri-form-label agri-form-label--required">
                      Scheduled Date
                    </label>
                    <input
                      id="mile-date"
                      name="date"
                      type="date"
                      required
                      className="agri-form-input"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="agri-form-group">
                  <label htmlFor="mile-desc" className="agri-form-label">
                    Activity Instructions & Advisory
                  </label>
                  <textarea
                    id="mile-desc"
                    name="description"
                    rows="2"
                    placeholder="Enter agronomic requirements or machinery needed..."
                    className="agri-form-textarea"
                    value={formData.description}
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
                Schedule Milestone
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
