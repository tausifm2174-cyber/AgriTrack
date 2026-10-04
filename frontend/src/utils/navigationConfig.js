/**
 * Centralized Navigation and Route Metadata Configuration for AgriTrack
 */

export const NAVIGATION_GROUPS = [
  {
    id: 'overview',
    label: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    ],
  },
  {
    id: 'farm-management',
    label: 'FARM MANAGEMENT',
    items: [
      { id: 'farms', label: 'Farms', path: '/farms', icon: 'Warehouse' },
      { id: 'fields', label: 'Fields', path: '/fields', icon: 'Grid3X3' },
      { id: 'soil', label: 'Soil Records', path: '/soil', icon: 'FlaskConical' },
    ],
  },
  {
    id: 'agronomy',
    label: 'AGRONOMY',
    items: [
      { id: 'crops', label: 'Crops', path: '/crops', icon: 'Sprout' },
      { id: 'crop-calendar', label: 'Crop Calendar', path: '/crop-calendar', icon: 'Calendar' },
      { id: 'activities', label: 'Activities', path: '/activities', icon: 'ClipboardList' },
      { id: 'irrigation', label: 'Irrigation', path: '/irrigation', icon: 'Droplets' },
      { id: 'recommendations', label: 'Recommendations', path: '/recommendations', icon: 'Compass' },
    ],
  },
  {
    id: 'weather-insights',
    label: 'WEATHER & INSIGHTS',
    items: [
      { id: 'weather', label: 'Weather', path: '/weather', icon: 'CloudSun' },
    ],
  },
  {
    id: 'harvest-trade',
    label: 'HARVEST & TRADE',
    items: [
      { id: 'harvests', label: 'Harvests', path: '/harvests', icon: 'PackageCheck' },
      { id: 'sales', label: 'Sales', path: '/sales', icon: 'Receipt' },
      { id: 'market-prices', label: 'Market Prices', path: '/market-prices', icon: 'TrendingUp' },
    ],
  },
  {
    id: 'finance',
    label: 'FINANCE',
    items: [
      { id: 'expenses', label: 'Expenses', path: '/expenses', icon: 'CreditCard' },
      { id: 'revenue', label: 'Revenue', path: '/revenue', icon: 'Wallet' },
      { id: 'profit-loss', label: 'Profit & Loss', path: '/profit-loss', icon: 'PieChart' },
    ],
  },
  {
    id: 'system',
    label: 'SYSTEM',
    items: [
      { id: 'notifications', label: 'Notifications', path: '/notifications', icon: 'Bell' },
      { id: 'profile', label: 'Profile', path: '/profile', icon: 'User' },
    ],
  },
];

/**
 * Route metadata mapping for page title and breadcrumbs
 */
export const ROUTE_METADATA = {
  '/dashboard': { title: 'Dashboard', group: 'Overview' },
  '/farms': { title: 'Farms', group: 'Farm Management' },
  '/fields': { title: 'Fields', group: 'Farm Management' },
  '/soil': { title: 'Soil Records', group: 'Farm Management' },
  '/crops': { title: 'Crops', group: 'Agronomy' },
  '/crop-calendar': { title: 'Crop Calendar', group: 'Agronomy' },
  '/activities': { title: 'Activities', group: 'Agronomy' },
  '/irrigation': { title: 'Irrigation', group: 'Agronomy' },
  '/weather': { title: 'Weather', group: 'Weather & Insights' },
  '/recommendations': { title: 'Recommendations', group: 'Agronomy' },
  '/harvests': { title: 'Harvests', group: 'Harvest & Trade' },
  '/sales': { title: 'Sales', group: 'Harvest & Trade' },
  '/market-prices': { title: 'Market Prices', group: 'Harvest & Trade' },
  '/expenses': { title: 'Expenses', group: 'Finance' },
  '/revenue': { title: 'Revenue', group: 'Finance' },
  '/profit-loss': { title: 'Profit & Loss', group: 'Finance' },
  '/notifications': { title: 'Notifications', group: 'System' },
  '/profile': { title: 'Profile', group: 'System' },
};

/**
 * Returns breadcrumb items array for a given pathname
 * @param {string} pathname
 * @returns {Array<{ label: string, path?: string }>}
 */
export function getBreadcrumbsForPath(pathname) {
  const meta = ROUTE_METADATA[pathname];
  if (!meta) {
    return [{ label: 'AgriTrack', path: '/dashboard' }, { label: 'Page' }];
  }

  if (pathname === '/dashboard') {
    return [{ label: 'Dashboard' }];
  }

  return [
    { label: meta.group },
    { label: meta.title, path: pathname },
  ];
}
