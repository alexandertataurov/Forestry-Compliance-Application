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
  Wifi,
  WifiOff,
  Plus,
  ChevronLeft,
  MoreHorizontal
} from 'lucide-react';

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

  const tabItems = [
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

  return (
    <div className="ios-app-container">
      {/* Web-optimized Navigation Bar */}
      <div className="ios-navigation-bar">
        <div className="ios-nav-content">
          <div className="ios-nav-left">
            {canGoBack && (
              <button
                type="button"
                onClick={handleBack}
                className="ios-back-button"
                aria-label="Назад"
              >
                <ChevronLeft className="ios-back-icon" />
                <span>Назад</span>
              </button>
            )}
          </div>
          
          <div className="ios-nav-center">
            <h1 className="ios-nav-title">{getSectionTitle()}</h1>
          </div>
          
          <div className="ios-nav-right">
            {/* Connection Status Indicator */}
            <div className="connection-status" style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
              {isOnline ? (
                <Wifi className="ios-nav-icon" style={{ color: 'var(--ios-green)' }} />
              ) : (
                <WifiOff className="ios-nav-icon" style={{ color: 'var(--ios-red)' }} />
              )}
              {pendingSync > 0 && (
                <div className="sync-indicator" style={{
                  width: '8px',
                  height: '8px',
                  background: 'var(--ios-orange)',
                  borderRadius: '50%',
                  marginLeft: '4px'
                }}></div>
              )}
            </div>
            <button type="button" className="ios-nav-button" aria-label="Меню">
              <MoreHorizontal className="ios-nav-icon" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content with native iOS scroll behavior */}
      <main 
        ref={scrollContainerRef}
        className="ios-main-content"
      >
        <div className="ios-content-container">
          {renderActiveSection()}
        </div>
      </main>

      {/* Native iOS Floating Action Button (only on calculator section) */}
      {activeSection === 'dashboard' && (
        <button
          type="button"
          onClick={handleFloatingAction}
          className="ios-fab"
          aria-label="Новый расчёт"
        >
          <Plus className="ios-fab-icon" />
        </button>
      )}
      
      {/* Native iOS Tab Bar */}
      <div className={`ios-tab-bar ${tabBarVisible ? 'ios-tab-bar-visible' : 'ios-tab-bar-hidden'}`}>
        <div className="ios-tab-bar-background"></div>
        <div className="ios-tab-bar-content" role="tablist" aria-label="Основные разделы">
          {tabItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                type="button"
                role="tab"
                aria-current={isActive ? 'page' : undefined}
                aria-selected={isActive}
                aria-label={item.label}
                className={`ios-tab-item ${isActive ? 'ios-tab-item-active' : ''}`}
              >
                <Icon className="ios-tab-icon" />
                <span className="ios-tab-label">{item.label}</span>
                {isActive && <div className="ios-tab-indicator"></div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
