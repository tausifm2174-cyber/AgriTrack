import { Grid3X3, RotateCcw } from 'lucide-react';
import FieldCard from './FieldCard';
import { EmptyState, Button } from '../common';

/**
 * FieldGrid component
 * Responsive container for field cards with empty state handler.
 */
export default function FieldGrid({
  fields = [],
  onViewDetails,
  onResetFilters,
  isFiltered = false,
}) {
  if (fields.length === 0) {
    return (
      <EmptyState
        icon={<Grid3X3 size={32} aria-hidden="true" />}
        title="No fields found"
        description={
          isFiltered
            ? "No agricultural plots match your current search and filter criteria."
            : "No fields are registered under this holding yet."
        }
        action={
          isFiltered && (
            <Button
              variant="outline"
              icon={<RotateCcw size={15} aria-hidden="true" />}
              onClick={onResetFilters}
            >
              Reset Filters
            </Button>
          )
        }
      />
    );
  }

  return (
    <section className="agri-field-grid" aria-label="Field Plots Directory">
      {fields.map((field) => (
        <FieldCard
          key={field.id}
          field={field}
          onViewDetails={onViewDetails}
        />
      ))}
    </section>
  );
}
