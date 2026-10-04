import { Warehouse, Plus } from 'lucide-react';
import FarmCard from './FarmCard';
import { EmptyState, Button } from '../common';

/**
 * FarmGrid component
 * Renders the responsive grid of farm cards or an empty state.
 */
export default function FarmGrid({ farms = [], onViewDetails, onAddFarm }) {
  if (farms.length === 0) {
    return (
      <EmptyState
        icon={<Warehouse size={32} aria-hidden="true" />}
        title="No farm holdings found"
        description="There are currently no farm properties registered in your account."
        action={
          <Button
            variant="primary"
            icon={<Plus size={16} aria-hidden="true" />}
            onClick={onAddFarm}
          >
            Add Your First Farm
          </Button>
        }
      />
    );
  }

  return (
    <section className="agri-farm-grid" aria-label="Farm Holdings Directory">
      {farms.map((farm) => (
        <FarmCard
          key={farm.id}
          farm={farm}
          onViewDetails={onViewDetails}
        />
      ))}
    </section>
  );
}
