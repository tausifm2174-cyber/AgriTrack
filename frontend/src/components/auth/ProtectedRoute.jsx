import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useTranslation } from 'react-i18next';

/**
 * ProtectedRoute Guard
 * - Displays loading screen during initial token check
 * - Redirects unauthenticated visitors to /login preserving intended destination
 * - Renders child route for authenticated users
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--slate-50, #f8fafc)',
          color: 'var(--slate-600, #475569)',
          fontFamily: 'inherit',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--emerald-200, #a7f3d0)',
            borderTopColor: 'var(--emerald-600, #059669)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>
          {t('common.loading', 'Loading AgriTrack...')}
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
