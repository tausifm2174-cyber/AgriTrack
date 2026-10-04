import { Sprout, RotateCcw } from 'lucide-react';
import CropCard from './CropCard';
import { EmptyState, Button } from '../common';

/**
 * CropGrid component
 * Renders the responsive grid of crop cycle cards or an empty state.
 *
 * @param {Object} props
 * @param {Array} props.crops - List of crop cycles
 * @param {Function} props.onViewDetails - Callback for crop details
 * @param {Function} props.onViewLifecycle - Callback for full lifecycle
 * @param {Function} props.onEdit - Callback to edit crop
 * @param {Function} props.onResetFilters - Callback to clear active filters
 * @param {boolean} props.isFiltered - True if filters are applied
 */
export default function CropGrid({
  crops = [],
  onViewDetails,
  onViewLifecycle,
  onEdit,
  onResetFilters,
  isFiltered = false,
}) {
  if (crops.length === 0) {
    return (
      <div className="agri-crop-empty-wrap">
        <EmptyState
          icon={<Sprout size={36} aria-hidden="true" />}
          title={isFiltered ? 'No matching crop cycles found' : 'No crop cycles recorded'}
          description={
            isFiltered
              ? 'Try modifying your search keywords or resetting farm, field, season, or stage filters.'
              : 'Add your first crop cycle to begin tracking planting dates, field growth, and harvest milestones.'
          }
          action={
            isFiltered && (
              <Button
                variant="outline"
                icon={<RotateCcw size={14} aria-hidden="true" />}
                onClick={onResetFilters}
              >
                Clear All Filters
              </Button>
            )
          }
        />
      </div>
    );
  }

  return (
    <section className="agri-crop-grid" aria-label="Crop Cycles Grid">
      {crops.map((crop) => (
        <CropCard
          key={crop.id}
          crop={crop}
          onViewDetails={onViewDetails}
          onViewLifecycle={onViewLifecycle}
          onEdit={onEdit}
        />
      ))}
    </section>
  );
}
