import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../common';
import soilService from '../../services/soilService';
import { adaptSoilRecord } from '../../utils/adapters';

/**
 * AddSoilTestModal component
 * Modal dialog for recording a soil test laboratory certificate with backend persistence.
 */
export default function AddSoilTestModal({
  isOpen,
  onClose,
  onSoilTestAdded,
  fields = [],
}) {
  const { t } = useTranslation();
  const fallbackFieldId = fields[0]?.id ? String(fields[0].id) : '';
  const [formData, setFormData] = useState({
    fieldId: '',
    testDate: new Date().toISOString().split('T')[0],
    ph: '6.8',
    nitrogen: '250',
    phosphorus: '18',
    potassium: '270',
    organicCarbon: '0.65',
    moisturePercent: '38',
    recommendations: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const selectedFieldId = formData.fieldId || fallbackFieldId;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedFieldId || !formData.testDate) {
      setErrorMsg(t('validation.required', 'Please fill in all required fields.'));
      return;
    }

    const selectedFieldObj = fields.find((f) => String(f.id) === String(selectedFieldId));

    const payload = {
      soilType: selectedFieldObj?.soilType || 'Alluvial Loam',
      ph: formData.ph ? parseFloat(formData.ph) : null,
      nitrogen: formData.nitrogen ? parseFloat(formData.nitrogen) : null,
      phosphorus: formData.phosphorus ? parseFloat(formData.phosphorus) : null,
      potassium: formData.potassium ? parseFloat(formData.potassium) : null,
      organicMatter: formData.organicCarbon ? parseFloat(formData.organicCarbon) : null,
      moisture: formData.moisturePercent ? parseFloat(formData.moisturePercent) : null,
      recordedAt: formData.testDate,
      notes: formData.recommendations ? formData.recommendations.trim() : null,
    };

    setIsSubmitting(true);
    try {
      const createdRecord = await soilService.createSoilRecord(selectedFieldId, payload);
      const adapted = adaptSoilRecord({
        ...createdRecord,
        farmId: selectedFieldObj?.farmId || '',
        farmName: selectedFieldObj?.farmName || '',
      });
      setSubmitted(true);
      setTimeout(() => {
        onSoilTestAdded?.(adapted);
        setSubmitted(false);
        setIsSubmitting(false);
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || t('common.error', 'Failed to save soil test record. Please try again.'));
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-soil-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitted && !isSubmitting) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        <div className="agri-modal-header">
          <div>
            <h3 id="add-soil-title" className="agri-modal-title">
              {t('soil.addSoilTest', 'Record Laboratory Soil Test')}
            </h3>
            <p className="agri-modal-subtitle">
              {t('soil.subtitle', 'Log soil macronutrients, pH balance, and organic carbon data')}
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label={t('common.close', 'Close dialog')}
            disabled={submitted || isSubmitting}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="agri-modal-body">
            {/* Error Alert */}
            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#fef2f2',
                  color: '#b91c1c',
                  border: '1px solid #fecaca',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  marginBottom: '1.25rem',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={48} className="text-success" style={{ margin: '0 auto 1rem auto' }} aria-hidden="true" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                  {t('messages.soilTestAdded', 'Soil Test Record Saved!')}
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                  {t('common.loading', 'Updating field agronomic profile and nutrients...')}
                </p>
              </div>
            ) : (
              <div className="agri-form-grid">
                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="soil-field" className="agri-form-label agri-form-label--required">
                      {t('fields.fieldName', 'Target Field Plot')}
                    </label>
                    <select
                      id="soil-field"
                      name="fieldId"
                      className="agri-form-select"
                      value={selectedFieldId}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      {fields.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} {f.farmName ? `(${f.farmName})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="soil-date" className="agri-form-label agri-form-label--required">
                      {t('soil.testDate', 'Lab Sampling Date')}
                    </label>
                    <input
                      id="soil-date"
                      name="testDate"
                      type="date"
                      required
                      className="agri-form-input"
                      value={formData.testDate}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="soil-ph" className="agri-form-label">
                      {t('soil.ph', 'Soil pH')} (0 - 14)
                    </label>
                    <input
                      id="soil-ph"
                      name="ph"
                      type="number"
                      step="0.01"
                      min="0.00"
                      max="14.00"
                      placeholder="e.g. 6.8"
                      className="agri-form-input"
                      value={formData.ph}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="soil-oc" className="agri-form-label">
                      {t('soil.organicCarbon', 'Organic Matter (%)')}
                    </label>
                    <input
                      id="soil-oc"
                      name="organicCarbon"
                      type="number"
                      step="0.01"
                      min="0.00"
                      max="100.00"
                      placeholder="e.g. 0.72"
                      className="agri-form-input"
                      value={formData.organicCarbon}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="agri-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                  <div className="agri-form-group">
                    <label htmlFor="soil-n" className="agri-form-label">
                      {t('soil.nitrogen', 'Nitrogen (N)')} (kg/ha)
                    </label>
                    <input
                      id="soil-n"
                      name="nitrogen"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="kg/ha"
                      className="agri-form-input"
                      value={formData.nitrogen}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="soil-p" className="agri-form-label">
                      {t('soil.phosphorus', 'Phosphorus (P)')} (kg/ha)
                    </label>
                    <input
                      id="soil-p"
                      name="phosphorus"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="kg/ha"
                      className="agri-form-input"
                      value={formData.phosphorus}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="soil-k" className="agri-form-label">
                      {t('soil.potassium', 'Potassium (K)')} (kg/ha)
                    </label>
                    <input
                      id="soil-k"
                      name="potassium"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="kg/ha"
                      className="agri-form-input"
                      value={formData.potassium}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="agri-form-group">
                  <label htmlFor="soil-moist" className="agri-form-label">
                    {t('soil.moisture', 'Soil Moisture')} (%)
                  </label>
                  <input
                    id="soil-moist"
                    name="moisturePercent"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="e.g. 40"
                    className="agri-form-input"
                    value={formData.moisturePercent}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="agri-form-group">
                  <label htmlFor="soil-recom" className="agri-form-label">
                    {t('soil.recommendations', 'Lab Advisory / Recommendations')}
                  </label>
                  <textarea
                    id="soil-recom"
                    name="recommendations"
                    rows="2"
                    placeholder="e.g. Recommended top-dressing with neem-coated urea..."
                    className="agri-form-textarea"
                    value={formData.recommendations}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}
          </div>

          {!submitted && (
            <div className="agri-modal-footer">
              <Button variant="secondary" onClick={onClose} type="button" disabled={isSubmitting}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>{t('common.saving', 'Saving...')}</span>
                  </>
                ) : (
                  <span>{t('soil.addSoilTest', 'Save Soil Record')}</span>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
