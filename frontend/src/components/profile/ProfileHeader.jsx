import { MapPin, ShieldCheck, Info } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import StatusBadge from '../common/StatusBadge';

/**
 * ProfileHeader Component
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.role
 * @param {string} props.location
 * @param {string} props.status
 */
export default function ProfileHeader({
  name = 'XYZ',
  role = 'Farmer',
  location = 'Demo Village, Karnal, Haryana',
  status = 'Demo Account',
}) {
  return (
    <div className="agri-profile-header-wrap">
      <PageHeader
        title="Farmer Profile & Settings"
        subtitle="Manage farmer identity, holding portfolio, operational units, and notification preferences."
      />

      {/* Demo Mode Notice */}
      <div className="agri-demo-banner" role="status" style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>
        <Info size={16} className="agri-demo-banner__icon" aria-hidden="true" />
        <span className="agri-demo-banner__text">
          <strong>Demo Mode</strong> — Data shown in this application is sample data for demonstration purposes. Preferences are maintained in frontend browser session state.
        </span>
        <span className="agri-demo-banner__badge">Frontend Demo</span>
      </div>

      {/* Identity Card */}
      <div className="agri-profile-hero">
        <div className="agri-profile-identity">
          <div className="agri-profile-avatar-lg" aria-hidden="true">
            <span>{name}</span>
          </div>
          <div className="agri-profile-name-group">
            <h2>{name}</h2>
            <div className="agri-profile-meta-pills">
              <span className="agri-profile-meta-item">
                <ShieldCheck size={14} className="text-primary" aria-hidden="true" />
                <strong>{role}</strong>
              </span>
              <span>•</span>
              <span className="agri-profile-meta-item">
                <MapPin size={14} aria-hidden="true" />
                {location}
              </span>
              <span>•</span>
              <StatusBadge variant="success">{status}</StatusBadge>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', display: 'block' }}>
            System Platform
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)' }}>
            AgriTrack v1.0 (Phase 9)
          </span>
        </div>
      </div>
    </div>
  );
}
