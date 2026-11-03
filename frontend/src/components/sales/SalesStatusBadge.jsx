import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../common';

export default function SalesStatusBadge({ status, type = 'sale' }) {
  const { t } = useTranslation();

  if (type === 'payment') {
    switch (status) {
      case 'PAID':
        return <StatusBadge variant="success">{t('status.paid', 'Paid')}</StatusBadge>;
      case 'PARTIAL':
        return <StatusBadge variant="warning">{t('status.partiallyPaid', 'Partial')}</StatusBadge>;
      case 'PENDING':
        return <StatusBadge variant="danger">{t('status.pending', 'Pending')}</StatusBadge>;
      default:
        return <StatusBadge variant="neutral">{status}</StatusBadge>;
    }
  }

  switch (status) {
    case 'COMPLETED':
      return <StatusBadge variant="success">{t('status.completed', 'Completed')}</StatusBadge>;
    case 'CONFIRMED':
      return <StatusBadge variant="info">{t('status.confirmed', 'Confirmed')}</StatusBadge>;
    case 'PENDING':
      return <StatusBadge variant="warning">{t('status.pending', 'Pending')}</StatusBadge>;
    case 'CANCELLED':
      return <StatusBadge variant="danger">{t('status.cancelled', 'Cancelled')}</StatusBadge>;
    default:
      return <StatusBadge variant="neutral">{status}</StatusBadge>;
  }
}
