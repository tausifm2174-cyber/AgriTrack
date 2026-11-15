import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../common';
import fieldService from '../../services/fieldService';
import { adaptField } from '../../utils/adapters';

/**
 * AddFieldModal component
 * Modal for mapping a new field plot under a farm holding with backend persistence.
 */
export default function AddFieldModal({
  isOpen,
  onClose,
  onFieldAdded,
  farms = [],
  defaultFarmId = '',
}) {
  const { t } = useTranslation();
  const fallbackFarmId = defaultFarmId || (farms[0]?.id ? String(farms[0].id) : '');
  const [formData, setFormData] = useState({
    name: '',
    farmId: '',
    areaAcres: '',
    soilType: 'Alluvial Loam',
    irrigationMethod: 'Drip Irrigation',
    notes: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const selectedFarmId = formData.farmId || fallbackFarmId;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !selectedFarmId || !formData.areaAcres) {
      setErrorMsg(t('validation.required', 'Please fill in all required fields.'));
      return;
    }

    const areaNum = parseFloat(formData.areaAcres);
    if (isNaN(areaNum) || areaNum <= 0) {
      setErrorMsg(t('validation.number', 'Please enter a valid area greater than 0.'));
      return;
    }

    const payload = {
      fieldName: formData.name.trim(),
      area: areaNum,
      areaUnit: 'Acres',
      soilType: formData.soilType || null,
      irrigationType: formData.irrigationMethod || null,
      status: 'Active',
      description: formData.notes ? formData.notes.trim() : null,
    };

    setIsSubmitting(true);
    try {
      const createdField = await fieldService.createField(selectedFarmId, payload);
      const adapted = adaptField(createdField);
      setSubmitted(true);
      setTimeout(() => {
        onFieldAdded?.(adapted);
        setSubmitted(false);
        setIsSubmitting(false);
        setFormData({
          name: '',
          farmId: '',
          areaAcres: '',
          soilType: 'Alluvial Loam',
          irrigationMethod: 'Drip Irrigation',
          notes: '',
        });
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || t('common.error', 'Failed to map field plot. Please try again.'));
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-field-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitted && !isSubmitting) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        <div className="agri-modal-header">
          <div>
            <h3 id="add-field-title" className="agri-modal-title">
              {t('fields.addField', 'Map New Field Plot')}
            </h3>
            <p className="agri-modal-subtitle">
              {t('fields.subtitle', 'Register a cultivation parcel and associate it with a farm holding')}
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
                  {t('messages.fieldAdded', 'Field Plot Mapped Successfully!')}
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                  {t('common.loading', 'Adding')} &ldquo;{formData.name}&rdquo;...
                </p>
              </div>
            ) : (
              <div className="agri-form-grid">
                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="field-name" className="agri-form-label agri-form-label--required">
                      {t('fields.fieldName', 'Field Identifier / Name')}
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
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="field-farm" className="agri-form-label agri-form-label--required">
                      {t('fields.farm', 'Farm / Holding')}
                    </label>
                    <select
                      id="field-farm"
                      name="farmId"
                      className="agri-form-select"
                      value={selectedFarmId}
                      onChange={handleChange}
                      disabled={isSubmitting}
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
                      {t('fields.area', 'Area')} ({t('units.acres', 'Acres')})
                    </label>
                    <input
                      id="field-area"
                      name="areaAcres"
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="e.g. 5.5"
                      className="agri-form-input"
                      value={formData.areaAcres}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="field-soil" className="agri-form-label">
                      {t('fields.soilType', 'Soil Type')}
                    </label>
                    <select
                      id="field-soil"
                      name="soilType"
                      className="agri-form-select"
                      value={formData.soilType}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="Alluvial Loam">{t('soil.types.alluvialLoam', 'Alluvial Loam')}</option>
                      <option value="Loamy Soil">{t('soil.types.loamySoil', 'Loamy Soil')}</option>
                      <option value="Deep Black Soil">{t('soil.types.deepBlackSoil', 'Deep Black Soil')}</option>
                      <option value="Medium Black Soil">{t('soil.types.mediumBlackSoil', 'Medium Black Soil')}</option>
                      <option value="Sandy Loam">{t('soil.types.sandyLoam', 'Sandy Loam')}</option>
                      <option value="Clay Loam">{t('soil.types.clayLoam', 'Clay Loam')}</option>
                      <option value="Red Sandy Loam">{t('soil.types.redSandyLoam', 'Red Sandy Loam')}</option>
                    </select>
                  </div>
                </div>

                <div className="agri-form-group">
                  <label htmlFor="field-irrigation" className="agri-form-label">
                    {t('fields.irrigationSystem', 'Irrigation Method')}
                  </label>
                  <select
                    id="field-irrigation"
                    name="irrigationMethod"
                    className="agri-form-select"
                    value={formData.irrigationMethod}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="Drip Irrigation">{t('irrigation.methods.drip', 'Drip Irrigation')}</option>
                    <option value="Sprinkler Irrigation">{t('irrigation.methods.sprinkler', 'Sprinkler Irrigation')}</option>
                    <option value="Furrow Irrigation">{t('irrigation.methods.furrow', 'Furrow Irrigation')}</option>
                    <option value="Canal Flow / Rainfed">{t('irrigation.methods.flood', 'Canal Flow / Rainfed')}</option>
                  </select>
                </div>

                <div className="agri-form-group">
                  <label htmlFor="field-notes" className="agri-form-label">
                    {t('common.notes', 'Plot Boundary Notes')} ({t('common.optional', 'Optional')})
                  </label>
                  <textarea
                    id="field-notes"
                    name="notes"
                    rows="2"
                    placeholder="Enter parcel landmarks, survey numbers, or notes..."
                    className="agri-form-textarea"
                    value={formData.notes}
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
                  <span>{t('fields.addField', 'Save Field Plot')}</span>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
