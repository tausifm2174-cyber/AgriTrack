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
  switch (status) {
    case 'Scheduled':
      return (
        <StatusBadge variant="info" icon={<Clock size={12} />}>
          Scheduled
        </StatusBadge>
      );
    case 'In Progress':
      return (
        <StatusBadge variant="warning" icon={<PlayCircle size={12} />}>
          In Progress
        </StatusBadge>
      );
    case 'Completed':
      return (
        <StatusBadge variant="success" icon={<CheckCircle2 size={12} />}>
          Completed
        </StatusBadge>
      );
    case 'Skipped':
      return (
        <StatusBadge variant="neutral" icon={<SkipForward size={12} />}>
          Skipped
        </StatusBadge>
      );
    case 'Cancelled':
      return (
        <StatusBadge variant="danger" icon={<XCircle size={12} />}>
          Cancelled
        </StatusBadge>
      );
    default:
      return (
        <StatusBadge variant="neutral">
          {status || 'Unknown'}
        </StatusBadge>
      );
  }
}
