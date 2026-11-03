import { useTranslation } from 'react-i18next';
import { Warehouse, Sprout, Wallet, TrendingUp } from 'lucide-react';
import { dashboardData } from '../data/dashboardData';
import { formatCurrency } from '../utils/formatters';
import { translateCrop } from '../utils/displayLabels';

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

/**
 * DashboardPage (Phase 3 — AgriTrack Operational Command Center)
 * Centralizes farm holdings, active crops, weather, irrigation alerts,
 * APMC market prices, financial metrics, and operational quick actions.
 */
export default function DashboardPage() {
  const { t } = useTranslation();
  const {
    farmer,
    weather,
    farmSummary,
    activeCrops,
    financialSummary,
    monthlyFinancials,
    upcomingActivities,
    irrigationAlerts,
    marketPrices,
    recentActivities,
    farmAlerts,
    quickActions,
  } = dashboardData;

  const cropNames = activeCrops.map((c) => translateCrop(c.name, t)).join(' & ');

  return (
    <div className="agri-dashboard">
      {/* 1. Dashboard Header */}
      <DashboardHeader farmer={farmer} />

      {/* 2. Top Weather & 4 Primary KPI Summary Cards */}
      <section className="agri-kpi-grid" aria-label={t('navigation.dashboard', 'Key Performance Indicators')}>
        {/* Weather Summary Card */}
        <div className="agri-kpi-grid__weather">
          <WeatherCard weather={weather} />
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="agri-kpi-grid__cards">
          {/* Card 1: Total Farms */}
          <KpiCard
            title={t('dashboard.totalFarms', 'Total Farms')}
            value={`${farmSummary.farms} ${t('farms.holdings', 'Holdings')}`}
            subValue={`${farmSummary.fields} ${t('fields.fields', 'Fields')}`}
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
            subValue={`${activeCrops.length} ${t('crops.title', 'Standing Varieties')}`}
            icon={<Sprout size={20} aria-hidden="true" />}
            iconColor="emerald"
            badge={t('status.optimal', 'Optimal')}
            badgeVariant="success"
            to="/crops"
          />

          {/* Card 3: Expenses / Revenue */}
          <KpiCard
            title={`${t('navigation.expenses', 'Expenses')} / ${t('navigation.revenue', 'Revenue')}`}
            value={`${formatCurrency(financialSummary.expenses)} / ${formatCurrency(financialSummary.revenue)}`}
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
            value={`+${formatCurrency(financialSummary.netProfit)}`}
            subValue={`+${financialSummary.netMargin}% ${t('profitLoss.margin', 'margin')}`}
            icon={<TrendingUp size={20} aria-hidden="true" />}
            iconColor="blue"
            badge={`+${financialSummary.netMargin}%`}
            badgeVariant="success"
            to="/profit-loss"
          />
        </div>
      </section>

      {/* 3. Financial Performance Chart & Farm Alerts */}
      <section className="agri-dash-row agri-dash-row--7-5" aria-label={t('dashboard.financialOverview', 'Financial Performance')}>
        <FinancialOverview
          financialSummary={financialSummary}
          monthlyFinancials={monthlyFinancials}
        />
        <FarmAlerts alerts={farmAlerts} />
      </section>

      {/* 4. Upcoming Activities & Market Prices */}
      <section className="agri-dash-row agri-dash-row--1-1" aria-label={t('dashboard.upcomingActivities', 'Upcoming Field Activities')}>
        <ActivityList
          activities={upcomingActivities}
          irrigationAlerts={irrigationAlerts}
        />
        <MarketPriceCard marketPrices={marketPrices} />
      </section>

      {/* 5. Active Crops & Recent Activity Log */}
      <section className="agri-dash-row agri-dash-row--1-1" aria-label={t('dashboard.activeCrops', 'Active Crops')}>
        <CropSummary crops={activeCrops} />
        <RecentActivities activities={recentActivities} />
      </section>

      {/* 6. Quick Actions */}
      <section aria-label={t('dashboard.quickActions.title', 'Quick Actions')}>
        <QuickActions actions={quickActions} />
      </section>
    </div>
  );
}
