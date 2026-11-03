import { useTranslation } from 'react-i18next';
import { Droplets, Sparkles, Waves } from 'lucide-react';

/**
 * IrrigationMethodPill Component
 * Represents the irrigation technology method: Drip, Sprinkler, or Flood.
 * 
 * @param {Object} props
 * @param {'Drip' | 'Sprinkler' | 'Flood'} props.method
 */
export default function IrrigationMethodPill({ method }) {
  const { t } = useTranslation();
  const normalizedMethod = (method || '').toLowerCase();

  let IconComponent = Droplets;
  let label = t('irrigationMethods.drip');
  let modifier = 'drip';

  if (normalizedMethod === 'sprinkler') {
    IconComponent = Sparkles;
    label = t('irrigationMethods.sprinkler');
    modifier = 'sprinkler';
  } else if (normalizedMethod === 'flood') {
    IconComponent = Waves;
    label = t('irrigationMethods.flood');
    modifier = 'flood';
  } else if (normalizedMethod === 'furrow') {
    IconComponent = Waves;
    label = t('irrigationMethods.furrow');
    modifier = 'furrow';
  } else if (normalizedMethod === 'manual') {
    IconComponent = Droplets;
    label = t('irrigationMethods.manual');
    modifier = 'manual';
  }

  return (
    <span className={`agri-method-pill agri-method-pill--${modifier}`}>
      <IconComponent size={12} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
