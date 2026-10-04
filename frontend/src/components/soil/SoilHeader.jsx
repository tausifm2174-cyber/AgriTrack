import { Plus } from 'lucide-react';
import { PageHeader, Button } from '../common';

/**
 * SoilHeader component
 * Displays title, subtitle, and primary action to log a laboratory soil test.
 */
export default function SoilHeader({ onAddSoilTest }) {
  return (
    <PageHeader
      title="Soil Records"
      subtitle="Track laboratory soil test parameters, nutrient levels, and pH balances"
      actions={
        <Button
          variant="primary"
          icon={<Plus size={16} aria-hidden="true" />}
          onClick={onAddSoilTest}
        >
          Add Soil Test
        </Button>
      }
    />
  );
}
