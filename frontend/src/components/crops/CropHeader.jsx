import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Sprout } from 'lucide-react';
import { Button } from '../common';

/**
 * CropHeader component
 * Displays title, description, and primary action controls for Crop Management.
 *
 * @param {Object} props
 * @param {Function} props.onAddCrop - Callback to open the Add Crop Cycle modal
 */
export default function CropHeader({ onAddCrop }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="agri-crop-header">
      <div className="agri-crop-header__left">
        <div className="agri-crop-header__badge">
          <Sprout size={16} aria-hidden="true" />
          <span>{t('navigation.crops', 'Operational Agronomy')}</span>
        </div>
        <h1 className="agri-crop-header__title">{t('crops.title', 'Crop Portfolio')}</h1>
        <p className="agri-crop-header__desc">
          {t('crops.subtitle', 'Manage standing crop cycles, monitor 5-stage lifecycle milestones, and optimize field cultivation across your farm holdings.')}
        </p>
      </div>

      <div className="agri-crop-header__actions">
        <Button
          variant="outline"
          icon={<Calendar size={16} aria-hidden="true" />}
          onClick={() => navigate('/crop-calendar')}
        >
          {t('cropCalendar.title', 'Crop Calendar')}
        </Button>
        <Button
          variant="primary"
          icon={<Plus size={16} aria-hidden="true" />}
          onClick={onAddCrop}
        >
          {t('crops.addCrop', 'Add Crop Cycle')}
        </Button>
      </div>
    </header>
  );
}
