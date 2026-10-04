import {
  ProfileHeader,
  ProfileSummary,
  FarmSummary,
  ProfilePreferences,
  NotificationPreferences,
} from '../components/profile';
import { farmData } from '../data/farmData';
import { cropCycles } from '../data/cropData';

/**
 * ProfilePage Component
 * Operational farmer profile and system configuration (Phase 9)
 */
export default function ProfilePage() {
  const { summary = {} } = farmData;
  const activeCropsCount = cropCycles.length;

  return (
    <div className="agri-profile-page">
      {/* Header with Farmer details and Demo mode notice */}
      <ProfileHeader
        name="XYZ"
        role="Farmer"
        location="Demo Village, Karnal, Haryana"
        status="Demo Account"
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
