import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../common';

export default function HarvestStatusBadge({ status }) {
  const { t } = useTranslation();

  switch (status) {
    case 'PLANNED':
      return <StatusBadge variant="info">{t('status.planned', 'Planned')}</StatusBadge>;
    case 'HARVESTED':
      return <StatusBadge variant="success">{t('harvests.harvested', 'Harvested')}</StatusBadge>;
    case 'PARTIALLY_SOLD':
      return <StatusBadge variant="warning">{t('sales.partiallySold', 'Partially Sold')}</StatusBadge>;
    case 'SOLD_OUT':
      return <StatusBadge variant="neutral">{t('sales.soldOut', 'Sold Out')}</StatusBadge>;
    default:
      return <StatusBadge variant="neutral">{status}</StatusBadge>;
  }
}
