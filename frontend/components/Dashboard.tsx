import { useState } from 'react';
import { 
  Calculator, 
  History, 
  Settings, 
  TreePine, 
  TrendingUp,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Wifi,
  WifiOff
} from 'lucide-react';

interface DashboardProps {
  onSectionChange: (section: string) => void;
  isOnline: boolean;
  pendingSync: number;
}

export function Dashboard({ onSectionChange, isOnline, pendingSync }: DashboardProps) {
  const [recentActivity] = useState([
    { 
      id: 1, 
      type: 'calculation', 
      species: 'Сосна', 
      volume: 2.34, 
      timestamp: '2 ч назад',
      location: 'Участок 23-А'
    },
    { 
      id: 2, 
      type: 'sync', 
      species: 'Ель', 
      volume: 1.87, 
      timestamp: '4 ч назад',
      location: 'Участок 15-Б'
    },
    { 
      id: 3, 
      type: 'lesegais', 
      species: 'Берёза', 
      volume: 3.21, 
      timestamp: '6 ч назад',
      location: 'Участок 31-В'
    },
  ]);

  const quickStats = [
    { label: 'Сегодня', value: '12.4 м³', icon: TreePine, color: 'var(--ios-green)' },
    { label: 'Неделя', value: '89.2 м³', icon: TrendingUp, color: 'var(--ios-blue)' },
    { label: 'Участки', value: '5', icon: MapPin, color: 'var(--ios-orange)' },
    { label: 'Операторы', value: '3', icon: Users, color: 'var(--ios-purple)' },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-calc':
        onSectionChange('calculator');
        break;
      case 'history':
        onSectionChange('data');
        break;
      case 'settings':
        onSectionChange('settings');
        break;
      default:
        break;
    }
  };

  return (
    <div>
      {/* Status Section */}
      <div className="ios-section-header">Состояние</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: isOnline ? 'var(--ios-green)' : 'var(--ios-red)' }}
            >
              {isOnline ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">
                {isOnline ? 'Подключение активно' : 'Нет подключения'}
              </div>
              <div className="ios-list-item-subtitle">
                {isOnline ? 'Синхронизация включена' : 'Работа в автономном режиме'}
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
              style={{ backgroundColor: pendingSync > 0 ? 'var(--ios-orange)' : 'var(--ios-green)' }}
            >
              <Clock className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">
                {pendingSync > 0 ? `${pendingSync} ожидает синхронизации` : 'Все синхронизировано'}
              </div>
              <div className="ios-list-item-subtitle">
                {pendingSync > 0 ? 'Данные будут отправлены при подключении' : 'Данные актуальны'}
              </div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="ios-section-header">Быстрые действия</div>
      <div className="ios-list">
        <button
          onClick={() => handleQuickAction('new-calc')}
          className="ios-list-item"
          style={{ border: 'none', background: 'transparent', width: '100%' }}
          type="button"
        >
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: 'var(--ios-blue)' }}
            >
              <Calculator className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Новый расчёт</div>
              <div className="ios-list-item-subtitle">Измерить объём круглого леса</div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => handleQuickAction('history')}
          className="ios-list-item"
          style={{ border: 'none', background: 'transparent', width: '100%' }}
          type="button"
        >
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: 'var(--ios-indigo)' }}
            >
              <History className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">История расчётов</div>
              <div className="ios-list-item-subtitle">Просмотр сохранённых данных</div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => handleQuickAction('settings')}
          className="ios-list-item"
          style={{ border: 'none', background: 'transparent', width: '100%' }}
          type="button"
        >
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: 'var(--ios-gray)' }}
            >
              <Settings className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Настройки</div>
              <div className="ios-list-item-subtitle">Конфигурация приложения</div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Statistics */}
      <div className="ios-section-header">Статистика</div>
      <div className="ios-list">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="ios-list-item">
              <div className="ios-list-item-content">
                <div 
                  className="ios-list-item-icon"
                  style={{ backgroundColor: stat.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="ios-list-item-text">
                  <div className="ios-list-item-title">{stat.label}</div>
                  <div className="ios-list-item-subtitle">{stat.value}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="ios-section-header">Недавняя активность</div>
      <div className="ios-list">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="ios-list-item">
            <div className="ios-list-item-content">
                <div 
                  className="ios-list-item-icon"
                  style={{ backgroundColor: 'var(--ios-green)' }}
                >
                <TreePine className="w-4 h-4" />
              </div>
              <div className="ios-list-item-text">
                <div className="ios-list-item-title">
                  {activity.species} • {activity.volume} м³
                </div>
                <div className="ios-list-item-subtitle">
                  {activity.location} • {activity.timestamp}
                </div>
              </div>
            </div>
            <div className="ios-list-item-accessory">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Add some bottom spacing */}
      <div style={{ height: '20px' }}></div>
    </div>
  );
}
