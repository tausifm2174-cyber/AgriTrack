import { Plus } from 'lucide-react';
import { PageHeader, Button } from '../common';

/**
 * FieldHeader component
 * Displays title, subtitle, and primary action to map a new field plot.
 */
export default function FieldHeader({ onAddField }) {
  return (
    <PageHeader
      title="Field Management"
      subtitle="Organize individual plots, soil types, and active cultivation zones"
      actions={
        <Button
          variant="primary"
          icon={<Plus size={16} aria-hidden="true" />}
          onClick={onAddField}
        >
          Add Field
        </Button>
      }
    />
  );
}
