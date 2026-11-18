import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Warehouse, MapPin } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { formatAcres } from '../../utils/formatters';

/**
 * FarmSummary Component
 * Displays registered land holdings under the farmer profile.
 * @param {Object} props
 * @param {Array} props.farms
 */
export default function FarmSummary({ farms = [] }) {
  const { t } = useTranslation();

  return (
    <Card
      title={t('profile.landHoldings', 'Registered Land Holdings')}
      subtitle={t('profile.landHoldingsSub', 'Operational farms currently assigned to this profile')}
      action={
        <Link to="/farms" className="agri-card-action-link">
          <span>{t('profile.manageHoldings', 'Manage holdings')}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      }
    >
      <div className="agri-profile-farm-list">
        {farms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            <Warehouse size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} aria-hidden="true" />
            <p>{t('farms.noFarms', 'No farm holdings registered.')}</p>
          </div>
        ) : (
          farms.map((farm) => (
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
                    {farm.code && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)' }}>
                        [{farm.code}]
                      </span>
                    )}
                  </div>
                  <div className="agri-profile-farm-meta">
                    <MapPin size={11} style={{ display: 'inline', marginRight: '2px' }} aria-hidden="true" />
                    {farm.location || 'Location set'} • {formatAcres(farm.areaAcres)}
                    {farm.fieldsCount != null ? ` • ${farm.fieldsCount} ${t('fields.title', 'Fields')}` : ''}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StatusBadge variant="success">{t('status.active', 'Active')}</StatusBadge>
                <Link
                  to={`/fields?farmId=${farm.id}`}
                  className="agri-btn agri-btn--ghost agri-btn--sm"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  title={`${t('common.viewDetails', 'View')} ${farm.name} ${t('fields.title', 'fields')}`}
                >
                  {t('fields.title', 'Fields')}
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
