import { useState } from 'react';
import { X, CheckCircle, Info } from 'lucide-react';
import { Button } from '../common';

/**
 * AddSoilTestModal component
 * Polished demo modal for recording a soil test laboratory certificate.
 */
export default function AddSoilTestModal({
  isOpen,
  onClose,
  onSoilTestAdded,
  fields = [],
}) {
  const [formData, setFormData] = useState({
    fieldId: fields[0]?.id || 'field-1a',
    testDate: new Date().toISOString().split('T')[0],
    ph: '6.8',
    nitrogen: '250',
    phosphorus: '18',
    potassium: '270',
    organicCarbon: '0.65',
    moisturePercent: '38',
    recommendations: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedFieldObj = fields.find((f) => f.id === formData.fieldId) || fields[0];

    const phVal = parseFloat(formData.ph) || 7.0;
    const nVal = parseInt(formData.nitrogen, 10) || 240;
    const pVal = parseInt(formData.phosphorus, 10) || 16;
    const kVal = parseInt(formData.potassium, 10) || 250;
    const ocVal = parseFloat(formData.organicCarbon) || 0.6;
    const moistVal = parseInt(formData.moisturePercent, 10) || 35;

    let computedStatus = 'Good';
    let computedVariant = 'success';
    if (phVal < 6.0 || phVal > 8.0 || nVal < 180 || ocVal < 0.45) {
      computedStatus = 'Needs Attention';
      computedVariant = 'danger';
    } else if (phVal < 6.5 || phVal > 7.5 || nVal < 220) {
      computedStatus = 'Moderate';
      computedVariant = 'warning';
    }

    const newRecord = {
      id: `soil-${Date.now()}`,
      fieldId: selectedFieldObj ? selectedFieldObj.id : 'field-custom',
      fieldName: selectedFieldObj ? selectedFieldObj.name : 'Custom Field',
      farmId: selectedFieldObj ? selectedFieldObj.farmId : 'farm-1',
      farmName: selectedFieldObj ? selectedFieldObj.farmName : 'Green Valley Farm',
      testDate: formData.testDate,
      testedDaysAgo: 'Just now (Demo)',
      soilType: selectedFieldObj ? selectedFieldObj.soilType : 'Alluvial Loam',
      ph: phVal,
      phRating: phVal >= 6.5 && phVal <= 7.5 ? 'Neutral (Optimal)' : phVal < 6.5 ? 'Acidic' : 'Alkaline',
      phStatus: computedVariant,
      nitrogen: nVal,
      nitrogenRating: nVal >= 280 ? 'High' : nVal >= 200 ? 'Medium' : 'Low',
      nitrogenBenchmark: '280–560 kg/ha',
      phosphorus: pVal,
      phosphorusRating: pVal >= 20 ? 'High' : pVal >= 12 ? 'Medium' : 'Low',
      phosphorusBenchmark: '11–22 kg/ha',
      potassium: kVal,
      potassiumRating: kVal >= 280 ? 'High' : kVal >= 180 ? 'Medium' : 'Low',
      potassiumBenchmark: '140–280 kg/ha',
      organicCarbon: ocVal,
      organicCarbonRating: ocVal >= 0.75 ? 'High' : ocVal >= 0.5 ? 'Medium' : 'Low',
      electricalConductivity: 0.38,
      moisturePercent: moistVal,
      moistureRating: moistVal >= 35 ? 'Optimal' : 'Low',
      status: computedStatus,
      statusVariant: computedVariant,
      recommendations: formData.recommendations || 'Lab verified. Follow regular fertigation cycle.',
      labName: 'Central Soil Testing Laboratory (Demo)',
      sampleId: `SOIL-${Date.now().toString().slice(-4)}`,
    };

    setSubmitted(true);
    setTimeout(() => {
      onSoilTestAdded?.(newRecord);
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-soil-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitted) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        <div className="agri-modal-header">
          <div>
            <h3 id="add-soil-title" className="agri-modal-title">
              Record Laboratory Soil Test
            </h3>
            <p className="agri-modal-subtitle">
              Log soil macronutrients, pH balance, and organic carbon data
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
                <strong>Demo Mode:</strong> Recorded test data is calculated and stored in memory for this session.
              </span>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={48} className="text-success" style={{ margin: '0 auto 1rem auto' }} aria-hidden="true" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                  Soil Test Record Saved!
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                  Updating field agronomic profile and nutrients...
                </p>
              </div>
            ) : (
              <div className="agri-form-grid">
                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="soil-field" className="agri-form-label agri-form-label--required">
                      Target Field Plot
                    </label>
                    <select
                      id="soil-field"
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
                    <label htmlFor="soil-date" className="agri-form-label agri-form-label--required">
                      Lab Sampling Date
                    </label>
                    <input
                      id="soil-date"
                      name="testDate"
                      type="date"
                      required
                      className="agri-form-input"
                      value={formData.testDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="soil-ph" className="agri-form-label agri-form-label--required">
                      Soil pH (0 - 14)
                    </label>
                    <input
                      id="soil-ph"
                      name="ph"
                      type="number"
                      step="0.1"
                      min="3.0"
                      max="11.0"
                      required
                      placeholder="e.g. 6.8"
                      className="agri-form-input"
                      value={formData.ph}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="soil-oc" className="agri-form-label agri-form-label--required">
                      Organic Carbon (OC %)
                    </label>
                    <input
                      id="soil-oc"
                      name="organicCarbon"
                      type="number"
                      step="0.01"
                      min="0.1"
                      max="2.5"
                      required
                      placeholder="e.g. 0.72"
                      className="agri-form-input"
                      value={formData.organicCarbon}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="agri-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                  <div className="agri-form-group">
                    <label htmlFor="soil-n" className="agri-form-label">
                      Nitrogen (N)
                    </label>
                    <input
                      id="soil-n"
                      name="nitrogen"
                      type="number"
                      placeholder="kg/ha"
                      className="agri-form-input"
                      value={formData.nitrogen}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="soil-p" className="agri-form-label">
                      Phosphorus (P)
                    </label>
                    <input
                      id="soil-p"
                      name="phosphorus"
                      type="number"
                      placeholder="kg/ha"
                      className="agri-form-input"
                      value={formData.phosphorus}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="soil-k" className="agri-form-label">
                      Potassium (K)
                    </label>
                    <input
                      id="soil-k"
                      name="potassium"
                      type="number"
                      placeholder="kg/ha"
                      className="agri-form-input"
                      value={formData.potassium}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="agri-form-group">
                  <label htmlFor="soil-moist" className="agri-form-label">
                    Soil Moisture (%)
                  </label>
                  <input
                    id="soil-moist"
                    name="moisturePercent"
                    type="number"
                    min="5"
                    max="90"
                    placeholder="e.g. 40"
                    className="agri-form-input"
                    value={formData.moisturePercent}
                    onChange={handleChange}
                  />
                </div>

                <div className="agri-form-group">
                  <label htmlFor="soil-recom" className="agri-form-label">
                    Lab Advisory / Recommendations
                  </label>
                  <textarea
                    id="soil-recom"
                    name="recommendations"
                    rows="2"
                    placeholder="e.g. Recommended top-dressing with neem-coated urea..."
                    className="agri-form-textarea"
                    value={formData.recommendations}
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
                Save Soil Record (Demo)
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
