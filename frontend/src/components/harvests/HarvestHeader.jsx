import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PackageCheck, Plus, Receipt, Sprout } from 'lucide-react';
import { Button } from '../common';

export default function HarvestHeader({ onRecordHarvest }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="agri-harvest-header">
      <div className="agri-harvest-header__left">
        <div className="agri-harvest-header__badge">
          <PackageCheck size={14} />
          <span>{t('harvests.badge', 'Harvest & Trade • Produce Management')}</span>
        </div>
        <h1 className="agri-harvest-header__title">{t('harvests.title', 'Harvest Management')}</h1>
        <p className="agri-harvest-header__desc">
          {t('harvests.subtitle', 'Track harvested quantities, produce quality grades, storage allocations, and market availability.')}
        </p>
      </div>
      <div className="agri-harvest-header__actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/sales')}
          aria-label={t('harvests.viewSales', 'View Sales')}
        >
          <Receipt size={16} />
          <span>{t('harvests.viewSales', 'View Sales')}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/crops')}
          aria-label={t('harvests.viewCrops', 'View Crops')}
        >
          <Sprout size={16} />
          <span>{t('harvests.viewCrops', 'View Crops')}</span>
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onRecordHarvest}
          aria-label={t('harvests.addHarvest', 'Record Harvest')}
        >
          <Plus size={18} />
          <span>{t('harvests.addHarvest', 'Record Harvest')}</span>
        </Button>
      </div>
    </div>
  );
}
