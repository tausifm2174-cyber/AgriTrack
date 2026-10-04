import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Sprout } from 'lucide-react';
import { Button } from '../common';

/**
 * CropHeader component
 * Displays title, description, and primary action controls for Crop Management.
 *
 * @param {Object} props
 * @param {Function} props.onAddCrop - Callback to open the Add Crop Cycle modal
 */
export default function CropHeader({ onAddCrop }) {
  const navigate = useNavigate();

  return (
    <header className="agri-crop-header">
      <div className="agri-crop-header__left">
        <div className="agri-crop-header__badge">
          <Sprout size={16} aria-hidden="true" />
          <span>Operational Agronomy</span>
        </div>
        <h1 className="agri-crop-header__title">Crop Management</h1>
        <p className="agri-crop-header__desc">
          Manage standing crop cycles, monitor 5-stage lifecycle milestones, and optimize field cultivation across your farm holdings.
        </p>
      </div>

      <div className="agri-crop-header__actions">
        <Button
          variant="outline"
          icon={<Calendar size={16} aria-hidden="true" />}
          onClick={() => navigate('/crop-calendar')}
        >
          Crop Calendar
        </Button>
        <Button
          variant="primary"
          icon={<Plus size={16} aria-hidden="true" />}
          onClick={onAddCrop}
        >
          Add Crop Cycle
        </Button>
      </div>
    </header>
  );
}
