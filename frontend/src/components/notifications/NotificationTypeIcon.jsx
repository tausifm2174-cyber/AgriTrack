import {
  CloudRain,
  Droplets,
  Sprout,
  Wheat,
  ShoppingCart,
  IndianRupee,
  Info,
  AlertTriangle,
} from 'lucide-react';

/**
 * Static icon renderer for notification types.
 * Declared as a standard top-level component for React Refresh & ESLint compliance.
 */
export default function NotificationTypeIcon({ type, size = 20, className = '' }) {
  switch (type) {
    case 'WEATHER':
      return <CloudRain size={size} className={className} aria-hidden="true" />;
    case 'IRRIGATION':
      return <Droplets size={size} className={className} aria-hidden="true" />;
    case 'CROP':
      return <Sprout size={size} className={className} aria-hidden="true" />;
    case 'HARVEST':
      return <Wheat size={size} className={className} aria-hidden="true" />;
    case 'SALES':
      return <ShoppingCart size={size} className={className} aria-hidden="true" />;
    case 'PAYMENT':
      return <IndianRupee size={size} className={className} aria-hidden="true" />;
    case 'ADVISORY':
      return <AlertTriangle size={size} className={className} aria-hidden="true" />;
    case 'SYSTEM':
    default:
      return <Info size={size} className={className} aria-hidden="true" />;
  }
}
