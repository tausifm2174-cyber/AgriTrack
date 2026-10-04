import {
  Sprout,
  Droplets,
  FlaskConical,
  Eye,
  Wheat,
  ClipboardList,
  Sparkles,
  Shield,
  Scissors,
} from 'lucide-react';

export default function ActivityTypePill({ type = 'Other' }) {
  const getIcon = () => {
    switch (type) {
      case 'Sowing':
        return <Sprout size={12} aria-hidden="true" />;
      case 'Fertilizing':
        return <Sparkles size={12} aria-hidden="true" />;
      case 'Spraying':
        return <Shield size={12} aria-hidden="true" />;
      case 'Weeding':
        return <Scissors size={12} aria-hidden="true" />;
      case 'Irrigation':
        return <Droplets size={12} aria-hidden="true" />;
      case 'Soil Testing':
        return <FlaskConical size={12} aria-hidden="true" />;
      case 'Crop Inspection':
        return <Eye size={12} aria-hidden="true" />;
      case 'Harvest Preparation':
        return <Wheat size={12} aria-hidden="true" />;
      case 'Other':
      default:
        return <ClipboardList size={12} aria-hidden="true" />;
    }
  };

  const cleanType = (type || 'other').toLowerCase().replace(/\s+/g, '');

  return (
    <span className={`agri-activity-type-pill agri-activity-type-pill--${cleanType}`}>
      {getIcon()}
      <span>{type}</span>
    </span>
  );
}
