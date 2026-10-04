import { Droplets, Sparkles, Waves } from 'lucide-react';

/**
 * IrrigationMethodPill Component
 * Represents the irrigation technology method: Drip, Sprinkler, or Flood.
 * 
 * @param {Object} props
 * @param {'Drip' | 'Sprinkler' | 'Flood'} props.method
 */
export default function IrrigationMethodPill({ method }) {
  const normalizedMethod = (method || '').toLowerCase();

  let IconComponent = Droplets;
  let label = method || 'Drip';
  let modifier = 'drip';

  if (normalizedMethod === 'sprinkler') {
    IconComponent = Sparkles;
    label = 'Sprinkler';
    modifier = 'sprinkler';
  } else if (normalizedMethod === 'flood') {
    IconComponent = Waves;
    label = 'Flood';
    modifier = 'flood';
  }

  return (
    <span className={`agri-method-pill agri-method-pill--${modifier}`}>
      <IconComponent size={12} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
