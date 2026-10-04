import { StatusBadge } from '../common';

export default function HarvestStatusBadge({ status }) {
  switch (status) {
    case 'PLANNED':
      return <StatusBadge variant="info">Planned</StatusBadge>;
    case 'HARVESTED':
      return <StatusBadge variant="success">Harvested</StatusBadge>;
    case 'PARTIALLY_SOLD':
      return <StatusBadge variant="warning">Partially Sold</StatusBadge>;
    case 'SOLD_OUT':
      return <StatusBadge variant="neutral">Sold Out</StatusBadge>;
    default:
      return <StatusBadge variant="neutral">{status}</StatusBadge>;
  }
}
