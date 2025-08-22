import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { DataTable } from './ui/data-table';
import { ProgressIndicator } from './ui/progress-indicator';
import { StatusBadge } from './ui/status-badge';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
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
  RefreshCw
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

  // Filter and sort calculations
  const filteredCalculations = calculations
    .filter(calc => {
      const matchesSearch = calc.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           calc.batch.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           calc.transport.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecies = !filterSpecies || calc.species === filterSpecies;
      const matchesSync = !showSyncOnly || !calc.synced;
      return matchesSearch && matchesSpecies && matchesSync;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'species':
          return a.species.localeCompare(b.species);
        case 'volume':
          return b.volume - a.volume;
        case 'date':
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

  return (
    <div className="space-y-6 p-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                <Database className="w-5 h-5 text-brand-on-primary" />
              </div>
              <div>
                <div className="text-caption text-surface-on-variant">Всего записей</div>
                <div className="text-title font-title text-surface-on-surface">{calculations.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-state-success flex items-center justify-center">
                <TreePine className="w-5 h-5 text-state-on-success" />
              </div>
              <div>
                <div className="text-caption text-surface-on-variant">Общий объём</div>
                <div className="text-title font-title text-surface-on-surface">{totalVolume.toFixed(3)} м³</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-state-warning flex items-center justify-center">
                <Clock className="w-5 h-5 text-state-on-warning" />
              </div>
              <div>
                <div className="text-caption text-surface-on-variant">Ожидает синхронизации</div>
                <div className="text-title font-title text-surface-on-surface">{unsyncedCount}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand-on-secondary" />
              </div>
              <div>
                <div className="text-caption text-surface-on-variant">Породы</div>
                <div className="text-title font-title text-surface-on-surface">{speciesList.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Progress */}
      {calculations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Прогресс синхронизации
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressIndicator
              value={syncProgress}
              max={100}
              label={`${calculations.length - unsyncedCount} из ${calculations.length} записей синхронизировано`}
              showPercentage={true}
              variant="default"
              size="default"
            />
            {unsyncedCount > 0 && (
              <div className="mt-4">
                <Button onClick={handleSync} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Синхронизация...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Синхронизировать все
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Фильтры и действия
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-body font-medium text-surface-on-surface">Поиск</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-on-variant" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Поиск по партии, породе, транспорту..."
                  className="w-full pl-10 pr-4 py-2 border border-surface-border rounded-lg bg-surface-bg text-surface-on-surface placeholder:text-surface-on-variant focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-body font-medium text-surface-on-surface">Порода</label>
              <select
                value={filterSpecies}
                onChange={(e) => setFilterSpecies(e.target.value)}
                className="w-full px-4 py-2 border border-surface-border rounded-lg bg-surface-bg text-surface-on-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              >
                <option value="">Все породы</option>
                {speciesList.map(species => (
                  <option key={species} value={species}>{species}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-body font-medium text-surface-on-surface">Сортировка</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-surface-border rounded-lg bg-surface-bg text-surface-on-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              >
                <option value="date">По дате</option>
                <option value="species">По породе</option>
                <option value="volume">По объёму</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showSyncOnly}
                onChange={(e) => setShowSyncOnly(e.target.checked)}
                className="w-4 h-4 text-brand-primary border-surface-border rounded focus:ring-brand-primary/20"
              />
              <span className="text-body text-surface-on-surface">Только несинхронизированные</span>
            </label>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Экспорт данных
            </Button>
            
            <Button variant="outline" asChild>
              <label>
                <Upload className="w-4 h-4 mr-2" />
                Импорт данных
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </Button>

            <Button onClick={handleClearAll} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Очистить все
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Данные расчётов</span>
            <Badge variant="secondary">{filteredCalculations.length} записей</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-surface-on-variant" />
              <span className="ml-2 text-surface-on-variant">Загрузка данных...</span>
            </div>
          ) : filteredCalculations.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-12 h-12 mx-auto text-surface-on-variant mb-4" />
              <div className="text-body text-surface-on-variant">Нет данных для отображения</div>
              <div className="text-caption text-surface-on-variant mt-2">
                {calculations.length === 0 ? 'Создайте первый расчёт' : 'Попробуйте изменить фильтры'}
              </div>
            </div>
          ) : (
            <DataTable
              data={filteredCalculations}
              columns={columns}
              searchable={false}
              pagination={true}
              itemsPerPage={10}
              onRowClick={(row) => {
                // Handle row click - could show details modal
                console.log('Row clicked:', row);
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}