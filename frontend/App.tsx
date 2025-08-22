import { useState, useEffect, useRef } from 'react';
import { Dashboard } from './components/Dashboard';
import { VolumeCalculator } from './components/VolumeCalculator';
import { DataManagement } from './components/DataManagement';
import { LesEGAISIntegration } from './components/LesEGAISIntegration';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { 
  Home,
  Calculator, 
  Database, 
  Send, 
  BarChart3, 
  Settings as SettingsIcon,
  Plus
} from 'lucide-react';
import { NavigationBar } from './components/ui/navigation';
import { TabBar, TabItem } from './components/ui/tab-bar';
import { FloatingActionButton } from './components/ui/floating-action-button';
import { ConnectionStatus } from './components/ui/connection-status';

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);
  const [tabBarVisible, setTabBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Native iOS scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const currentScrollY = scrollContainerRef.current.scrollTop;
      const scrollDelta = currentScrollY - lastScrollY;
      setIsScrolling(true);
      
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
      
      // Native iOS tab bar hide/show behavior
      if (Math.abs(scrollDelta) > 10) {
        const direction = scrollDelta > 0 ? 'down' : 'up';
        setScrollDirection(direction);
        
        if (direction === 'down' && currentScrollY > 100) {
          setTabBarVisible(false);
        } else if (direction === 'up' || currentScrollY <= 50) {
          setTabBarVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
      };
    }
  }, [lastScrollY]);

  // Check pending sync items
  useEffect(() => {
    const checkPendingSync = () => {
      try {
        const batches = JSON.parse(localStorage.getItem('forestry-batches') || '[]');
        const unsyncedBatches = batches.filter((batch: any) => !batch.synced);
        setPendingSync(unsyncedBatches.length);
      } catch (error) {
        console.error('Error checking pending sync:', error);
      }
    };

    checkPendingSync();
    const interval = setInterval(checkPendingSync, 30000);
    return () => clearInterval(interval);
  }, []);

  // Initialize app settings
  useEffect(() => {
    const initializeApp = () => {
      const hasBeenInit = localStorage.getItem('forestry-app-initialized');
      if (!hasBeenInit) {
        const defaultSettings = {
          operatorName: '',
          defaultSpecies: '',
          autoCapturGPS: true,
          offlineMode: false,
          syncInterval: 15,
          dataRetention: 365,
          language: 'ru',
          theme: 'light',
          notifications: true,
          precision: 3
        };
        
        localStorage.setItem('forestry-settings', JSON.stringify(defaultSettings));
        localStorage.setItem('forestry-app-initialized', 'true');
      }
    };

    initializeApp();
  }, []);

  const tabItems: TabItem[] = [
    { id: 'dashboard', label: 'Главная', icon: Home },
    { id: 'calculator', label: 'Расчёт', icon: Calculator },
    { id: 'data', label: 'Данные', icon: Database },
    { id: 'lesegais', label: 'ЕГАИС', icon: Send },
    { id: 'analytics', label: 'Анализ', icon: BarChart3 },
    { id: 'settings', label: 'Настройки', icon: SettingsIcon },
  ];

  const handleFloatingAction = () => {
    setActiveSection('calculator');
  };

  const canGoBack = activeSection !== 'dashboard';

  const handleBack = () => {
    setActiveSection('dashboard');
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Главная';
      case 'calculator': return 'Расчёт объёма';
      case 'data': return 'Управление данными';
      case 'lesegais': return 'ЛесЕГАИС';
      case 'analytics': return 'Аналитика';
      case 'settings': return 'Настройки';
      default: return 'Главная';
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onSectionChange={setActiveSection} isOnline={isOnline} pendingSync={pendingSync} />;
      case 'calculator':
        return <VolumeCalculator />;
      case 'data':
        return <DataManagement />;
      case 'lesegais':
        return <LesEGAISIntegration />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onSectionChange={setActiveSection} isOnline={isOnline} pendingSync={pendingSync} />;
    }
  };

  const renderRightContent = () => (
    <div className="flex items-center gap-2">
      <ConnectionStatus 
        isOnline={isOnline}
        pendingSync={pendingSync}
        showIcon={true}
        showText={false}
        variant="compact"
        size="sm"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Enhanced Navigation Bar */}
      <NavigationBar
        title={getSectionTitle()}
        showBackButton={canGoBack}
        onBack={handleBack}
        rightContent={renderRightContent()}
        showConnectionStatus={true}
        isOnline={isOnline}
        pendingSync={pendingSync}
        fieldMode={true}
        className="pt-safe"
      />

      {/* Main Content with native iOS scroll behavior */}
      <main 
        ref={scrollContainerRef}
        className="pt-16 pb-20 min-h-screen overflow-y-auto"
      >
        <div className="container mx-auto">
          {renderActiveSection()}
        </div>
      </main>

      {/* Floating Action Button (only on dashboard section) */}
      {activeSection === 'dashboard' && (
        <FloatingActionButton
          onClick={handleFloatingAction}
          icon={Plus}
          label="Новый расчёт"
          position="bottom-right"
          variant="primary"
        />
      )}
      
      {/* Enhanced Tab Bar */}
      <TabBar
        items={tabItems}
        activeTab={activeSection}
        onTabChange={setActiveSection}
        visible={tabBarVisible}
        showIndicator={true}
        ariaLabel="Основные разделы"
        fieldMode={true}
        className="pb-safe"
      />
    </div>
  );
}