// src\App.tsx
import React from 'react';
import { useApp } from './context/AppContext';
import { RoleSwitchBanner } from './components/common/RoleSwitchBanner';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { AddressModal } from './components/common/AddressModal';
import { AuthModal } from './components/common/AuthModal';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CustomerHome } from './components/customer/CustomerHome';
import { RestaurantDetailView } from './components/customer/RestaurantDetailView';
import { OrderTrackingModal } from './components/customer/OrderTrackingModal';
import { ChatbotWidget } from './components/chatbot/ChatbotWidget';
import { MerchantDashboard } from './components/merchant/MerchantDashboard';
import { KitchenDisplay } from './components/kitchen/KitchenDisplay';
import { WarehouseDashboard } from './components/warehouse/WarehouseDashboard';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { SupportDashboard } from './components/support/SupportDashboard';
import { MarketingDashboard } from './components/marketing/MarketingDashboard';
import { AccountingDashboard } from './components/accounting/AccountingDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AICenterDashboard } from './components/ai_center/AICenterDashboard';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { HRDashboard } from './components/hr/HRDashboard';

export const MainContent: React.FC = () => {
  const { currentRole, activeRestaurant, setActiveRestaurant, activeOrder, setActiveOrder } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fa] text-slate-800 antialiased selection:bg-amber-400 selection:text-slate-900">
      {/* Top Banner: Switch seamlessly between 10 modules */}
      <RoleSwitchBanner />

      {/* Main Header (Only for customer role) */}
      {currentRole === 'customer' && <Header />}

      {/* 10 Module Dispatched Views */}
      <main className="flex-1">
        {currentRole === 'customer' && (
          <>
            {activeRestaurant ? (
              <RestaurantDetailView
                restaurant={activeRestaurant}
                onBack={() => setActiveRestaurant(null)}
              />
            ) : (
              <CustomerHome />
            )}
          </>
        )}

        {currentRole === 'merchant' && <MerchantDashboard />}

        {currentRole === 'kitchen' && <KitchenDisplay />}

        {currentRole === 'warehouse' && <WarehouseDashboard />}

        {currentRole === 'driver' && <DriverDashboard />}

        {currentRole === 'support' && <SupportDashboard />}

        {currentRole === 'marketing' && <MarketingDashboard />}

        {currentRole === 'accounting' && <AccountingDashboard />}

        {currentRole === 'admin' && <AdminDashboard />}

        {currentRole === 'ai_center' && <AICenterDashboard />}

        {currentRole === 'analytics' && <AnalyticsDashboard />}

        {currentRole === 'hr' && <HRDashboard />}
      </main>

      {/* Common Modals & Overlays */}
      <AddressModal />
      <AuthModal />
      <AdminAuthModal />
      <CartDrawer />
      <OrderTrackingModal order={activeOrder} onClose={() => setActiveOrder(null)} />
      <ChatbotWidget />
      <ToastContainer />

      {/* Official Footer (Shown in Customer view) */}
      {currentRole === 'customer' && <Footer />}
    </div>
  );
};

export default function App() {
  return <MainContent />;
}
