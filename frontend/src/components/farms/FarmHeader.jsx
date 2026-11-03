import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { PageHeader, Button } from '../common';

/**
 * FarmHeader component
 * Displays title, subtitle, and primary action to register a new farm holding.
 */
export default function FarmHeader({ onAddFarm }) {
  const { t } = useTranslation();

  return (
    <PageHeader
      title={t('farms.title', 'Farm Management')}
      subtitle={t('farms.subtitle', 'Manage your agricultural properties, locations, and land parcels.')}
      actions={
        <Button
          variant="primary"
          icon={<Plus size={16} aria-hidden="true" />}
          onClick={onAddFarm}
        >
          {t('farms.addFarm', 'Add Farm')}
        </Button>
      }
    />
  );
}
