import { PlusCircle } from 'lucide-react';
import { PageHeader, Button } from '../common';

/**
 * ActivityHeader Component
 * @param {Object} props
 * @param {Function} props.onAddActivity
 */
export default function ActivityHeader({ onAddActivity }) {
  return (
    <PageHeader
      title="Farm Activities"
      subtitle="Plan, record, and monitor agricultural activities across your fields"
      actions={
        <Button
          variant="primary"
          icon={<PlusCircle size={16} />}
          onClick={onAddActivity}
        >
          Add Activity
        </Button>
      }
    />
  );
}
