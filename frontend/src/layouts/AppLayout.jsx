import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import MobileSidebar from '../components/layout/MobileSidebar';
import TopNavbar from '../components/layout/TopNavbar';

/**
 * Main application shell layout for AgriTrack
 * Provides top navbar, persistent desktop sidebar, mobile drawer, and outlet.
 */
export default function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="agri-app-layout">
      {/* Desktop Sidebar (hidden on mobile/tablet via CSS) */}
      <div className="agri-app-layout__sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile Off-canvas Drawer */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area (Navbar + Viewport Content) */}
      <div className="agri-app-layout__main">
        <TopNavbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="agri-app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
