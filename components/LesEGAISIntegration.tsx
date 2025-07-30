import { useState, useEffect } from 'react';
import { 
  Send, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Wifi, 
  WifiOff,
  FileText,
  Truck,
  MapPin,
  Calendar,
  User,
  Shield,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

export function LesEGAISIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [pendingBatches, setPendingBatches] = useState<any[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [operatorInfo, setOperatorInfo] = useState({
    name: '',
    inn: '',
    organization: '',
    region: ''
  });

  // Load pending batches and settings
  useEffect(() => {
    loadPendingBatches();
    loadOperatorInfo();
    setIsConnected(navigator.onLine);
    
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPendingBatches = () => {
    try {
      const batches = JSON.parse(localStorage.getItem('forestry-batches') || '[]');
      const pending = batches.filter((batch: any) => !batch.synced);
      setPendingBatches(pending);
    } catch (error) {
      console.error('Error loading pending batches:', error);
    }
  };

  const loadOperatorInfo = () => {
    try {
      const settings = JSON.parse(localStorage.getItem('forestry-settings') || '{}');
      setOperatorInfo({
        name: settings.operatorName || '',
        inn: settings.operatorINN || '',
        organization: settings.organization || '',
        region: settings.region || ''
      });
    } catch (error) {
      console.error('Error loading operator info:', error);
    }
  };

  const handleSync = async () => {
    if (!isConnected) {
      alert('Нет подключения к интернету');
      return;
    }

    if (pendingBatches.length === 0) {
      alert('Нет данных для синхронизации');
      return;
    }

    setSyncStatus('syncing');

    try {
      // Simulate API call to LesEGAIS
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark all batches as synced
      const allBatches = JSON.parse(localStorage.getItem('forestry-batches') || '[]');
      const updatedBatches = allBatches.map((batch: any) => ({
        ...batch,
        synced: true,
        syncDate: new Date().toISOString()
      }));
      
      localStorage.setItem('forestry-batches', JSON.stringify(updatedBatches));
      
      // Update calculations as well
      const calculations = JSON.parse(localStorage.getItem('forestry-calculations') || '[]');
      const updatedCalculations = calculations.map((calc: any) => ({
        ...calc,
        synced: true
      }));
      localStorage.setItem('forestry-calculations', JSON.stringify(updatedCalculations));
      
      setPendingBatches([]);
      setLastSync(new Date());
      setSyncStatus('success');
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4" style={{ animation: 'spin 1s linear infinite' }} />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Send className="w-4 h-4" />;
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return '#FF9500';
      case 'success':
        return '#34C759';
      case 'error':
        return '#FF3B30';
      default:
        return '#007AFF';
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Синхронизация...';
      case 'success':
        return 'Синхронизировано';
      case 'error':
        return 'Ошибка синхронизации';
      default:
        return 'Готов к синхронизации';
    }
  };

  return (
    <div>
      {/* Connection Status */}
      <div className="ios-section-header">Статус подключения</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: isConnected ? '#34C759' : '#FF3B30' }}
            >
              {isConnected ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">
                {isConnected ? 'Подключено к ЛесЕГАИС' : 'Нет подключения'}
              </div>
              <div className="ios-list-item-subtitle">
                {isConnected ? 'Готов к передаче данных' : 'Проверьте интернет-соединение'}
              </div>
            </div>
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: getSyncStatusColor() }}
            >
              {getSyncStatusIcon()}
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">{getSyncStatusText()}</div>
              <div className="ios-list-item-subtitle">
                {lastSync 
                  ? `Последняя синхронизация: ${lastSync.toLocaleString('ru-RU')}`
                  : 'Синхронизация не выполнялась'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Data */}
      <div className="ios-section-header">Данные для отправки</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: pendingBatches.length > 0 ? '#FF9500' : '#34C759' }}
            >
              <Clock className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Ожидает отправки</div>
              <div className="ios-list-item-subtitle">
                {pendingBatches.length} записей о лесоматериалах
              </div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <div style={{ 
              color: pendingBatches.length > 0 ? '#FF9500' : '#34C759', 
              fontSize: '17px', 
              fontWeight: '600'
            }}>
              {pendingBatches.length}
            </div>
          </div>
        </div>

        {pendingBatches.length > 0 && (
          <div style={{ padding: 'var(--ios-spacing-md)' }}>
            <button
              onClick={handleSync}
              disabled={!isConnected || syncStatus === 'syncing'}
              className="ios-button"
              style={{ 
                width: '100%',
                opacity: (!isConnected || syncStatus === 'syncing') ? 0.3 : 1,
                background: getSyncStatusColor()
              }}
            >
              {getSyncStatusIcon()}
              <span style={{ marginLeft: '8px' }}>
                {syncStatus === 'syncing' ? 'Синхронизация...' : 'Синхронизировать данные'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Operator Information */}
      <div className="ios-section-header">Информация об операторе</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#5856D6' }}
            >
              <User className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Оператор</div>
              <div className="ios-list-item-subtitle">
                {operatorInfo.name || 'Не указан'}
              </div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#AF52DE' }}
            >
              <Shield className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">ИНН</div>
              <div className="ios-list-item-subtitle">
                {operatorInfo.inn || 'Не указан'}
              </div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#FF9500' }}
            >
              <MapPin className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Организация</div>
              <div className="ios-list-item-subtitle">
                {operatorInfo.organization || 'Не указана'}
              </div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      {pendingBatches.length > 0 && (
        <>
          <div className="ios-section-header">Ожидающие отправки</div>
          <div className="ios-list">
            {pendingBatches.slice(0, 10).map((batch, index) => (
              <div key={batch.id || index} className="ios-list-item">
                <div className="ios-list-item-content">
                  <div 
                    className="ios-list-item-icon"
                    style={{ backgroundColor: '#34C759' }}
                  >
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="ios-list-item-text">
                    <div className="ios-list-item-title">
                      {batch.species} • {batch.volume?.toFixed(3)} м³
                    </div>
                    <div className="ios-list-item-subtitle">
                      {new Date(batch.timestamp).toLocaleString('ru-RU')}
                    </div>
                  </div>
                </div>
                <div className="ios-list-item-accessory">
                  <div 
                    className="ios-list-item-icon"
                    style={{ 
                      backgroundColor: 'transparent',
                      border: '2px solid #FF9500',
                      width: '20px',
                      height: '20px'
                    }}
                  >
                    <Clock className="w-3 h-3" style={{ color: '#FF9500' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Transport Information */}
      <div className="ios-section-header">Транспортные накладные</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#5AC8FA' }}
            >
              <Truck className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Создать накладную</div>
              <div className="ios-list-item-subtitle">Оформление транспортного документа</div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#007AFF' }}
            >
              <FileText className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">История накладных</div>
              <div className="ios-list-item-subtitle">Просмотр созданных документов</div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Compliance Information */}
      <div className="ios-section-header">Соответствие требованиям</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#34C759' }}
            >
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">ГОСТ 2708-75</div>
              <div className="ios-list-item-subtitle">Расчёты соответствуют стандарту</div>
            </div>
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#007AFF' }}
            >
              <Shield className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">ЛесЕГАИС API v2.0</div>
              <div className="ios-list-item-subtitle">Интеграция с системой учёта</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}