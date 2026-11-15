import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../common';
import farmService from '../../services/farmService';
import { adaptFarm } from '../../utils/adapters';

/**
 * AddFarmModal component
 * Modal dialog for registering a new farm holding with backend persistence.
 */
export default function AddFarmModal({ isOpen, onClose, onFarmAdded }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    areaAcres: '',
    soilType: 'Alluvial Loam',
    waterSource: 'Borewell / Tube Well',
    primaryCrop: '',
    notes: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.location.trim() || !formData.areaAcres) {
      setErrorMsg(t('validation.required', 'Please fill in all required fields.'));
      return;
    }

    const totalAreaNum = parseFloat(formData.areaAcres);
    if (isNaN(totalAreaNum) || totalAreaNum <= 0) {
      setErrorMsg(t('validation.number', 'Please enter a valid area greater than 0.'));
      return;
    }

    const payload = {
      farmName: formData.name.trim(),
      location: formData.location.trim(),
      totalArea: totalAreaNum,
      areaUnit: 'Acres',
      description: formData.notes ? formData.notes.trim() : null,
      status: 'Active',
    };

    setIsSubmitting(true);
    try {
      const createdFarm = await farmService.createFarm(payload);
      const adapted = adaptFarm(createdFarm, []);
      setSubmitted(true);
      setTimeout(() => {
        onFarmAdded?.(adapted);
        setSubmitted(false);
        setIsSubmitting(false);
        setFormData({
          name: '',
          location: '',
          areaAcres: '',
          soilType: 'Alluvial Loam',
          waterSource: 'Borewell / Tube Well',
          primaryCrop: '',
          notes: '',
        });
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || t('common.error', 'Failed to register farm holding. Please try again.'));
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-farm-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitted && !isSubmitting) onClose();
      }}
    >
      <div className="agri-modal-dialog">
        <div className="agri-modal-header">
          <div>
            <h3 id="add-farm-title" className="agri-modal-title">
              {t('farms.addFarm', 'Register New Farm Holding')}
            </h3>
            <p className="agri-modal-subtitle">
              {t('farms.subtitle', 'Add a new property or land parcel to your operational portfolio')}
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
            {/* Error Banner */}
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
                  {t('messages.farmAdded', 'Farm Holding Registered Successfully!')}
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                  {t('common.loading', 'Adding')} &ldquo;{formData.name}&rdquo;...
                </p>
              </div>
            ) : (
              <div className="agri-form-grid">
                <div className="agri-form-group">
                  <label htmlFor="farm-name" className="agri-form-label agri-form-label--required">
                    {t('farms.farmName', 'Farm / Holding Name')}
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
                    disabled={isSubmitting}
                  />
                </div>

                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="farm-location" className="agri-form-label agri-form-label--required">
                      {t('farms.location', 'Location / Village')}
                    </label>
                    <input
                      id="farm-location"
                      name="location"
                      type="text"
                      required
                      placeholder="e.g. Sector 4, Karnal"
                      className="agri-form-input"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="farm-area" className="agri-form-label agri-form-label--required">
                      {t('farms.totalArea', 'Total Area')} ({t('units.acres', 'Acres')})
                    </label>
                    <input
                      id="farm-area"
                      name="areaAcres"
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="e.g. 10.5"
                      className="agri-form-input"
                      value={formData.areaAcres}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="agri-form-grid--2 agri-form-grid">
                  <div className="agri-form-group">
                    <label htmlFor="farm-soil" className="agri-form-label">
                      {t('farms.soilType', 'Dominant Soil Type')}
                    </label>
                    <select
                      id="farm-soil"
                      name="soilType"
                      className="agri-form-select"
                      value={formData.soilType}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="Alluvial Loam">{t('soil.types.alluvialLoam', 'Alluvial Loam')}</option>
                      <option value="Deep Black Soil">{t('soil.types.deepBlackSoil', 'Deep Black Soil')}</option>
                      <option value="Medium Black Soil">{t('soil.types.mediumBlackSoil', 'Medium Black Soil')}</option>
                      <option value="Sandy Loam">{t('soil.types.sandyLoam', 'Sandy Loam')}</option>
                      <option value="Clay Loam">{t('soil.types.clayLoam', 'Clay Loam')}</option>
                      <option value="Red Sandy Loam">{t('soil.types.redSandyLoam', 'Red Sandy Loam')}</option>
                    </select>
                  </div>

                  <div className="agri-form-group">
                    <label htmlFor="farm-water" className="agri-form-label">
                      {t('farms.irrigationSource', 'Primary Water Source')}
                    </label>
                    <select
                      id="farm-water"
                      name="waterSource"
                      className="agri-form-select"
                      value={formData.waterSource}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="Borewell / Tube Well">{t('farms.waterSources.borewell', 'Borewell / Tube Well')}</option>
                      <option value="Drip Irrigation Network">{t('farms.waterSources.drip', 'Drip Irrigation Network')}</option>
                      <option value="Canal Lift + Pump">{t('farms.waterSources.canal', 'Canal Lift + Pump')}</option>
                      <option value="Farm Pond & Solar Pump">{t('farms.waterSources.pond', 'Farm Pond & Solar Pump')}</option>
                      <option value="Rainfed Catchment">{t('farms.waterSources.rainfed', 'Rainfed Catchment')}</option>
                    </select>
                  </div>
                </div>

                <div className="agri-form-group">
                  <label htmlFor="farm-notes" className="agri-form-label">
                    {t('common.notes', 'Operational Notes')} ({t('common.optional', 'Optional')})
                  </label>
                  <textarea
                    id="farm-notes"
                    name="notes"
                    rows="2"
                    placeholder="Add topography or infrastructure details..."
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
                    <span>{t('common.saving', 'Registering...')}</span>
                  </>
                ) : (
                  <span>{t('farms.addFarm', 'Register Farm')}</span>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
