import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/layout/ToastContainer';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { AIContentStudio } from './components/studio/AIContentStudio';
import { ReelsStudio } from './components/generators/ReelsStudio';
import { CarouselStudio } from './components/generators/CarouselStudio';
import { PostStudio } from './components/generators/PostStudio';
import { StoryStudio } from './components/generators/StoryStudio';
import { ProductsManager } from './components/products/ProductsManager';
import { EditorialCalendar } from './components/calendar/EditorialCalendar';
import { ViralTrendsFinder } from './components/trends/ViralTrendsFinder';
import { ContentIntelligence } from './components/analytics/ContentIntelligence';
import { AIConsultantDrawer } from './components/consultant/AIConsultantDrawer';
import { BrandKitManager } from './components/brand/BrandKitManager';
import { ContentLibrary } from './components/library/ContentLibrary';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab, isOnboardingCompleted } = useApp();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'studio':
        return <AIContentStudio />;
      case 'reels':
        return <ReelsStudio />;
      case 'carousels':
        return <CarouselStudio />;
      case 'posts':
        return <PostStudio />;
      case 'stories':
        return <StoryStudio />;
      case 'products':
        return <ProductsManager />;
      case 'calendar':
        return <EditorialCalendar />;
      case 'trends':
        return <ViralTrendsFinder />;
      case 'analytics':
        return <ContentIntelligence />;
      case 'consultant':
        return <AIConsultantDrawer />;
      case 'brand':
        return <BrandKitManager />;
      case 'library':
        return <ContentLibrary />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {!isOnboardingCompleted && <OnboardingWizard />}

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderTabContent()}
        </main>
      </div>

      {/* Toast Feedback Notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
