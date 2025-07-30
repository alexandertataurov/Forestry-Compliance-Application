import { useState, useEffect } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Smartphone, 
  Database, 
  Shield,
  Bell,
  Globe,
  Palette,
  Info,
  HelpCircle,
  Mail,
  ChevronRight,
  MapPin,
  Clock,
  Trash2
} from 'lucide-react';

export function Settings() {
  const [settings, setSettings] = useState({
    operatorName: '',
    operatorINN: '',
    organization: '',
    region: '',
    defaultSpecies: 'Сосна',
    autoCapturGPS: true,
    offlineMode: false,
    syncInterval: 15,
    dataRetention: 365,
    language: 'ru',
    theme: 'auto',
    notifications: true,
    precision: 3
  });

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('forestry-settings');
      if (saved) {
        setSettings({ ...settings, ...JSON.parse(saved) });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = (newSettings: typeof settings) => {
    try {
      setSettings(newSettings);
      localStorage.setItem('forestry-settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ошибка сохранения настроек');
    }
  };

  const handleInputChange = (field: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [field]: value };
    saveSettings(newSettings);
  };

  const handleExportSettings = () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `forestry-settings-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting settings:', error);
      alert('Ошибка экспорта настроек');
    }
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          const newSettings = { ...settings, ...importedSettings };
          saveSettings(newSettings);
          alert('Настройки импортированы');
        } catch (error) {
          console.error('Error importing settings:', error);
          alert('Ошибка импорта настроек');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetSettings = () => {
    if (confirm('Сбросить все настройки к значениям по умолчанию?')) {
      const defaultSettings = {
        operatorName: '',
        operatorINN: '',
        organization: '',
        region: '',
        defaultSpecies: 'Сосна',
        autoCapturGPS: true,
        offlineMode: false,
        syncInterval: 15,
        dataRetention: 365,
        language: 'ru',
        theme: 'auto',
        notifications: true,
        precision: 3
      };
      saveSettings(defaultSettings);
    }
  };

  const speciesList = [
    'Сосна', 'Ель', 'Лиственница', 'Пихта', 'Кедр', 
    'Берёза', 'Осина', 'Дуб', 'Бук', 'Ясень'
  ];

  const SwitchToggle = ({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: '44px',
        height: '28px',
        borderRadius: '14px',
        border: 'none',
        background: value ? 'var(--ios-blue)' : 'var(--ios-system-fill)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s ease'
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '12px',
          background: 'white',
          position: 'absolute',
          top: '2px',
          left: value ? '18px' : '2px',
          transition: 'left 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
    </button>
  );

  return (
    <div>
      {/* Operator Information */}
      <div className="ios-section-header">Информация об операторе</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#007AFF' }}
            >
              <User className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text" style={{ flex: 1 }}>
              <div className="ios-list-item-title">Имя оператора</div>
              <input
                type="text"
                value={settings.operatorName}
                onChange={(e) => handleInputChange('operatorName', e.target.value)}
                placeholder="Введите имя"
                style={{
                  width: '100%',
                  padding: '8px 0',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--ios-label)',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#5856D6' }}
            >
              <Shield className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text" style={{ flex: 1 }}>
              <div className="ios-list-item-title">ИНН</div>
              <input
                type="text"
                value={settings.operatorINN}
                onChange={(e) => handleInputChange('operatorINN', e.target.value)}
                placeholder="Введите ИНН"
                style={{
                  width: '100%',
                  padding: '8px 0',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--ios-label)',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>
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
            <div className="ios-list-item-text" style={{ flex: 1 }}>
              <div className="ios-list-item-title">Организация</div>
              <input
                type="text"
                value={settings.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                placeholder="Название организации"
                style={{
                  width: '100%',
                  padding: '8px 0',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--ios-label)',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Settings */}
      <div className="ios-section-header">Настройки расчётов</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#34C759' }}
            >
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Порода по умолчанию</div>
            </div>
          </div>
          <select
            value={settings.defaultSpecies}
            onChange={(e) => handleInputChange('defaultSpecies', e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--ios-radius-md)',
              border: '1px solid var(--ios-separator)',
              background: 'var(--ios-secondary-system-grouped-background)',
              color: 'var(--ios-label)',
              fontSize: '17px'
            }}
          >
            {speciesList.map(species => (
              <option key={species} value={species}>{species}</option>
            ))}
          </select>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#AF52DE' }}
            >
              <MapPin className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Автоматическое определение GPS</div>
              <div className="ios-list-item-subtitle">Захват координат при расчёте</div>
            </div>
          </div>
          <SwitchToggle 
            value={settings.autoCapturGPS}
            onChange={(value) => handleInputChange('autoCapturGPS', value)}
          />
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#5AC8FA' }}
            >
              <Database className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Точность расчётов</div>
            </div>
          </div>
          <select
            value={settings.precision}
            onChange={(e) => handleInputChange('precision', parseInt(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--ios-radius-md)',
              border: '1px solid var(--ios-separator)',
              background: 'var(--ios-secondary-system-grouped-background)',
              color: 'var(--ios-label)',
              fontSize: '17px'
            }}
          >
            <option value={2}>2 знака</option>
            <option value={3}>3 знака</option>
            <option value={4}>4 знака</option>
          </select>
        </div>
      </div>

      {/* Sync & Data Settings */}
      <div className="ios-section-header">Синхронизация и данные</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#007AFF' }}
            >
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Автономный режим</div>
              <div className="ios-list-item-subtitle">Работа без подключения к сети</div>
            </div>
          </div>
          <SwitchToggle 
            value={settings.offlineMode}
            onChange={(value) => handleInputChange('offlineMode', value)}
          />
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#FF9500' }}
            >
              <Clock className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Интервал синхронизации</div>
            </div>
          </div>
          <select
            value={settings.syncInterval}
            onChange={(e) => handleInputChange('syncInterval', parseInt(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--ios-radius-md)',
              border: '1px solid var(--ios-separator)',
              background: 'var(--ios-secondary-system-grouped-background)',
              color: 'var(--ios-label)',
              fontSize: '17px'
            }}
          >
            <option value={5}>5 минут</option>
            <option value={15}>15 минут</option>
            <option value={30}>30 минут</option>
            <option value={60}>1 час</option>
          </select>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#34C759' }}
            >
              <Database className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Хранение данных</div>
            </div>
          </div>
          <select
            value={settings.dataRetention}
            onChange={(e) => handleInputChange('dataRetention', parseInt(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--ios-radius-md)',
              border: '1px solid var(--ios-separator)',
              background: 'var(--ios-secondary-system-grouped-background)',
              color: 'var(--ios-label)',
              fontSize: '17px'
            }}
          >
            <option value={30}>30 дней</option>
            <option value={90}>90 дней</option>
            <option value={365}>1 год</option>
            <option value={-1}>Без ограничений</option>
          </select>
        </div>
      </div>

      {/* App Settings */}
      <div className="ios-section-header">Настройки приложения</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#5856D6' }}
            >
              <Globe className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Язык</div>
            </div>
          </div>
          <select
            value={settings.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--ios-radius-md)',
              border: '1px solid var(--ios-separator)',
              background: 'var(--ios-secondary-system-grouped-background)',
              color: 'var(--ios-label)',
              fontSize: '17px'
            }}
          >
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#FF2D92' }}
            >
              <Palette className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Тема оформления</div>
            </div>
          </div>
          <select
            value={settings.theme}
            onChange={(e) => handleInputChange('theme', e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--ios-radius-md)',
              border: '1px solid var(--ios-separator)',
              background: 'var(--ios-secondary-system-grouped-background)',
              color: 'var(--ios-label)',
              fontSize: '17px'
            }}
          >
            <option value="auto">Автоматически</option>
            <option value="light">Светлая</option>
            <option value="dark">Тёмная</option>
          </select>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#FF9500' }}
            >
              <Bell className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Уведомления</div>
              <div className="ios-list-item-subtitle">Системные уведомления</div>
            </div>
          </div>
          <SwitchToggle 
            value={settings.notifications}
            onChange={(value) => handleInputChange('notifications', value)}
          />
        </div>
      </div>

      {/* Data Management */}
      <div className="ios-section-header">Управление настройками</div>
      <div className="ios-list">
        <button
          onClick={handleExportSettings}
          className="ios-list-item"
          style={{ border: 'none', background: 'transparent', width: '100%' }}
        >
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#34C759' }}
            >
              <Database className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Экспорт настроек</div>
              <div className="ios-list-item-subtitle">Сохранить в файл</div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#007AFF' }}
            >
              <Database className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Импорт настроек</div>
              <div className="ios-list-item-subtitle">Загрузить из файла</div>
            </div>
          </div>
          <input
            type="file"
            accept=".json"
            onChange={handleImportSettings}
            style={{ display: 'none' }}
            id="settings-import"
          />
          <label 
            htmlFor="settings-import"
            className="ios-list-item-accessory"
            style={{ cursor: 'pointer' }}
          >
            <ChevronRight className="w-5 h-5" />
          </label>
        </div>

        <button
          onClick={handleResetSettings}
          className="ios-list-item"
          style={{ border: 'none', background: 'transparent', width: '100%' }}
        >
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#FF3B30' }}
            >
              <Trash2 className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title" style={{ color: '#FF3B30' }}>
                Сбросить настройки
              </div>
              <div className="ios-list-item-subtitle">
                Восстановить значения по умолчанию
              </div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* About & Support */}
      <div className="ios-section-header">Справка и поддержка</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#5AC8FA' }}
            >
              <Info className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">О приложении</div>
              <div className="ios-list-item-subtitle">Версия 1.0.0</div>
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
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Справка</div>
              <div className="ios-list-item-subtitle">Руководство пользователя</div>
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
              <Mail className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Техническая поддержка</div>
              <div className="ios-list-item-subtitle">support@forestry.ru</div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}