import { Plus } from 'lucide-react';
import { PageHeader, Button } from '../common';

/**
 * FarmHeader component
 * Displays title, subtitle, and primary action to register a new farm holding.
 */
export default function FarmHeader({ onAddFarm }) {
  return (
    <PageHeader
      title="Farm Management"
      subtitle="Manage farm properties, acreage, and operational holdings"
      actions={
        <Button
          variant="primary"
          icon={<Plus size={16} aria-hidden="true" />}
          onClick={onAddFarm}
        >
          Add Farm
        </Button>
      }
    />
  );
}
