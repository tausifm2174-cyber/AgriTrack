import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Receipt, Plus, PackageCheck, TrendingUp } from 'lucide-react';
import { Button } from '../common';

export default function SalesHeader({ onRecordSale }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="agri-sales-header">
      <div className="agri-sales-header__left">
        <div className="agri-sales-header__badge">
          <Receipt size={14} />
          <span>{t('sales.badge', 'Harvest & Trade • Produce Sales & Realization')}</span>
        </div>
        <h1 className="agri-sales-header__title">{t('sales.title', 'Sales Management')}</h1>
        <p className="agri-sales-header__desc">
          {t('sales.subtitle', 'Record produce transactions, track buyer receivables, compare against mandi benchmarks, and monitor revenue realization.')}
        </p>
      </div>
      <div className="agri-sales-header__actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/harvests')}
          aria-label={t('sales.viewHarvests', 'View Harvests')}
        >
          <PackageCheck size={16} />
          <span>{t('sales.viewHarvests', 'View Harvests')}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/market-prices')}
          aria-label={t('navigation.marketPrices', 'Market Prices')}
        >
          <TrendingUp size={16} />
          <span>{t('navigation.marketPrices', 'Market Prices')}</span>
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onRecordSale}
          aria-label={t('sales.addSale', 'Record Sale')}
        >
          <Plus size={18} />
          <span>{t('sales.addSale', 'Record Sale')}</span>
        </Button>
      </div>
    </div>
  );
}
