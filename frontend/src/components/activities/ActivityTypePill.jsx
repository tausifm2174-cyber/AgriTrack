import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const getIcon = () => {
    switch (type) {
      case 'Sowing':
        return <Sprout size={12} aria-hidden="true" />;
      case 'Fertilizing':
      case 'Fertilization':
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
      case 'Scouting':
        return <Eye size={12} aria-hidden="true" />;
      case 'Harvest Preparation':
      case 'Harvesting':
        return <Wheat size={12} aria-hidden="true" />;
      case 'Other':
      default:
        return <ClipboardList size={12} aria-hidden="true" />;
    }
  };

  const cleanType = (type || 'other').toLowerCase().replace(/\s+/g, '');

  const getLocalizedName = () => {
    switch (type) {
      case 'Sowing': return t('activityTypes.sowing');
      case 'Fertilizing':
      case 'Fertilization': return t('activityTypes.fertilization');
      case 'Spraying': return t('activityTypes.spraying');
      case 'Weeding': return t('activityTypes.weeding');
      case 'Irrigation': return t('activityTypes.irrigation');
      case 'Harvesting':
      case 'Harvest Preparation': return t('activityTypes.harvesting');
      case 'Scouting':
      case 'Crop Inspection': return t('activityTypes.scouting');
      case 'Land Preparation': return t('activityTypes.landPreparation');
      default: return type;
    }
  };

  return (
    <span className={`agri-activity-type-pill agri-activity-type-pill--${cleanType}`}>
      {getIcon()}
      <span>{getLocalizedName()}</span>
    </span>
  );
}
