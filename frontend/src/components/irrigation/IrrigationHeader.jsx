import { useTranslation } from 'react-i18next';
import { PlusCircle, Droplets } from 'lucide-react';
import { PageHeader, Button } from '../common';

/**
 * IrrigationHeader Component
 * Page heading with action trigger for scheduling a new irrigation run.
 * 
 * @param {Object} props
 * @param {Function} props.onScheduleIrrigation
 */
export default function IrrigationHeader({ onScheduleIrrigation }) {
  const { t } = useTranslation();

  return (
    <PageHeader
      title={t('irrigation.title')}
      subtitle={t('irrigation.subtitle')}
      actions={
        <Button
          variant="primary"
          onClick={onScheduleIrrigation}
          aria-label={t('irrigation.addSchedule')}
        >
          <PlusCircle size={16} aria-hidden="true" />
          <Droplets size={16} aria-hidden="true" />
          <span>{t('irrigation.addSchedule')}</span>
        </Button>
      }
    />
  );
}
