import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import {
  ProfileHeader,
  ProfileSummary,
  FarmSummary,
  ProfilePreferences,
  NotificationPreferences,
} from '../components/profile';
import { useAuth } from '../context/useAuth';

// Live services & adapters
import farmService from '../services/farmService';
import fieldService from '../services/fieldService';
import cropService from '../services/cropService';
import { adaptFarm, adaptField, adaptCropCycle } from '../utils/adapters';

/**
 * ProfilePage Component
 * Connected to live authenticated user and live farm/crop holdings
 */
export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProfileData() {
      setIsLoading(true);
      try {
        const [farmsRes, fieldsRes, cropsRes] = await Promise.allSettled([
          farmService.getAllFarms(),
          fieldService.getAllFields(),
          cropService.getAllCropCycles(),
        ]);

        if (!isMounted) return;

        const rawFarms = farmsRes.status === 'fulfilled' && Array.isArray(farmsRes.value) ? farmsRes.value : [];
        const rawFields = fieldsRes.status === 'fulfilled' && Array.isArray(fieldsRes.value) ? fieldsRes.value : [];
        const rawCrops = cropsRes.status === 'fulfilled' && Array.isArray(cropsRes.value) ? cropsRes.value : [];

        const adaptedFarms = rawFarms.map((f) => adaptFarm(f, rawFields)).filter(Boolean);
        const adaptedFields = rawFields.map((fld) => adaptField(fld)).filter(Boolean);
        const adaptedCrops = rawCrops.map((c) => adaptCropCycle(c)).filter(Boolean);

        setFarms(adaptedFarms);
        setFields(adaptedFields);
        setCrops(adaptedCrops);
      } catch {
        // Safe graceful degradation
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalHoldings = farms.length;
  const totalFields = fields.length;
  const totalArea = farms.reduce((sum, f) => sum + (Number(f.areaAcres) || 0), 0);
  const activeCropsCount = crops.filter((c) => c.status === 'Active' || c.status === 'ACTIVE').length || crops.length;

  const displayName = user?.fullName || 'Farmer';
  const displayRole = user?.role ? (user.role === 'FARMER' ? t('auth.roleFarmer', 'Farmer') : user.role) : t('auth.roleFarmer', 'Farmer');
  const displayEmail = user?.email || '';
  const displayPhone = user?.phone || 'Not provided';
  const displayLocation = farms.length > 0 && farms[0].location ? farms[0].location : 'Registered Farm Location';
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
        totalHoldings={totalHoldings}
        totalFields={totalFields}
        totalArea={totalArea}
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

          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)' }}>
              <RefreshCw size={24} className="agri-spin" style={{ margin: '0 auto 0.5rem', color: 'var(--primary-600)' }} aria-hidden="true" />
              <p style={{ fontSize: '0.85rem' }}>{t('common.loading', 'Loading holdings...')}</p>
            </div>
          ) : (
            <FarmSummary farms={farms} />
          )}

          <ProfilePreferences />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <NotificationPreferences />
        </div>
      </div>
    </div>
  );
}
