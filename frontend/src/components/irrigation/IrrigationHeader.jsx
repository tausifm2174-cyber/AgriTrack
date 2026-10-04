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
  return (
    <PageHeader
      title="Irrigation Scheduling"
      subtitle="Schedule and monitor precision water delivery, methods, and volumes"
      actions={
        <Button
          variant="primary"
          onClick={onScheduleIrrigation}
          aria-label="Schedule new irrigation run"
        >
          <PlusCircle size={16} aria-hidden="true" />
          <Droplets size={16} aria-hidden="true" />
          <span>Schedule Irrigation</span>
        </Button>
      }
    />
  );
}
