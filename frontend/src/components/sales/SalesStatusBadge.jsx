import { StatusBadge } from '../common';

export default function SalesStatusBadge({ status, type = 'sale' }) {
  if (type === 'payment') {
    switch (status) {
      case 'PAID':
        return <StatusBadge variant="success">Paid</StatusBadge>;
      case 'PARTIAL':
        return <StatusBadge variant="warning">Partial</StatusBadge>;
      case 'PENDING':
        return <StatusBadge variant="danger">Pending</StatusBadge>;
      default:
        return <StatusBadge variant="neutral">{status}</StatusBadge>;
    }
  }

  switch (status) {
    case 'COMPLETED':
      return <StatusBadge variant="success">Completed</StatusBadge>;
    case 'CONFIRMED':
      return <StatusBadge variant="info">Confirmed</StatusBadge>;
    case 'PENDING':
      return <StatusBadge variant="warning">Pending</StatusBadge>;
    case 'CANCELLED':
      return <StatusBadge variant="danger">Cancelled</StatusBadge>;
    default:
      return <StatusBadge variant="neutral">{status}</StatusBadge>;
  }
}
