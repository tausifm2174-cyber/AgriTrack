import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '../common';

/**
 * SoilStatus component
 * Renders standardized soil health condition with status badge and icon.
 */
export default function SoilStatus({ status, variant }) {
  let computedVariant = variant;
  let icon = null;

  if (!computedVariant) {
    if (status === 'Good') {
      computedVariant = 'success';
      icon = <CheckCircle2 size={12} aria-hidden="true" />;
    } else if (status === 'Moderate') {
      computedVariant = 'warning';
      icon = <AlertCircle size={12} aria-hidden="true" />;
    } else if (status === 'Needs Attention') {
      computedVariant = 'danger';
      icon = <AlertTriangle size={12} aria-hidden="true" />;
    } else {
      computedVariant = 'neutral';
    }
  }

  return (
    <StatusBadge variant={computedVariant} icon={icon}>
      {status}
    </StatusBadge>
  );
}
