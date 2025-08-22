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
  WifiOff,
  Gps,
  Camera,
  Database,
  BarChart3,
  FileText,
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import { useFieldOperations } from './ui/use-mobile';
import { cn } from './ui/utils';

interface DashboardProps {
  onSectionChange: (section: string) => void;
  isOnline: boolean;
  pendingSync: number;
}

export function Dashboard({ onSectionChange, isOnline, pendingSync }: DashboardProps) {
  const fieldOps = useFieldOperations();
  const [recentActivity] = useState([
    { 
      id: 1, 
      type: 'calculation', 
      species: 'Сосна', 
      volume: 2.34, 
      timestamp: '2 ч назад',
      location: 'Участок 23-А',
      status: 'completed',
      operator: 'Иван Петров'
    },
    { 
      id: 2, 
      type: 'sync', 
      species: 'Ель', 
      volume: 1.87, 
      timestamp: '4 ч назад',
      location: 'Участок 15-Б',
      status: 'pending',
      operator: 'Мария Сидорова'
    },
    { 
      id: 3, 
      type: 'lesegais', 
      species: 'Берёза', 
      volume: 3.21, 
      timestamp: '6 ч назад',
      location: 'Участок 31-В',
      status: 'completed',
      operator: 'Алексей Козлов'
    },
  ]);

  const quickStats = [
    { 
      label: 'Сегодня', 
      value: '12.4 м³', 
      icon: TreePine, 
      color: '#34C759',
      trend: '+8.2%',
      trendDirection: 'up'
    },
    { 
      label: 'Неделя', 
      value: '89.2 м³', 
      icon: TrendingUp, 
      color: '#007AFF',
      trend: '+12.5%',
      trendDirection: 'up'
    },
    { 
      label: 'Участки', 
      value: '5', 
      icon: MapPin, 
      color: '#FF9500',
      trend: '2 активных',
      trendDirection: 'neutral'
    },
    { 
      label: 'Операторы', 
      value: '3', 
      icon: Users, 
      color: '#AF52DE',
      trend: 'Все в поле',
      trendDirection: 'neutral'
    },
  ];

  const quickActions = [
    {
      id: 'new-calc',
      label: 'Новый расчёт',
      icon: Calculator,
      color: '#34C759',
      description: 'Создать расчёт объёма',
      action: () => onSectionChange('calculator')
    },
    {
      id: 'history',
      label: 'История',
      icon: History,
      color: '#007AFF',
      description: 'Просмотр записей',
      action: () => onSectionChange('data')
    },
    {
      id: 'analytics',
      label: 'Аналитика',
      icon: BarChart3,
      color: '#AF52DE',
      description: 'Отчёты и графики',
      action: () => onSectionChange('analytics')
    },
    {
      id: 'lesegais',
      label: 'ЕГАИС',
      icon: FileText,
      color: '#FF9500',
      description: 'Интеграция с системой',
      action: () => onSectionChange('lesegais')
    }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-calc':
        onSectionChange('calculator');
        break;
      case 'history':
        onSectionChange('data');
        break;
      case 'analytics':
        onSectionChange('analytics');
        break;
      case 'lesegais':
        onSectionChange('lesegais');
        break;
      case 'settings':
        onSectionChange('settings');
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn(
      "space-y-6 pb-6",
      fieldOps.shouldUseCompactLayout && "space-y-4",
      fieldOps.isLandscape && "space-y-3"
    )}>
      {/* Enhanced Status Section */}
      <div className={cn(
        "ios-section-header",
        fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
      )}>
        Состояние системы
      </div>
      
      <div className="ios-list space-y-2">
        {/* Connection Status */}
        <div className="ios-list-item touch-target">
          <div className="ios-list-item-content">
            <div 
              className={cn(
                "ios-list-item-icon",
                fieldOps.shouldUseLargeButtons && "w-12 h-12"
              )}
              style={{ backgroundColor: isOnline ? '#34C759' : '#FF3B30' }}
            >
              {isOnline ? (
                <Wifi className={cn(
                  fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
                )} />
              ) : (
                <WifiOff className={cn(
                  fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
                )} />
              )}
            </div>
            <div className="ios-list-item-text">
              <div className={cn(
                "ios-list-item-title",
                fieldOps.shouldUseLargerText && "text-field-base font-medium"
              )}>
                {isOnline ? 'Подключение активно' : 'Нет подключения'}
              </div>
              <div className={cn(
                "ios-list-item-subtitle",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {isOnline ? 'Синхронизация включена' : 'Работа в автономном режиме'}
              </div>
            </div>
          </div>
          
          {/* Field operation indicators */}
          {fieldOps.shouldShowGPSFeatures && (
            <div className="flex items-center gap-2">
              <Gps className={cn(
                "text-status-info",
                fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
              )} />
              <span className={cn(
                "text-field-xs text-status-info",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                GPS
              </span>
            </div>
          )}
        </div>

        {/* Sync Status */}
        {pendingSync > 0 && (
          <div className="ios-list-item touch-target">
            <div className="ios-list-item-content">
              <div 
                className={cn(
                  "ios-list-item-icon",
                  fieldOps.shouldUseLargeButtons && "w-12 h-12"
                )}
                style={{ backgroundColor: '#FF9500' }}
              >
                <Database className={cn(
                  fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
                )} />
              </div>
              <div className="ios-list-item-text">
                <div className={cn(
                  "ios-list-item-title",
                  fieldOps.shouldUseLargerText && "text-field-base font-medium"
                )}>
                  Ожидают синхронизации
                </div>
                <div className={cn(
                  "ios-list-item-subtitle",
                  fieldOps.shouldUseLargerText && "text-field-sm"
                )}>
                  {pendingSync} записей
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className={cn(
                "bg-status-warning text-white rounded-full px-2 py-1 text-field-xs font-medium",
                fieldOps.shouldUseLargerText && "text-field-sm px-3 py-1.5"
              )}>
                {pendingSync}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Quick Stats Grid */}
      <div className={cn(
        "ios-section-header",
        fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
      )}>
        Статистика
      </div>
      
      <div className={cn(
        "grid grid-cols-2 gap-3",
        fieldOps.shouldUseCompactLayout && "gap-2",
        fieldOps.isLandscape && "grid-cols-4 gap-2"
      )}>
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              "ios-card touch-target p-4",
              fieldOps.shouldUseLargeButtons && "p-5",
              fieldOps.shouldUseLargerText && "p-4"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div 
                className={cn(
                  "ios-list-item-icon",
                  fieldOps.shouldUseLargeButtons && "w-10 h-10"
                )}
                style={{ backgroundColor: stat.color }}
              >
                <stat.icon className={cn(
                  fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
                )} />
              </div>
              <span className={cn(
                "text-field-xs font-medium",
                stat.trendDirection === 'up' ? "text-status-success" : 
                stat.trendDirection === 'down' ? "text-status-error" : "text-status-info",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {stat.trend}
              </span>
            </div>
            <div className={cn(
              "text-field-lg font-bold text-surface-on-surface",
              fieldOps.shouldUseLargerText && "text-field-xl"
            )}>
              {stat.value}
            </div>
            <div className={cn(
              "text-field-xs text-surface-on-variant",
              fieldOps.shouldUseLargerText && "text-field-sm"
            )}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Quick Actions */}
      <div className={cn(
        "ios-section-header",
        fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
      )}>
        Быстрые действия
      </div>
      
      <div className={cn(
        "grid grid-cols-2 gap-3",
        fieldOps.shouldUseCompactLayout && "gap-2",
        fieldOps.isLandscape && "grid-cols-4 gap-2"
      )}>
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={cn(
              "ios-card touch-target p-4 text-left transition-all duration-200 hover:scale-105 active:scale-95",
              fieldOps.shouldUseLargeButtons && "p-5",
              fieldOps.shouldUseLargerText && "p-4"
            )}
          >
            <div 
              className={cn(
                "ios-list-item-icon mb-3",
                fieldOps.shouldUseLargeButtons && "w-12 h-12 mb-4"
              )}
              style={{ backgroundColor: action.color }}
            >
              <action.icon className={cn(
                fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-5 h-5"
              )} />
            </div>
            <div className={cn(
              "text-field-base font-semibold text-surface-on-surface mb-1",
              fieldOps.shouldUseLargerText && "text-field-lg"
            )}>
              {action.label}
            </div>
            <div className={cn(
              "text-field-xs text-surface-on-variant",
              fieldOps.shouldUseLargerText && "text-field-sm"
            )}>
              {action.description}
            </div>
          </button>
        ))}
      </div>

      {/* Enhanced Recent Activity */}
      <div className={cn(
        "ios-section-header",
        fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
      )}>
        Последняя активность
      </div>
      
      <div className="ios-list space-y-2">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="ios-list-item touch-target">
            <div className="ios-list-item-content">
              <div 
                className={cn(
                  "ios-list-item-icon",
                  fieldOps.shouldUseLargeButtons && "w-12 h-12"
                )}
                style={{ 
                  backgroundColor: activity.status === 'completed' ? '#34C759' : 
                                 activity.status === 'pending' ? '#FF9500' : '#007AFF'
                }}
              >
                {activity.type === 'calculation' && (
                  <Calculator className={cn(
                    fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
                  )} />
                )}
                {activity.type === 'sync' && (
                  <Database className={cn(
                    fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
                  )} />
                )}
                {activity.type === 'lesegais' && (
                  <FileText className={cn(
                    fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
                  )} />
                )}
              </div>
              <div className="ios-list-item-text">
                <div className={cn(
                  "ios-list-item-title",
                  fieldOps.shouldUseLargerText && "text-field-base font-medium"
                )}>
                  {activity.species} - {activity.volume} м³
                </div>
                <div className={cn(
                  "ios-list-item-subtitle",
                  fieldOps.shouldUseLargerText && "text-field-sm"
                )}>
                  {activity.location} • {activity.operator}
                </div>
                <div className={cn(
                  "text-field-xs text-surface-on-variant flex items-center gap-1 mt-1",
                  fieldOps.shouldUseLargerText && "text-field-sm"
                )}>
                  <Clock className="w-3 h-3" />
                  {activity.timestamp}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {activity.status === 'completed' ? (
                <CheckCircle className={cn(
                  "text-status-success",
                  fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
                )} />
              ) : (
                <AlertTriangle className={cn(
                  "text-status-warning",
                  fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
                )} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View All Activity Button */}
      <div className="flex justify-center">
        <button
          onClick={() => onSectionChange('data')}
          className={cn(
            "ios-button ios-button-secondary touch-target",
            fieldOps.shouldUseLargeButtons && "ios-button-lg"
          )}
        >
          <span>Просмотреть все записи</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}