import { useTranslation } from 'react-i18next';
import { Clock, PlayCircle, CheckCircle2, SkipForward, XCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

/**
 * IrrigationStatusBadge Component
 * Semantic status indicator for irrigation events.
 * 
 * @param {Object} props
 * @param {'Scheduled' | 'In Progress' | 'Completed' | 'Skipped' | 'Cancelled'} props.status
 */
export default function IrrigationStatusBadge({ status }) {
  const { t } = useTranslation();

  switch (status) {
    case 'Scheduled':
      return (
        <StatusBadge variant="info" icon={<Clock size={12} />}>
          {t('status.scheduled')}
        </StatusBadge>
      );
    case 'In Progress':
      return (
        <StatusBadge variant="warning" icon={<PlayCircle size={12} />}>
          {t('status.inProgress')}
        </StatusBadge>
      );
    case 'Completed':
      return (
        <StatusBadge variant="success" icon={<CheckCircle2 size={12} />}>
          {t('status.completed')}
        </StatusBadge>
      );
    case 'Skipped':
      return (
        <StatusBadge variant="neutral" icon={<SkipForward size={12} />}>
          {t('status.skipped')}
        </StatusBadge>
      );
    case 'Cancelled':
      return (
        <StatusBadge variant="danger" icon={<XCircle size={12} />}>
          {t('status.cancelled')}
        </StatusBadge>
      );
    default:
      return (
        <StatusBadge variant="neutral">
          {status || '—'}
        </StatusBadge>
      );
  }
}
