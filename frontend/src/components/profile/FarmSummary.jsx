import { Link } from 'react-router-dom';
import { ArrowRight, Warehouse, MapPin } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { farmData } from '../../data/farmData';
import { formatAcres } from '../../utils/formatters';

/**
 * FarmSummary Component
 * Displays registered land holdings under the farmer profile.
 */
export default function FarmSummary() {
  const { farms = [] } = farmData;

  return (
    <Card
      title="Registered Land Holdings"
      subtitle="Operational farms currently assigned to this profile"
      action={
        <Link to="/farms" className="agri-card-action-link">
          <span>Manage holdings</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      }
    >
      <div className="agri-profile-farm-list">
        {farms.map((farm) => (
          <div key={farm.id} className="agri-profile-farm-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--slate-100)',
                  color: 'var(--slate-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-hidden="true"
              >
                <Warehouse size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="agri-profile-farm-name">{farm.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)' }}>
                    [{farm.code}]
                  </span>
                </div>
                <div className="agri-profile-farm-meta">
                  <MapPin size={11} style={{ display: 'inline', marginRight: '2px' }} aria-hidden="true" />
                  {farm.location} • {formatAcres(farm.areaAcres)} • {farm.fieldsCount} Fields
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <StatusBadge variant="success">Active</StatusBadge>
              <Link
                to={`/fields?farmId=${farm.id}`}
                className="agri-btn agri-btn--ghost agri-btn--sm"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                title={`View ${farm.name} fields`}
              >
                Fields
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
