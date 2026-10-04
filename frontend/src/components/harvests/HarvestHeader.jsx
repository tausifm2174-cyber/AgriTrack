import { useNavigate } from 'react-router-dom';
import { PackageCheck, Plus, Receipt, Sprout } from 'lucide-react';
import { Button } from '../common';

export default function HarvestHeader({ onRecordHarvest }) {
  const navigate = useNavigate();

  return (
    <div className="agri-harvest-header">
      <div className="agri-harvest-header__left">
        <div className="agri-harvest-header__badge">
          <PackageCheck size={14} />
          <span>Harvest & Trade • Produce Management</span>
        </div>
        <h1 className="agri-harvest-header__title">Harvest Management</h1>
        <p className="agri-harvest-header__desc">
          Track harvested quantities, produce quality grades, storage allocations, and market availability.
        </p>
      </div>
      <div className="agri-harvest-header__actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/sales')}
          aria-label="View Sales"
        >
          <Receipt size={16} />
          <span>View Sales</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/crops')}
          aria-label="View Crops"
        >
          <Sprout size={16} />
          <span>View Crops</span>
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onRecordHarvest}
          aria-label="Record New Harvest"
        >
          <Plus size={18} />
          <span>Record Harvest</span>
        </Button>
      </div>
    </div>
  );
}
