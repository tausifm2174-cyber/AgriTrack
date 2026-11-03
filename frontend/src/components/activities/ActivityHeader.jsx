import { useTranslation } from 'react-i18next';
import { PlusCircle } from 'lucide-react';
import { PageHeader, Button } from '../common';

/**
 * ActivityHeader Component
 * @param {Object} props
 * @param {Function} props.onAddActivity
 */
export default function ActivityHeader({ onAddActivity }) {
  const { t } = useTranslation();

  return (
    <PageHeader
      title={t('activities.title')}
      subtitle={t('activities.subtitle')}
      actions={
        <Button
          variant="primary"
          icon={<PlusCircle size={16} />}
          onClick={onAddActivity}
        >
          {t('activities.addActivity')}
        </Button>
      }
    />
  );
}
