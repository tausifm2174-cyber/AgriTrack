import { CheckCircle2, Clock, Calendar, XCircle } from 'lucide-react';
import { StatusBadge } from '../common';

/**
 * ActivityStatusBadge Component
 * Reusable badge for agricultural activity statuses.
 * @param {Object} props
 * @param {'Planned' | 'In Progress' | 'Completed' | 'Cancelled'} props.status
 * @param {string} [props.className]
 */
export default function ActivityStatusBadge({ status = 'Planned', className = '' }) {
  switch (status) {
    case 'Completed':
      return (
        <StatusBadge
          variant="success"
          icon={<CheckCircle2 size={12} />}
          className={className}
        >
          Completed
        </StatusBadge>
      );
    case 'In Progress':
      return (
        <StatusBadge
          variant="warning"
          icon={<Clock size={12} />}
          className={className}
        >
          In Progress
        </StatusBadge>
      );
    case 'Cancelled':
      return (
        <StatusBadge
          variant="danger"
          icon={<XCircle size={12} />}
          className={className}
        >
          Cancelled
        </StatusBadge>
      );
    case 'Planned':
    default:
      return (
        <StatusBadge
          variant="info"
          icon={<Calendar size={12} />}
          className={className}
        >
          Planned
        </StatusBadge>
      );
  }
}
