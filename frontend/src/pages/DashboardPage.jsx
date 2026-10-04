import { Warehouse, Sprout, Wallet, TrendingUp } from 'lucide-react';
import { dashboardData } from '../data/dashboardData';
import { formatCurrency } from '../utils/formatters';

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

  const cropNames = activeCrops.map((c) => c.name).join(' & ');

  return (
    <div className="agri-dashboard">
      {/* 1. Dashboard Header */}
      <DashboardHeader farmer={farmer} />

      {/* 2. Top Weather & 4 Primary KPI Summary Cards */}
      <section className="agri-kpi-grid" aria-label="Key Performance Indicators">
        {/* Weather Summary Card */}
        <div className="agri-kpi-grid__weather">
          <WeatherCard weather={weather} />
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="agri-kpi-grid__cards">
          {/* Card 1: Total Farms */}
          <KpiCard
            title="Total Farms"
            value={farmSummary.holdingsLabel}
            subValue={farmSummary.fieldsLabel}
            icon={<Warehouse size={20} aria-hidden="true" />}
            iconColor="green"
            badge="Active"
            badgeVariant="success"
            to="/farms"
          />

          {/* Card 2: Active Crops */}
          <KpiCard
            title="Active Crops"
            value={cropNames}
            subValue={`${activeCrops.length} Standing Varieties`}
            icon={<Sprout size={20} aria-hidden="true" />}
            iconColor="emerald"
            badge="Optimal"
            badgeVariant="success"
            to="/crops"
          />

          {/* Card 3: Expenses / Revenue */}
          <KpiCard
            title="Expenses / Revenue"
            value={`${formatCurrency(financialSummary.expenses)} / ${formatCurrency(financialSummary.revenue)}`}
            subValue="Current Season Rabi"
            icon={<Wallet size={20} aria-hidden="true" />}
            iconColor="amber"
            badge="Tracked"
            badgeVariant="neutral"
            to="/expenses"
          />

          {/* Card 4: Net Profit */}
          <KpiCard
            title="Net Profit"
            value={`+${formatCurrency(financialSummary.netProfit)}`}
            subValue={`+${financialSummary.netMargin}% margin`}
            icon={<TrendingUp size={20} aria-hidden="true" />}
            iconColor="blue"
            badge={`+${financialSummary.netMargin}%`}
            badgeVariant="success"
            to="/profit-loss"
          />
        </div>
      </section>

      {/* 3. Financial Performance Chart & Farm Alerts */}
      <section className="agri-dash-row agri-dash-row--7-5" aria-label="Financials and Advisories">
        <FinancialOverview
          financialSummary={financialSummary}
          monthlyFinancials={monthlyFinancials}
        />
        <FarmAlerts alerts={farmAlerts} />
      </section>

      {/* 4. Upcoming Activities & Market Prices */}
      <section className="agri-dash-row agri-dash-row--1-1" aria-label="Operations and Markets">
        <ActivityList
          activities={upcomingActivities}
          irrigationAlerts={irrigationAlerts}
        />
        <MarketPriceCard marketPrices={marketPrices} />
      </section>

      {/* 5. Active Crops & Recent Activity Log */}
      <section className="agri-dash-row agri-dash-row--1-1" aria-label="Crops and Timeline">
        <CropSummary crops={activeCrops} />
        <RecentActivities activities={recentActivities} />
      </section>

      {/* 6. Quick Actions */}
      <section aria-label="Quick Actions">
        <QuickActions actions={quickActions} />
      </section>
    </div>
  );
}
