import { useState, useId } from 'react';
import { X, PackageCheck } from 'lucide-react';
import { Button } from '../common';
import { farmData } from '../../data/farmData';
import { fieldData } from '../../data/fieldData';

function getNextHarvestId() {
  return `HAR-00${Math.floor(Math.random() * 900) + 100}`;
}

function getNextCropCycleId() {
  return `crop-cycle-${Date.now()}`;
}

export default function AddHarvestModal({ onClose, onAddHarvest }) {
  const farmSelectId = useId();
  const fieldSelectId = useId();
  const cropInputId = useId();
  const varietyInputId = useId();
  const seasonSelectId = useId();
  const dateInputId = useId();
  const expectedYieldId = useId();
  const actualQtyId = useId();
  const qualityGradeId = useId();
  const qualityScoreId = useId();
  const moistureId = useId();
  const storageId = useId();
  const notesId = useId();

  const farms = farmData.farms || [];
  const allFields = fieldData.fields || [];

  const [farmId, setFarmId] = useState(farms[0]?.id || 'farm-1');
  const availableFields = allFields.filter((f) => f.farmId === farmId);
  const [fieldId, setFieldId] = useState(availableFields[0]?.id || 'field-1a');

  const selectedField = allFields.find((f) => f.id === fieldId) || availableFields[0];

  const [cropName, setCropName] = useState(selectedField?.currentCrop || 'Wheat');
  const [variety, setVariety] = useState(selectedField?.cropVariety || 'Sharbati');
  const [season, setSeason] = useState(selectedField?.cropSeason || 'Rabi');
  const [harvestDate, setHarvestDate] = useState('2026-10-03');
  const [expectedYieldKg, setExpectedYieldKg] = useState('2500');
  const [harvestedQuantityKg, setHarvestedQuantityKg] = useState('2400');
  const [qualityGrade, setQualityGrade] = useState('A');
  const [qualityScore, setQualityScore] = useState('92');
  const [moisturePercent, setMoisturePercent] = useState('11.5');
  const [storageLocation, setStorageLocation] = useState('Central Granary - Silo #1');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});

  const handleFarmChange = (newFarmId) => {
    setFarmId(newFarmId);
    const newFields = allFields.filter((f) => f.farmId === newFarmId);
    if (newFields.length > 0) {
      setFieldId(newFields[0].id);
      setCropName(newFields[0].currentCrop || 'Wheat');
      setVariety(newFields[0].cropVariety || '');
      setSeason(newFields[0].cropSeason || 'Rabi');
    } else {
      setFieldId('');
    }
  };

  const handleFieldChange = (newFieldId) => {
    setFieldId(newFieldId);
    const f = allFields.find((field) => field.id === newFieldId);
    if (f) {
      setCropName(f.currentCrop || 'Wheat');
      setVariety(f.cropVariety || '');
      setSeason(f.cropSeason || 'Rabi');
    }
  };

  const validate = () => {
    const errs = {};
    if (!farmId) errs.farmId = 'Please select a farm';
    if (!fieldId) errs.fieldId = 'Please select a field';
    if (!cropName.trim()) errs.cropName = 'Crop name is required';
    if (!harvestDate) errs.harvestDate = 'Harvest date is required';

    const actualQty = Number(harvestedQuantityKg);
    if (isNaN(actualQty) || actualQty < 0) {
      errs.harvestedQuantityKg = 'Harvested quantity must be 0 or greater';
    }

    const expYield = Number(expectedYieldKg);
    if (isNaN(expYield) || expYield < 0) {
      errs.expectedYieldKg = 'Expected yield must be 0 or greater';
    }

    const score = Number(qualityScore);
    if (isNaN(score) || score < 1 || score > 100) {
      errs.qualityScore = 'Score must be between 1 and 100';
    }

    const moisture = Number(moisturePercent);
    if (isNaN(moisture) || moisture < 0 || moisture > 100) {
      errs.moisturePercent = 'Moisture must be between 0 and 100%';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const farmObj = farms.find((f) => f.id === farmId);
    const fieldObj = allFields.find((f) => f.id === fieldId);

    const actual = Number(harvestedQuantityKg);
    const status = actual === 0 ? 'PLANNED' : 'HARVESTED';

    const newHarvest = {
      id: getNextHarvestId(),
      farmId,
      farmName: farmObj ? farmObj.name : 'Green Valley Farm',
      fieldId,
      fieldName: fieldObj ? fieldObj.name : 'Field 1A',
      cropId: getNextCropCycleId(),
      cropName: cropName.trim(),
      variety: variety.trim() || 'Standard Variety',
      season,
      harvestDate,
      expectedYieldKg: Number(expectedYieldKg) || actual,
      harvestedQuantityKg: actual,
      availableQuantityKg: actual,
      soldQuantityKg: 0,
      qualityGrade,
      qualityScore: Number(qualityScore) || 90,
      moisturePercent: Number(moisturePercent) || 12.0,
      status,
      storageLocation: storageLocation.trim() || 'Central Storage Yard',
      notes: notes.trim() || 'Harvested under optimal dry weather conditions.',
    };

    onAddHarvest(newHarvest);
    onClose();
  };

  return (
    <div
      className="agri-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-harvest-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="agri-modal-dialog agri-modal-dialog--lg">
        {/* Header */}
        <div className="agri-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontSize: '0.75rem', fontWeight: 600 }}>
              <PackageCheck size={14} />
              <span>Produce Intake & Logging</span>
            </div>
            <h3 id="add-harvest-title" className="agri-modal-title">
              Record New Harvest
            </h3>
            <p className="agri-modal-subtitle">
              Enter harvested lot metrics, quality evaluation, and granary storage allocation.
            </p>
          </div>
          <button
            type="button"
            className="agri-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="agri-modal-body">
            {/* Dependent Farm and Field selection */}
            <div className="agri-form-grid agri-form-grid--2">
              <div className="agri-form-group">
                <label htmlFor={farmSelectId} className="agri-form-label agri-form-label--required">
                  Farm / Holding
                </label>
                <select
                  id={farmSelectId}
                  className="agri-form-select"
                  value={farmId}
                  onChange={(e) => handleFarmChange(e.target.value)}
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.district})
                    </option>
                  ))}
                </select>
                {errors.farmId && <span className="agri-form-help text-danger">{errors.farmId}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={fieldSelectId} className="agri-form-label agri-form-label--required">
                  Field
                </label>
                <select
                  id={fieldSelectId}
                  className="agri-form-select"
                  value={fieldId}
                  onChange={(e) => handleFieldChange(e.target.value)}
                >
                  {availableFields.map((fld) => (
                    <option key={fld.id} value={fld.id}>
                      {fld.name} ({fld.areaAcres} Acres - {fld.currentCrop})
                    </option>
                  ))}
                </select>
                {errors.fieldId && <span className="agri-form-help text-danger">{errors.fieldId}</span>}
              </div>
            </div>

            {/* Crop, Variety, Season */}
            <div className="agri-form-grid agri-form-grid--3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="agri-form-group">
                <label htmlFor={cropInputId} className="agri-form-label agri-form-label--required">
                  Crop Name
                </label>
                <input
                  id={cropInputId}
                  type="text"
                  className="agri-form-input"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="e.g. Wheat"
                />
                {errors.cropName && <span className="agri-form-help text-danger">{errors.cropName}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={varietyInputId} className="agri-form-label">
                  Variety
                </label>
                <input
                  id={varietyInputId}
                  type="text"
                  className="agri-form-input"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Sharbati"
                />
              </div>

              <div className="agri-form-group">
                <label htmlFor={seasonSelectId} className="agri-form-label">
                  Season
                </label>
                <select
                  id={seasonSelectId}
                  className="agri-form-select"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                >
                  <option value="Rabi">Rabi</option>
                  <option value="Kharif">Kharif</option>
                  <option value="Zaid">Zaid</option>
                </select>
              </div>
            </div>

            {/* Harvest Date, Expected Yield, Actual Yield */}
            <div className="agri-form-grid agri-form-grid--3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="agri-form-group">
                <label htmlFor={dateInputId} className="agri-form-label agri-form-label--required">
                  Harvest Date
                </label>
                <input
                  id={dateInputId}
                  type="date"
                  className="agri-form-input"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                />
                {errors.harvestDate && <span className="agri-form-help text-danger">{errors.harvestDate}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={expectedYieldId} className="agri-form-label">
                  Expected Yield (kg)
                </label>
                <input
                  id={expectedYieldId}
                  type="number"
                  className="agri-form-input"
                  value={expectedYieldKg}
                  onChange={(e) => setExpectedYieldKg(e.target.value)}
                  min="0"
                  placeholder="e.g. 2500"
                />
                {errors.expectedYieldKg && <span className="agri-form-help text-danger">{errors.expectedYieldKg}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={actualQtyId} className="agri-form-label agri-form-label--required">
                  Harvested Qty (kg)
                </label>
                <input
                  id={actualQtyId}
                  type="number"
                  className="agri-form-input"
                  value={harvestedQuantityKg}
                  onChange={(e) => setHarvestedQuantityKg(e.target.value)}
                  min="0"
                  placeholder="e.g. 2400"
                />
                <span className="agri-form-help">
                  {(Number(harvestedQuantityKg || 0) / 100).toFixed(1)} quintals
                </span>
                {errors.harvestedQuantityKg && <span className="agri-form-help text-danger">{errors.harvestedQuantityKg}</span>}
              </div>
            </div>

            {/* Quality Grade, Score, Moisture */}
            <div className="agri-form-grid agri-form-grid--3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
              <div className="agri-form-group">
                <label htmlFor={qualityGradeId} className="agri-form-label">
                  Quality Grade
                </label>
                <select
                  id={qualityGradeId}
                  className="agri-form-select"
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                >
                  <option value="A">Grade A (Premium)</option>
                  <option value="B">Grade B (Standard)</option>
                  <option value="C">Grade C (Commercial)</option>
                </select>
              </div>

              <div className="agri-form-group">
                <label htmlFor={qualityScoreId} className="agri-form-label">
                  Quality Score (1-100)
                </label>
                <input
                  id={qualityScoreId}
                  type="number"
                  className="agri-form-input"
                  value={qualityScore}
                  onChange={(e) => setQualityScore(e.target.value)}
                  min="1"
                  max="100"
                />
                {errors.qualityScore && <span className="agri-form-help text-danger">{errors.qualityScore}</span>}
              </div>

              <div className="agri-form-group">
                <label htmlFor={moistureId} className="agri-form-label">
                  Moisture (%)
                </label>
                <input
                  id={moistureId}
                  type="number"
                  step="0.1"
                  className="agri-form-input"
                  value={moisturePercent}
                  onChange={(e) => setMoisturePercent(e.target.value)}
                  placeholder="e.g. 11.5"
                />
                {errors.moisturePercent && <span className="agri-form-help text-danger">{errors.moisturePercent}</span>}
              </div>
            </div>

            {/* Storage Location */}
            <div className="agri-form-group">
              <label htmlFor={storageId} className="agri-form-label">
                Storage Allocation
              </label>
              <input
                id={storageId}
                type="text"
                className="agri-form-input"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                placeholder="e.g. Central Granary - Silo #1"
              />
            </div>

            {/* Notes */}
            <div className="agri-form-group">
              <label htmlFor={notesId} className="agri-form-label">
                Field & Grain Inspection Notes
              </label>
              <textarea
                id={notesId}
                className="agri-form-textarea"
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Record observation notes, grain color, drying status..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="agri-modal-footer">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Harvest Record
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
