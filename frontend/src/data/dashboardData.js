/**
 * AgriTrack Dashboard Demo Data (Phase 3)
 * Grounded in the AgriTrack operational specification and PPT reference.
 * Centralized deterministic data module.
 */

export const dashboardData = {
  // Farmer profile context
  farmer: {
    name: 'XYZ',
    role: 'Farmer',
    greeting: 'Welcome back, XYZ',
    subtitle: 'Monitor your farms, crops, weather, irrigation, markets and financial performance from one place.',
    lastUpdated: 'Just now (Demo)',
  },

  // Weather context
  weather: {
    temperature: 28,
    unit: '°C',
    condition: 'Partly Cloudy',
    location: 'Farm Area',
    subtext: "Today's weather",
    humidity: 62,
    windSpeed: '12 km/h',
    rainChance: '10%',
    forecastNote: 'Clear skies with mild cloud cover through evening',
  },

  // Farm and field summary
  farmSummary: {
    farms: 3,
    fields: 8,
    holdingsLabel: '3 Holdings',
    fieldsLabel: '8 Fields',
    totalAreaAcres: 42.5,
    activeIrrigationZones: 6,
  },

  // Active crops
  activeCrops: [
    {
      id: 'crop-wheat',
      name: 'Wheat',
      variety: 'Sharbati',
      season: 'Rabi',
      stage: 'Vegetative Growth',
      field: 'Field 1A',
      location: 'North Farm',
      areaAcres: 18.5,
      healthStatus: 'Optimal',
      plantedDate: 'Nov 2025',
      expectedHarvest: 'Apr 2026',
      progressPercent: 65,
    },
    {
      id: 'crop-maize',
      name: 'Maize',
      variety: 'Hybrid',
      season: 'Kharif',
      stage: 'Flowering',
      field: 'Field 2B',
      location: 'South Field',
      areaAcres: 12.0,
      healthStatus: 'Good',
      plantedDate: 'Jul 2026',
      expectedHarvest: 'Oct 2026',
      progressPercent: 45,
    },
  ],

  // Financial summary (PPT Example)
  financialSummary: {
    expenses: 32000,
    revenue: 50000,
    netProfit: 18000,
    netMargin: 36.0,
    costPerQuintal: 1280,
    harvestYieldKg: 2500,
    averageMandiRatePerKg: 20,
    currency: 'INR',
    period: 'Current Season (Rabi 2025-26)',
  },

  // Financial chart data - Monthly Revenue vs Expenses
  monthlyFinancials: [
    { month: 'Oct', revenue: 20000, expenses: 14000, netProfit: 6000 },
    { month: 'Nov', revenue: 26000, expenses: 18000, netProfit: 8000 },
    { month: 'Dec', revenue: 32000, expenses: 22000, netProfit: 10000 },
    { month: 'Jan', revenue: 38000, expenses: 25000, netProfit: 13000 },
    { month: 'Feb', revenue: 44000, expenses: 28000, netProfit: 16000 },
    { month: 'Mar (Current)', revenue: 50000, expenses: 32000, netProfit: 18000 },
  ],

  // Financial breakdown by operational category
  expenseBreakdown: [
    { name: 'Fertilizers & Soil Inputs', amount: 10500, percentage: 32.8, color: '#16a34a' },
    { name: 'Seeds & Propagation', amount: 8500, percentage: 26.5, color: '#0d9488' },
    { name: 'Drip Irrigation & Energy', amount: 4800, percentage: 15.0, color: '#0284c7' },
    { name: 'Labor & Field Work', amount: 5200, percentage: 16.3, color: '#d97706' },
    { name: 'Machinery & Fuel', amount: 3000, percentage: 9.4, color: '#64748b' },
  ],

  // Upcoming Farm Activities & Irrigation Alerts
  upcomingActivities: [
    {
      id: 'act-1',
      field: 'Field 2B',
      activity: 'Drip Irrigation Trigger',
      date: 'Today',
      time: '4:00 PM',
      type: 'irrigation',
      status: 'Scheduled',
      statusVariant: 'info',
      icon: 'Droplets',
      notes: 'Scheduled 45-min cycle targeting Maize root zone',
    },
    {
      id: 'act-2',
      field: 'Field 1A',
      activity: 'Organic Fertilizer Application',
      date: 'Tomorrow',
      time: '7:00 AM',
      type: 'fertilizer',
      status: 'Scheduled',
      statusVariant: 'neutral',
      icon: 'Sprout',
      notes: 'NPK organic top-dressing and bio-stimulant foliar spray',
    },
  ],

  // Dedicated Irrigation Alert
  irrigationAlerts: [
    {
      id: 'irr-alert-1',
      field: 'Field 2B',
      title: 'Irrigation Alert',
      message: 'Drip irrigation scheduled today at 4:00 PM.',
      status: 'Scheduled',
      statusVariant: 'info',
      scheduleTime: 'Today, 4:00 PM',
      soilMoisture: '38% (Threshold: 40%)',
      method: 'Drip System #2',
    },
  ],

  // Live APMC Market Rates (Illustrative / Demo Market Data)
  marketPrices: [
    {
      id: 'mkt-wheat',
      crop: 'Wheat',
      variety: 'Sharbati',
      price: 2450,
      unit: '₹2,450/q',
      change: '+₹45',
      trend: 'up',
      mandi: 'APMC Yard (Local)',
      minRate: 2380,
      maxRate: 2520,
    },
    {
      id: 'mkt-maize',
      crop: 'Maize',
      variety: 'Hybrid',
      price: 1850,
      unit: '₹1,850/q',
      change: '+₹20',
      trend: 'up',
      mandi: 'APMC Yard (Local)',
      minRate: 1780,
      maxRate: 1910,
    },
  ],

  // Recent Farm Activities timeline
  recentActivities: [
    {
      id: 'recent-1',
      title: 'Soil test recorded',
      field: 'Field 1A',
      time: 'Today',
      timestamp: 'Today, 11:30 AM',
      type: 'soil',
      icon: 'FlaskConical',
    },
    {
      id: 'recent-2',
      title: 'Irrigation scheduled',
      field: 'Field 2B',
      time: 'Today',
      timestamp: 'Today, 09:15 AM',
      type: 'irrigation',
      icon: 'Droplets',
    },
    {
      id: 'recent-3',
      title: 'Wheat crop updated',
      field: 'North Farm',
      time: 'Yesterday',
      timestamp: 'Yesterday, 04:30 PM',
      type: 'crop',
      icon: 'Sprout',
    },
    {
      id: 'recent-4',
      title: 'Expense recorded',
      field: 'Fertilizer',
      time: 'Yesterday',
      timestamp: 'Yesterday, 02:00 PM',
      type: 'expense',
      icon: 'CreditCard',
    },
  ],

  // Farm Alerts & Advisories
  farmAlerts: [
    {
      id: 'alert-1',
      title: 'Irrigation reminder',
      field: 'Field 2B',
      message: 'Field 2B scheduled for drip irrigation today at 4:00 PM.',
      time: 'Today',
      type: 'irrigation',
      badgeVariant: 'info',
    },
    {
      id: 'alert-2',
      title: 'Weather advisory',
      field: 'Farm Area',
      message: 'Rainfall expected. Demo advisory: monitor moisture levels.',
      time: 'Demo advisory',
      type: 'weather',
      badgeVariant: 'warning',
    },
    {
      id: 'alert-3',
      title: 'Market update',
      field: 'Local APMC',
      message: 'Wheat (Sharbati) price updated to ₹2,450/q (+₹45).',
      time: 'Today',
      type: 'market',
      badgeVariant: 'success',
    },
  ],

  // Quick action shortcuts
  quickActions: [
    { id: 'qa-farm', label: 'Add Farm', path: '/farms', icon: 'Warehouse', description: 'Register farm holding' },
    { id: 'qa-field', label: 'Add Field', path: '/fields', icon: 'Grid3X3', description: 'Plot new boundary' },
    { id: 'qa-soil', label: 'Record Soil Test', path: '/soil', icon: 'FlaskConical', description: 'Log N-P-K & pH values' },
    { id: 'qa-crop', label: 'Add Crop', path: '/crops', icon: 'Sprout', description: 'Start crop cycle' },
    { id: 'qa-harvest', label: 'Record Harvest', path: '/harvests', icon: 'PackageCheck', description: 'Log produce yield' },
    { id: 'qa-sale', label: 'Record Sale', path: '/sales', icon: 'Receipt', description: 'Execute crop sale' },
    { id: 'qa-market', label: 'Market Prices', path: '/market-prices', icon: 'TrendingUp', description: 'View mandi rates' },
    { id: 'qa-irrigation', label: 'Schedule Irrigation', path: '/irrigation', icon: 'Droplets', description: 'Trigger drip zone' },
    { id: 'qa-expense', label: 'Record Expense', path: '/expenses', icon: 'CreditCard', description: 'Log input purchase' },
    { id: 'qa-revenue', label: 'View Revenue', path: '/revenue', icon: 'Wallet', description: 'Track sales revenue' },
    { id: 'qa-profit-loss', label: 'Profit & Loss', path: '/profit-loss', icon: 'PieChart', description: 'Financial analysis' },
  ],
};
