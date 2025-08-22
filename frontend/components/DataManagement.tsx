import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { DataTable } from './ui/data-table';
import { ProgressIndicator } from './ui/progress-indicator';
import { StatusBadge } from './ui/status-badge';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useFieldOperations } from './ui/use-mobile';
import { cn } from './ui/utils';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Search,
  Filter,
  TreePine,
  Calendar,
  MapPin,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Settings,
  RefreshCw,
  User
} from 'lucide-react';

interface CalculationData {
  id: number;
  calculationId: string;
  diameter: number;
  length: number;
  species: string;
  standard: string;
  volume: number;
  timestamp: string;
  coordinates: { lat: number; lng: number } | null;
  location: {
    forest: string;
    plot: string;
  };
  transport: {
    type: string;
    plateNumber: string;
    driverName: string;
  };
  batch: {
    number: string;
    date: string;
    operator: string;
  };
  documents: string[];
  synced: boolean;
}

export function DataManagement() {
  const fieldOps = useFieldOperations();
  const [calculations, setCalculations] = useState<CalculationData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showSyncOnly, setShowSyncOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load calculations on component mount
  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = () => {
    try {
      setIsLoading(true);
      const saved = localStorage.getItem('forestry-calculations');
      if (saved) {
        setCalculations(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading calculations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(calculations, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `forestry-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Ошибка экспорта данных');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedData)) {
            const updatedCalculations = [...calculations, ...importedData];
            setCalculations(updatedCalculations);
            localStorage.setItem('forestry-calculations', JSON.stringify(updatedCalculations));
            alert(`Импортировано ${importedData.length} записей`);
          }
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Ошибка импорта данных');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Удалить эту запись?')) {
      const updatedCalculations = calculations.filter(calc => calc.id !== id);
      setCalculations(updatedCalculations);
      localStorage.setItem('forestry-calculations', JSON.stringify(updatedCalculations));
    }
  };

  const handleClearAll = () => {
    if (confirm('Удалить все данные? Это действие нельзя отменить.')) {
      setCalculations([]);
      localStorage.removeItem('forestry-calculations');
      localStorage.removeItem('forestry-batches');
    }
  };

  const handleSync = () => {
    // Simulate sync process
    setIsLoading(true);
    setTimeout(() => {
      const updatedCalculations = calculations.map(calc => ({ ...calc, synced: true }));
      setCalculations(updatedCalculations);
      localStorage.setItem('forestry-calculations', JSON.stringify(updatedCalculations));
      setIsLoading(false);
    }, 2000);
  };

  const handleDeleteCalculation = (id: number) => {
    if (confirm('Удалить эту запись расчёта?')) {
      const updatedCalculations = calculations.filter(calc => calc.id !== id);
      setCalculations(updatedCalculations);
      localStorage.setItem('forestry-calculations', JSON.stringify(updatedCalculations));
    }
  };

  // Filter and sort calculations
  const filteredCalculations = calculations
    .filter(calc => {
      const matchesSearch = searchTerm === '' || 
        calc.calculationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.batch.operator.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecies = filterSpecies === '' || calc.species === filterSpecies;
      const matchesSync = !showSyncOnly || !calc.synced;
      
      return matchesSearch && matchesSpecies && matchesSync;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return b.volume - a.volume;
        case 'species':
          return a.species.localeCompare(b.species);
        case 'operator':
          return a.batch.operator.localeCompare(b.batch.operator);
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

  const totalVolume = filteredCalculations.reduce((sum, calc) => sum + calc.volume, 0);
  const speciesList = [...new Set(calculations.map(calc => calc.species))];
  const unsyncedCount = calculations.filter(calc => !calc.synced).length;
  const syncProgress = calculations.length > 0 ? ((calculations.length - unsyncedCount) / calculations.length) * 100 : 100;

  // Data table columns
  const columns = [
    {
      key: 'batch' as keyof CalculationData,
      label: 'Партия',
      sortable: true,
      filterable: true,
      render: (value: any, row: CalculationData) => (
        <div className="flex flex-col">
          <div className="font-medium text-surface-on-surface">{row.batch.number}</div>
          <div className="text-caption text-surface-on-variant">{row.batch.date}</div>
        </div>
      )
    },
    {
      key: 'species' as keyof CalculationData,
      label: 'Порода',
      sortable: true,
      filterable: true,
      render: (value: any, row: CalculationData) => (
        <div className="flex items-center gap-2">
          <TreePine className="w-4 h-4 text-brand-primary" />
          <span>{row.species}</span>
        </div>
      )
    },
    {
      key: 'volume' as keyof CalculationData,
      label: 'Объём',
      sortable: true,
      render: (value: any, row: CalculationData) => (
        <div className="text-right">
          <div className="font-medium">{row.volume.toFixed(3)} м³</div>
          <div className="text-caption text-surface-on-variant">
            Ø{row.diameter}см × {row.length}м
          </div>
        </div>
      )
    },
    {
      key: 'transport' as keyof CalculationData,
      label: 'Транспорт',
      render: (value: any, row: CalculationData) => (
        <div className="flex flex-col">
          <div className="font-medium">{row.transport.plateNumber}</div>
          <div className="text-caption text-surface-on-variant">{row.transport.type}</div>
        </div>
      )
    },
    {
      key: 'timestamp' as keyof CalculationData,
      label: 'Дата',
      sortable: true,
      render: (value: any, row: CalculationData) => (
        <div className="flex flex-col">
          <div className="font-medium">
            {new Date(row.timestamp).toLocaleDateString('ru-RU')}
          </div>
          <div className="text-caption text-surface-on-variant">
            {new Date(row.timestamp).toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      )
    },
    {
      key: 'synced' as keyof CalculationData,
      label: 'Статус',
      render: (value: any, row: CalculationData) => (
        <StatusBadge
          status={row.synced ? 'success' : 'pending'}
          label={row.synced ? 'Синхронизировано' : 'Ожидает'}
          showIcon={true}
        />
      )
    }
  ];

  const renderSearchAndFilters = () => (
    <div className={cn(
      "space-y-4",
      fieldOps.shouldUseCompactLayout && "space-y-3"
    )}>
      {/* Search Bar */}
      <div className="ios-card p-4">
        <div className="relative">
          <Search className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-on-variant",
            fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
          )} />
          <input
            type="text"
            placeholder="Поиск по ID, породе, оператору..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-3 border border-surface-border rounded-lg bg-surface-bg text-surface-on-surface placeholder-surface-on-variant focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary",
              fieldOps.shouldUseLargeButtons && "py-4 text-field-base",
              fieldOps.shouldUseLargerText && "text-field-lg"
            )}
          />
        </div>
      </div>

      {/* Filters */}
      <div className={cn(
        "grid gap-3",
        fieldOps.isMobile ? "grid-cols-1" : "grid-cols-2",
        fieldOps.isLandscape && "grid-cols-3 gap-2"
      )}>
        <div className="ios-card p-4">
          <div className={cn(
            "text-field-sm font-medium mb-2",
            fieldOps.shouldUseLargerText && "text-field-base"
          )}>
            Порода дерева
          </div>
          <select
            value={filterSpecies}
            onChange={(e) => setFilterSpecies(e.target.value)}
            className={cn(
              "w-full p-3 border border-surface-border rounded-lg bg-surface-bg text-surface-on-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary",
              fieldOps.shouldUseLargeButtons && "py-4 text-field-base",
              fieldOps.shouldUseLargerText && "text-field-lg"
            )}
          >
            <option value="">Все породы</option>
            <option value="Сосна">Сосна</option>
            <option value="Ель">Ель</option>
            <option value="Берёза">Берёза</option>
            <option value="Дуб">Дуб</option>
            <option value="Осина">Осина</option>
          </select>
        </div>

        <div className="ios-card p-4">
          <div className={cn(
            "text-field-sm font-medium mb-2",
            fieldOps.shouldUseLargerText && "text-field-base"
          )}>
            Сортировка
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={cn(
              "w-full p-3 border border-surface-border rounded-lg bg-surface-bg text-surface-on-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary",
              fieldOps.shouldUseLargeButtons && "py-4 text-field-base",
              fieldOps.shouldUseLargerText && "text-field-lg"
            )}
          >
            <option value="date">По дате</option>
            <option value="volume">По объёму</option>
            <option value="species">По породе</option>
            <option value="operator">По оператору</option>
          </select>
        </div>

        {fieldOps.isLandscape && (
          <div className="ios-card p-4">
            <div className={cn(
              "text-field-sm font-medium mb-2",
              fieldOps.shouldUseLargerText && "text-field-base"
            )}>
              Статус синхронизации
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showSyncOnly}
                onChange={(e) => setShowSyncOnly(e.target.checked)}
                className={cn(
                  "w-4 h-4 text-brand-primary border-surface-border rounded focus:ring-brand-primary/20",
                  fieldOps.shouldUseLargeButtons && "w-5 h-5"
                )}
              />
              <span className={cn(
                "text-field-sm",
                fieldOps.shouldUseLargerText && "text-field-base"
              )}>
                Только несинхронизированные
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Sync Filter for Mobile */}
      {!fieldOps.isLandscape && (
        <div className="ios-card p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showSyncOnly}
              onChange={(e) => setShowSyncOnly(e.target.checked)}
              className={cn(
                "w-5 h-5 text-brand-primary border-surface-border rounded focus:ring-brand-primary/20",
                fieldOps.shouldUseLargeButtons && "w-6 h-6"
              )}
            />
            <span className={cn(
              "text-field-base font-medium",
              fieldOps.shouldUseLargerText && "text-field-lg"
            )}>
              Показать только несинхронизированные записи
            </span>
          </label>
        </div>
      )}
    </div>
  );

  const renderStatistics = () => {
    const totalVolume = calculations.reduce((sum, calc) => sum + calc.volume, 0);
    const syncedCount = calculations.filter(calc => calc.synced).length;
    const pendingCount = calculations.length - syncedCount;
    const uniqueSpecies = new Set(calculations.map(calc => calc.species)).size;

    return (
      <div className={cn(
        "space-y-4",
        fieldOps.shouldUseCompactLayout && "space-y-3"
      )}>
        <div className={cn(
          "ios-section-header",
          fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
        )}>
          Статистика
        </div>
        
        <div className={cn(
          "grid gap-3",
          fieldOps.isMobile ? "grid-cols-2" : "grid-cols-4",
          fieldOps.isLandscape && "grid-cols-4 gap-2"
        )}>
          <div className="ios-card p-4 text-center">
            <div className={cn(
              "text-field-lg font-bold text-brand-primary mb-1",
              fieldOps.shouldUseLargerText && "text-field-xl"
            )}>
              {calculations.length}
            </div>
            <div className={cn(
              "text-field-xs text-surface-on-variant",
              fieldOps.shouldUseLargerText && "text-field-sm"
            )}>
              Всего записей
            </div>
          </div>

          <div className="ios-card p-4 text-center">
            <div className={cn(
              "text-field-lg font-bold text-status-success mb-1",
              fieldOps.shouldUseLargerText && "text-field-xl"
            )}>
              {totalVolume.toFixed(1)}
            </div>
            <div className={cn(
              "text-field-xs text-surface-on-variant",
              fieldOps.shouldUseLargerText && "text-field-sm"
            )}>
              Общий объём (м³)
            </div>
          </div>

          <div className="ios-card p-4 text-center">
            <div className={cn(
              "text-field-lg font-bold text-status-info mb-1",
              fieldOps.shouldUseLargerText && "text-field-xl"
            )}>
              {uniqueSpecies}
            </div>
            <div className={cn(
              "text-field-xs text-surface-on-variant",
              fieldOps.shouldUseLargerText && "text-field-sm"
            )}>
              Породы деревьев
            </div>
          </div>

          <div className="ios-card p-4 text-center">
            <div className={cn(
              "text-field-lg font-bold text-status-warning mb-1",
              fieldOps.shouldUseLargerText && "text-field-xl"
            )}>
              {pendingCount}
            </div>
            <div className={cn(
              "text-field-xs text-surface-on-variant",
              fieldOps.shouldUseLargerText && "text-field-sm"
            )}>
              Ожидают синхронизации
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActions = () => (
    <div className={cn(
      "space-y-4",
      fieldOps.shouldUseCompactLayout && "space-y-3"
    )}>
      <div className={cn(
        "ios-section-header",
        fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
      )}>
        Действия
      </div>
      
      <div className={cn(
        "grid gap-3",
        fieldOps.isMobile ? "grid-cols-1" : "grid-cols-2",
        fieldOps.isLandscape && "grid-cols-3 gap-2"
      )}>
        <button
          onClick={handleExport}
          className={cn(
            "ios-card touch-target p-4 text-left transition-all duration-200 hover:scale-105 active:scale-95",
            fieldOps.shouldUseLargeButtons && "p-5"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "ios-list-item-icon",
              fieldOps.shouldUseLargeButtons && "w-12 h-12"
            )}>
              <Download className={cn(
                fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-5 h-5"
              )} />
            </div>
          </div>
          <div className={cn(
            "text-field-base font-semibold text-surface-on-surface mb-1",
            fieldOps.shouldUseLargerText && "text-field-lg"
          )}>
            Экспорт данных
          </div>
          <div className={cn(
            "text-field-xs text-surface-on-variant",
            fieldOps.shouldUseLargerText && "text-field-sm"
          )}>
            Скачать все записи в JSON
          </div>
        </button>

        <button
          onClick={() => document.getElementById('import-file')?.click()}
          className={cn(
            "ios-card touch-target p-4 text-left transition-all duration-200 hover:scale-105 active:scale-95",
            fieldOps.shouldUseLargeButtons && "p-5"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "ios-list-item-icon",
              fieldOps.shouldUseLargeButtons && "w-12 h-12"
            )}>
              <Upload className={cn(
                fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-5 h-5"
              )} />
            </div>
          </div>
          <div className={cn(
            "text-field-base font-semibold text-surface-on-surface mb-1",
            fieldOps.shouldUseLargerText && "text-field-lg"
          )}>
            Импорт данных
          </div>
          <div className={cn(
            "text-field-xs text-surface-on-variant",
            fieldOps.shouldUseLargerText && "text-field-sm"
          )}>
            Загрузить данные из файла
          </div>
        </button>

        <button
          onClick={loadCalculations}
          disabled={isLoading}
          className={cn(
            "ios-card touch-target p-4 text-left transition-all duration-200 hover:scale-105 active:scale-95",
            fieldOps.shouldUseLargeButtons && "p-5",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "ios-list-item-icon",
              fieldOps.shouldUseLargeButtons && "w-12 h-12"
            )}>
              <RefreshCw className={cn(
                fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-5 h-5",
                isLoading && "animate-spin"
              )} />
            </div>
          </div>
          <div className={cn(
            "text-field-base font-semibold text-surface-on-surface mb-1",
            fieldOps.shouldUseLargerText && "text-field-lg"
          )}>
            Обновить
          </div>
          <div className={cn(
            "text-field-xs text-surface-on-variant",
            fieldOps.shouldUseLargerText && "text-field-sm"
          )}>
            Загрузить данные заново
          </div>
        </button>
      </div>

      <input
        id="import-file"
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );

  const renderDataTable = () => {
    const filteredCalculations = calculations
      .filter(calc => {
        const matchesSearch = searchTerm === '' || 
          calc.calculationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          calc.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
          calc.batch.operator.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSpecies = filterSpecies === '' || calc.species === filterSpecies;
        const matchesSync = !showSyncOnly || !calc.synced;
        
        return matchesSearch && matchesSpecies && matchesSync;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'volume':
            return b.volume - a.volume;
          case 'species':
            return a.species.localeCompare(b.species);
          case 'operator':
            return a.batch.operator.localeCompare(b.batch.operator);
          default:
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
      });

    return (
      <div className={cn(
        "space-y-4",
        fieldOps.shouldUseCompactLayout && "space-y-3"
      )}>
        <div className={cn(
          "ios-section-header",
          fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
        )}>
          Записи ({filteredCalculations.length})
        </div>
        
        {filteredCalculations.length === 0 ? (
          <div className="ios-card p-8 text-center">
            <Database className={cn(
              "mx-auto mb-4 text-surface-on-variant",
              fieldOps.shouldUseLargeButtons ? "w-12 h-12" : "w-8 h-8"
            )} />
            <div className={cn(
              "text-field-base text-surface-on-variant",
              fieldOps.shouldUseLargerText && "text-field-lg"
            )}>
              {calculations.length === 0 ? 'Нет сохранённых записей' : 'Записи не найдены'}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCalculations.map((calc) => (
              <div key={calc.id} className="ios-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn(
                      fieldOps.shouldUseLargerText && "text-field-sm"
                    )}>
                      {calc.calculationId}
                    </Badge>
                    <StatusBadge
                      status={calc.synced ? 'success' : 'pending'}
                      fieldMode={true}
                      compact={fieldOps.shouldUseCompactLayout}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-field-lg font-bold text-brand-primary",
                      fieldOps.shouldUseLargerText && "text-field-xl"
                    )}>
                      {calc.volume.toFixed(3)} м³
                    </span>
                  </div>
                </div>
                
                <div className={cn(
                  "grid gap-2",
                  fieldOps.isMobile ? "grid-cols-1" : "grid-cols-2",
                  fieldOps.isLandscape && "grid-cols-3 gap-1"
                )}>
                  <div className="flex items-center gap-2">
                    <TreePine className={cn(
                      "text-surface-on-variant",
                      fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
                    )} />
                    <span className={cn(
                      "text-field-sm",
                      fieldOps.shouldUseLargerText && "text-field-base"
                    )}>
                      {calc.species}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className={cn(
                      "text-surface-on-variant",
                      fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
                    )} />
                    <span className={cn(
                      "text-field-sm",
                      fieldOps.shouldUseLargerText && "text-field-base"
                    )}>
                      {calc.batch.operator}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className={cn(
                      "text-surface-on-variant",
                      fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
                    )} />
                    <span className={cn(
                      "text-field-sm",
                      fieldOps.shouldUseLargerText && "text-field-base"
                    )}>
                      {new Date(calc.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {calc.coordinates && (
                    <div className="flex items-center gap-2">
                      <MapPin className={cn(
                        "text-surface-on-variant",
                        fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
                      )} />
                      <span className={cn(
                        "text-field-sm",
                        fieldOps.shouldUseLargerText && "text-field-base"
                      )}>
                        {calc.coordinates.lat.toFixed(4)}, {calc.coordinates.lng.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 pt-3 border-t border-surface-border">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-field-xs text-surface-on-variant",
                      fieldOps.shouldUseLargerText && "text-field-sm"
                    )}>
                      Диаметр: {calc.diameter} см, Длина: {calc.length} м
                    </span>
                    <button
                      onClick={() => handleDeleteCalculation(calc.id)}
                      className={cn(
                        "text-status-error hover:text-status-error/80 touch-target p-1",
                        fieldOps.shouldUseLargeButtons && "p-2"
                      )}
                    >
                      <Trash2 className={cn(
                        "w-4 h-4",
                        fieldOps.shouldUseLargeButtons && "w-5 h-5"
                      )} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "space-y-6 pb-6",
      fieldOps.shouldUseCompactLayout && "space-y-4",
      fieldOps.isLandscape && "space-y-3"
    )}>
      {/* Header */}
      <div className={cn(
        "ios-section-header",
        fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
      )}>
        Управление данными
      </div>

      {/* Search and Filters */}
      {renderSearchAndFilters()}

      {/* Statistics */}
      {renderStatistics()}

      {/* Actions */}
      {renderActions()}

      {/* Data Table */}
      {renderDataTable()}
    </div>
  );
}