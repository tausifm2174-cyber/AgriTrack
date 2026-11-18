import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Warehouse, Sprout, Wallet, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { translateCrop } from '../utils/displayLabels';
import { useAuth } from '../context/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { LoadingState } from '../components/common';

// Services
import farmService from '../services/farmService';
import fieldService from '../services/fieldService';
import cropService from '../services/cropService';
import activityService from '../services/activityService';
import financialService from '../services/financialService';
import weatherService from '../services/weatherService';
import advisoryService from '../services/advisoryService';
import marketService from '../services/marketService';

// Adapters
import {
  adaptFarm,
  adaptField,
  adaptCropCycle,
  adaptActivity,
  adaptProfitLossSummary,
  adaptMonthlyFinancialSummary,
  adaptWeatherSnapshot,
  adaptAdvisory,
  adaptMarketPrice,
} from '../utils/adapters';

// Dashboard Components
import {
  DashboardHeader,
  WeatherCard,
  KpiCard,
  FinancialOverview,
  ActivityList,
  MarketPriceCard,
  CropSummary,
  FarmAlerts,
  RecentActivities,
  QuickActions,
} from '../components/dashboard';

import '../components/dashboard/dashboard.css';

const DEFAULT_QUICK_ACTIONS = [
  { id: 'add-farm', icon: 'Warehouse', label: 'Add New Farm', path: '/farms', description: 'Register a farm parcel' },
  { id: 'view-fields', icon: 'Grid3X3', label: 'Manage Fields', path: '/fields', description: 'Inspect crop parcels' },
  { id: 'log-activity', icon: 'Sprout', label: 'Log Activity', path: '/activities', description: 'Record farm operations' },
  { id: 'view-weather', icon: 'Droplets', label: 'Weather & Insights', path: '/weather', description: 'Forecasts and alerts' },
  { id: 'record-expense', icon: 'CreditCard', label: 'Add Expense', path: '/expenses', description: 'Track agricultural costs' },
  { id: 'record-harvest', icon: 'PackageCheck', label: 'Record Harvest', path: '/harvests', description: 'Log yield and harvest batches' },
  { id: 'record-sale', icon: 'Receipt', label: 'Record Sale', path: '/sales', description: 'Track crop sales and revenue' },
  { id: 'view-market', icon: 'TrendingUp', label: 'Market Prices', path: '/market-prices', description: 'Check APMC benchmark rates' },
  { id: 'view-profit-loss', icon: 'PieChart', label: 'Profit & Loss', path: '/profit-loss', description: 'Review farm financial health' },
];

/**
 * DashboardPage (Phase 3 & Phase 22.7)
 * Centralizes live farm holdings, active crops, weather, operational alerts,
 * APMC market prices, financial metrics, and operational quick actions.
 */
export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { notifications } = useNotifications();

  // Live state
  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [profitLoss, setProfitLoss] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [weatherSnapshot, setWeatherSnapshot] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Orchestrated data loading
  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [
          farmsRes,
          fieldsRes,
          cropsRes,
          activitiesRes,
          profitLossRes,
          monthlyTrendRes,
          marketPricesRes,
          advisoriesRes,
        ] = await Promise.allSettled([
          farmService.getAllFarms(),
          fieldService.getAllFields(),
          cropService.getAllCropCycles(),
          activityService.getAllActivities(),
          financialService.getProfitLossSummary(),
          financialService.getMonthlyTrend(),
          marketService.getMarketPrices(),
          advisoryService.getAllAdvisories({ status: 'ACTIVE' }),
        ]);

        if (!isMounted) return;

        // Track critical failures
        const failedSections = [];
        if (farmsRes.status === 'rejected') failedSections.push(t('navigation.farms', 'Farms'));
        if (fieldsRes.status === 'rejected') failedSections.push(t('navigation.fields', 'Fields'));
        if (cropsRes.status === 'rejected') failedSections.push(t('navigation.crops', 'Crops'));
        if (activitiesRes.status === 'rejected') failedSections.push(t('navigation.activities', 'Activities'));
        if (profitLossRes.status === 'rejected') failedSections.push(t('navigation.financials', 'Financials'));

        if (failedSections.length > 0) {
          setLoadError(
            t(
              'dashboard.partialLoadError',
              'Failed to retrieve server data for: {{sections}}. Displaying available metrics.',
              { sections: failedSections.join(', ') }
            )
          );
        }

        // Process Farms & Fields
        const rawFarms = farmsRes.status === 'fulfilled' && Array.isArray(farmsRes.value) ? farmsRes.value : [];
        const rawFields = fieldsRes.status === 'fulfilled' && Array.isArray(fieldsRes.value) ? fieldsRes.value : [];

        const adaptedFarms = rawFarms.map((f) => adaptFarm(f, rawFields)).filter(Boolean);
        const adaptedFields = rawFields.map((fld) => adaptField(fld)).filter(Boolean);
        setFarms(adaptedFarms);
        setFields(adaptedFields);

        // Process Crops
        const rawCrops = cropsRes.status === 'fulfilled' && Array.isArray(cropsRes.value) ? cropsRes.value : [];
        const adaptedCrops = rawCrops.map((c) => adaptCropCycle(c)).filter(Boolean);
        setCrops(adaptedCrops);

        // Process Activities with lookup maps
        const fMap = adaptedFarms.reduce((acc, f) => { acc[f.id] = f; return acc; }, {});
        const flMap = adaptedFields.reduce((acc, fld) => { acc[fld.id] = fld; return acc; }, {});
        const rawActivities = activitiesRes.status === 'fulfilled' && Array.isArray(activitiesRes.value) ? activitiesRes.value : [];
        const adaptedActivities = rawActivities.map((a) => adaptActivity(a, flMap, fMap)).filter(Boolean);
        setActivities(adaptedActivities);

        // Process Financials
        if (profitLossRes.status === 'fulfilled' && profitLossRes.value) {
          setProfitLoss(adaptProfitLossSummary(profitLossRes.value));
        }

        if (monthlyTrendRes.status === 'fulfilled' && Array.isArray(monthlyTrendRes.value)) {
          setMonthlyTrends(monthlyTrendRes.value.map(adaptMonthlyFinancialSummary).filter(Boolean));
        }

        // Process Market Prices
        const rawMarket = marketPricesRes.status === 'fulfilled' && Array.isArray(marketPricesRes.value) ? marketPricesRes.value : [];
        setMarketPrices(rawMarket.map(adaptMarketPrice).filter(Boolean));

        // Process Advisories
        const rawAdv = advisoriesRes.status === 'fulfilled' && Array.isArray(advisoriesRes.value) ? advisoriesRes.value : [];
        setAdvisories(rawAdv.map(adaptAdvisory).filter(Boolean));

        // Fetch Weather for Primary Farm
        if (adaptedFarms.length > 0) {
          const primaryFarm = adaptedFarms[0];
          try {
            const rawWeather = await weatherService.getCurrentWeather(primaryFarm.id);
            if (isMounted && rawWeather) {
              const adaptedWeather = adaptWeatherSnapshot(rawWeather, primaryFarm.name);
              setWeatherSnapshot(adaptedWeather);
            }
          } catch {
            if (isMounted) setWeatherSnapshot(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(err.message || t('dashboard.loadError', 'Failed to load dashboard data.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey, t]);

  const handleRetry = () => {
    setRefreshKey((k) => k + 1);
  };

  // Derived Farmer Header Model
  const farmerHeader = useMemo(() => {
    return {
      name: user?.fullName || 'Farmer',
      subtitle: farms.length > 0
        ? t('dashboard.greetingSubtitle', 'Managing {{farmCount}} farms and {{fieldCount}} field parcels.', { farmCount: farms.length, fieldCount: fields.length })
        : t('dashboard.greetingSubtitleNoFarms', 'Welcome to AgriTrack. Register your first farm holding to get started.'),
      lastUpdated: 'Today',
    };
  }, [user, farms.length, fields.length, t]);

  // Derived Crop Names for KPI
  const cropNames = useMemo(() => {
    if (crops.length === 0) return t('dashboard.noCropsStanding', 'No standing crops');
    const firstTwo = crops.slice(0, 2).map((c) => translateCrop(c.cropName, t)).join(' & ');
    return crops.length > 2 ? `${firstTwo} +${crops.length - 2}` : firstTwo;
  }, [crops, t]);

  // Financial KPI calculations
  const totalRevenue = profitLoss?.totalRevenue || 0;
  const totalExpenses = profitLoss?.totalExpenses || 0;
  const netProfit = profitLoss?.netProfit || 0;
  const netMargin = profitLoss?.profitMarginPercent || 0;

  // Active Crops for CropSummary component
  const summaryCrops = useMemo(() => {
    return crops.map((c) => ({
      id: c.id,
      name: c.cropName,
      variety: c.variety,
      season: c.season,
      field: c.fieldName,
      stage: c.currentStage,
      areaAcres: c.areaAcres,
      progressPercent: c.progressPercent != null ? c.progressPercent : 0,
      healthStatus: c.status === 'Active' ? 'Optimal' : c.status,
    }));
  }, [crops]);

  // Upcoming Activities (Pending / In Progress)
  const upcomingActivities = useMemo(() => {
    return activities
      .filter((a) => a.status !== 'Completed')
      .slice(0, 4)
      .map((act) => ({
        id: act.id,
        type: act.activityType?.toLowerCase(),
        activity: act.title || act.activityType,
        status: act.status,
        statusVariant: act.status === 'In Progress' ? 'warning' : 'neutral',
        field: act.fieldName || '',
        date: act.date || '',
        time: act.time || 'All Day',
        notes: act.notes || '',
      }));
  }, [activities]);

  // Recent Activities
  const recentActivities = useMemo(() => {
    return activities.slice(0, 5).map((act) => ({
      id: act.id,
      type: act.activityType?.toLowerCase() || 'activity',
      title: act.title || act.activityType || 'Field Activity',
      field: act.fieldName || '',
      timestamp: act.date || 'Recent',
    }));
  }, [activities]);

  // Combined Alerts: Active Advisories + Top Unread Notifications
  const farmAlerts = useMemo(() => {
    const fromAdvisories = advisories.map((adv) => ({
      id: `adv-${adv.id}`,
      type: adv.category?.toLowerCase() || 'advisory',
      title: adv.title || adv.category,
      message: adv.message || adv.recommendation || '',
      time: adv.createdAt || 'Recent',
      field: adv.fieldName || adv.farmName || '',
      badgeVariant: adv.severity === 'CRITICAL' || adv.severity === 'HIGH' ? 'danger' : adv.severity === 'WARNING' || adv.severity === 'MEDIUM' ? 'warning' : 'info',
    }));

    const fromNotifications = notifications
      .filter((n) => !n.isRead)
      .map((notif) => ({
        id: `notif-${notif.id}`,
        type: notif.type?.toLowerCase() || 'system',
        title: notif.title || '',
        message: notif.message || '',
        time: notif.timestamp || 'Recent',
        field: notif.fieldName || notif.farmName || '',
        badgeVariant: notif.severity === 'CRITICAL' ? 'danger' : notif.severity === 'WARNING' ? 'warning' : 'info',
      }));

    return [...fromAdvisories, ...fromNotifications].slice(0, 5);
  }, [advisories, notifications]);

  // Market Prices formatted for card
  const formattedMarketPrices = useMemo(() => {
    return marketPrices.slice(0, 4).map((p) => ({
      id: p.id,
      crop: p.cropName || p.commodity || '',
      variety: p.variety || '',
      mandi: p.market || p.mandi || 'APMC Mandi',
      minRate: p.minPrice != null ? p.minPrice : 0,
      maxRate: p.maxPrice != null ? p.maxPrice : 0,
      unit: `₹${p.modalPrice != null ? p.modalPrice : 0}/${p.priceUnit || 'q'}`,
      change: p.trend || '+0.0%',
    }));
  }, [marketPrices]);

  // Monthly financials for chart
  const formattedMonthlyFinancials = useMemo(() => {
    const list = monthlyTrends.length > 0 ? monthlyTrends : (profitLoss?.monthlyTrends || []);
    return list.map((m) => ({
      month: m.month,
      revenue: m.revenue || 0,
      expenses: m.expenses || 0,
      profit: m.netProfit || 0,
    }));
  }, [monthlyTrends, profitLoss]);

  return (
    <div className="agri-dashboard">
      {/* 1. Dashboard Header */}
      <DashboardHeader farmer={farmerHeader} />

      {/* Error Alert Banner with Retry */}
      {loadError && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            padding: '0.875rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.925rem', fontWeight: 500 }}>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              backgroundColor: '#fff',
              border: '1px solid #fca5a5',
              borderRadius: '6px',
              color: '#b91c1c',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>{t('common.retry', 'Retry')}</span>
          </button>
        </div>
      )}

      {isLoading && farms.length === 0 ? (
        <LoadingState message={t('dashboard.loadingData', 'Loading authoritative farm metrics and records...')} />
      ) : (
        <>
          {/* 2. Top Weather & 4 Primary KPI Summary Cards */}
          <section className="agri-kpi-grid" aria-label={t('navigation.dashboard', 'Key Performance Indicators')}>
        {/* Weather Summary Card */}
        <div className="agri-kpi-grid__weather">
          <WeatherCard weather={weatherSnapshot} />
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="agri-kpi-grid__cards">
          {/* Card 1: Total Farms */}
          <KpiCard
            title={t('dashboard.totalFarms', 'Total Farms')}
            value={`${farms.length} ${t('farms.holdings', 'Holdings')}`}
            subValue={`${fields.length} ${t('fields.fields', 'Fields')}`}
            icon={<Warehouse size={20} aria-hidden="true" />}
            iconColor="green"
            badge={t('status.active', 'Active')}
            badgeVariant="success"
            to="/farms"
          />

          {/* Card 2: Active Crops */}
          <KpiCard
            title={t('dashboard.activeCrops', 'Active Crops')}
            value={cropNames}
            subValue={`${crops.length} ${t('crops.title', 'Standing Varieties')}`}
            icon={<Sprout size={20} aria-hidden="true" />}
            iconColor="emerald"
            badge={crops.length > 0 ? t('status.optimal', 'Optimal') : t('status.none', 'None')}
            badgeVariant={crops.length > 0 ? 'success' : 'neutral'}
            to="/crops"
          />

          {/* Card 3: Expenses / Revenue */}
          <KpiCard
            title={`${t('navigation.expenses', 'Expenses')} / ${t('navigation.revenue', 'Revenue')}`}
            value={`${formatCurrency(totalExpenses)} / ${formatCurrency(totalRevenue)}`}
            subValue={t('dashboard.currentSeasonRabi', 'Current Season (Rabi 2025-26)')}
            icon={<Wallet size={20} aria-hidden="true" />}
            iconColor="amber"
            badge={t('common.status', 'Status')}
            badgeVariant="neutral"
            to="/expenses"
          />

          {/* Card 4: Net Profit */}
          <KpiCard
            title={t('profitLoss.netProfit', 'Net Profit')}
            value={`${netProfit >= 0 ? '+' : ''}${formatCurrency(netProfit)}`}
            subValue={`${netMargin >= 0 ? '+' : ''}${netMargin}% ${t('profitLoss.margin', 'margin')}`}
            icon={<TrendingUp size={20} aria-hidden="true" />}
            iconColor={netProfit >= 0 ? 'blue' : 'amber'}
            badge={`${netMargin >= 0 ? '+' : ''}${netMargin}%`}
            badgeVariant={netProfit >= 0 ? 'success' : 'warning'}
            to="/profit-loss"
          />
        </div>
      </section>

      {/* 3. Financial Performance Chart & Farm Alerts */}
      <section className="agri-dash-row agri-dash-row--7-5" aria-label={t('dashboard.financialOverview', 'Financial Performance')}>
        <FinancialOverview
          financialSummary={{
            revenue: totalRevenue,
            expenses: totalExpenses,
            netProfit,
            netMargin,
            period: t('dashboard.currentSeasonRabi', 'Current Season'),
          }}
          monthlyFinancials={formattedMonthlyFinancials}
        />
        <FarmAlerts alerts={farmAlerts} />
      </section>

      {/* 4. Upcoming Activities & Market Prices */}
      <section className="agri-dash-row agri-dash-row--1-1" aria-label={t('dashboard.upcomingActivities', 'Upcoming Field Activities')}>
        <ActivityList
          activities={upcomingActivities}
          irrigationAlerts={[]}
        />
        <MarketPriceCard marketPrices={formattedMarketPrices} />
      </section>

      {/* 5. Active Crops & Recent Activity Log */}
      <section className="agri-dash-row agri-dash-row--1-1" aria-label={t('dashboard.activeCrops', 'Active Crops')}>
        <CropSummary crops={summaryCrops} />
        <RecentActivities activities={recentActivities} />
      </section>

      {/* 6. Quick Actions */}
      <section aria-label={t('dashboard.quickActions.title', 'Quick Actions')}>
        <QuickActions actions={DEFAULT_QUICK_ACTIONS} />
      </section>
        </>
      )}
    </div>
  );
}
