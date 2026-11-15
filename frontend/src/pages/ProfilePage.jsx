import { useTranslation } from 'react-i18next';
import {
  ProfileHeader,
  ProfileSummary,
  FarmSummary,
  ProfilePreferences,
  NotificationPreferences,
} from '../components/profile';
import { useAuth } from '../context/useAuth';
import { farmData } from '../data/farmData';
import { cropCycles } from '../data/cropData';

/**
 * ProfilePage Component
 * Connected to live authenticated user via useAuth() (Phase 22.1)
 */
export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { summary = {} } = farmData;
  const activeCropsCount = cropCycles.length;

  const displayName = user?.fullName || 'Farmer';
  const displayRole = user?.role ? (user.role === 'FARMER' ? t('auth.roleFarmer', 'Farmer') : user.role) : t('auth.roleFarmer', 'Farmer');
  const displayEmail = user?.email || '';
  const displayPhone = user?.phone || 'Not provided';
  const displayLocation = 'Registered Farm Location';
  const displayStatus = user?.active ? 'Active Account' : 'Standard Account';

  return (
    <div className="agri-profile-page">
      {/* Header with live Authenticated Farmer details */}
      <ProfileHeader
        name={displayName}
        role={displayRole}
        location={displayLocation}
        status={displayStatus}
      />

      {/* Profile KPI Summary Cards */}
      <ProfileSummary
        totalHoldings={summary.totalHoldings || 3}
        totalFields={summary.totalFields || 8}
        totalArea={summary.totalAreaAcres || 42.5}
        activeCropsCount={activeCropsCount}
      />

      {/* Grid Layout: Holdings, Settings & Notification Preferences */}
      <div className="agri-profile-layout-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Authenticated Account Details Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: '0 0 1rem 0' }}>
              {t('profile.personalInfo', 'Personal Information')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  {t('profile.fullName', 'Full Name')}
                </span>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 600, color: '#1e293b' }}>{displayName}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  {t('profile.email', 'Email Address')}
                </span>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 600, color: '#1e293b' }}>{displayEmail}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  {t('profile.phone', 'Phone Number')}
                </span>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 600, color: '#1e293b' }}>{displayPhone}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Role & Status
                </span>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 600, color: '#059669' }}>
                  {displayRole} • {displayStatus}
                </p>
              </div>
            </div>
          </div>

          <FarmSummary />
          <ProfilePreferences />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <NotificationPreferences />
        </div>
      </div>
    </div>
  );
}
