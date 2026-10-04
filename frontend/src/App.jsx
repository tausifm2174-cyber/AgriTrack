import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import AppLayout from './layouts/AppLayout';
import './App.css';

// Page components
import DashboardPage from './pages/DashboardPage';
import FarmsPage from './pages/FarmsPage';
import FieldsPage from './pages/FieldsPage';
import SoilPage from './pages/SoilPage';
import CropsPage from './pages/CropsPage';
import CropCalendarPage from './pages/CropCalendarPage';
import ActivitiesPage from './pages/ActivitiesPage';
import IrrigationPage from './pages/IrrigationPage';
import WeatherPage from './pages/WeatherPage';
import RecommendationsPage from './pages/RecommendationsPage';
import HarvestsPage from './pages/HarvestsPage';
import SalesPage from './pages/SalesPage';
import MarketPricesPage from './pages/MarketPricesPage';
import ExpensesPage from './pages/ExpensesPage';
import RevenuePage from './pages/RevenuePage';
import ProfitLossPage from './pages/ProfitLossPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Root Application Router with nested AppLayout
 */
function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/farms" element={<FarmsPage />} />
            <Route path="/fields" element={<FieldsPage />} />
            <Route path="/soil" element={<SoilPage />} />
            <Route path="/crops" element={<CropsPage />} />
            <Route path="/crop-calendar" element={<CropCalendarPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/irrigation" element={<IrrigationPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/harvests" element={<HarvestsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/market-prices" element={<MarketPricesPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/revenue" element={<RevenuePage />} />
            <Route path="/profit-loss" element={<ProfitLossPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
