import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  BarChart3, 
  TrendingUp, 
  TreePine, 
  Calendar, 
  MapPin,
  Target,
  Award,
  Activity,
  ChevronRight,
  Filter,
  BarChart,
  PieChart,
  LineChart,
  Download
} from 'lucide-react';
import { ChartContainer } from './ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line } from 'recharts';

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

export function Analytics() {
  const [calculations, setCalculations] = useState<CalculationData[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
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

  // Filter calculations based on time range
  const getFilteredCalculations = () => {
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return calculations.filter(calc => {
      const calcDate = new Date(calc.timestamp);
      const matchesTime = calcDate >= startDate;
      const matchesSpecies = selectedSpecies === 'all' || calc.species === selectedSpecies;
      return matchesTime && matchesSpecies;
    });
  };

  const filteredCalculations = getFilteredCalculations();

  // Calculate analytics
  const totalVolume = filteredCalculations.reduce((sum, calc) => sum + calc.volume, 0);
  const averageVolume = filteredCalculations.length > 0 ? totalVolume / filteredCalculations.length : 0;
  const totalLogs = filteredCalculations.length;

  // Species breakdown
  const speciesStats = filteredCalculations.reduce((acc, calc) => {
    acc[calc.species] = (acc[calc.species] || 0) + calc.volume;
    return acc;
  }, {} as Record<string, number>);

  const topSpecies = Object.entries(speciesStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Daily volume trend (last 7 days)
  const dailyVolume = filteredCalculations
    .filter(calc => {
      const calcDate = new Date(calc.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return calcDate >= weekAgo;
    })
    .reduce((acc, calc) => {
      const date = new Date(calc.timestamp).toLocaleDateString('ru-RU');
      acc[date] = (acc[date] || 0) + calc.volume;
      return acc;
    }, {} as Record<string, number>);

  const speciesList = [...new Set(calculations.map(calc => calc.species))];

  // Chart data preparation
  const speciesChartData = topSpecies.map(([species, volume]) => ({
    name: species,
    volume: parseFloat(volume.toFixed(2)),
    percentage: parseFloat(((volume / totalVolume) * 100).toFixed(1))
  }));

  const dailyChartData = Object.entries(dailyVolume).map(([date, volume]) => ({
    date,
    volume: parseFloat(volume.toFixed(2))
  }));

  const volumeByDiameterData = filteredCalculations.reduce((acc, calc) => {
    const diameterRange = `${Math.floor(calc.diameter / 5) * 5}-${Math.floor(calc.diameter / 5) * 5 + 4}`;
    acc[diameterRange] = (acc[diameterRange] || 0) + calc.volume;
    return acc;
  }, {} as Record<string, number>);

  const diameterChartData = Object.entries(volumeByDiameterData)
    .sort(([a], [b]) => parseInt(a.split('-')[0]) - parseInt(b.split('-')[0]))
    .map(([range, volume]) => ({
      range,
      volume: parseFloat(volume.toFixed(2))
    }));

  // Chart colors
  const chartColors = {
    primary: 'hsl(var(--brand-primary))',
    secondary: 'hsl(var(--brand-secondary))',
    success: 'hsl(var(--state-success))',
    warning: 'hsl(var(--state-warning))',
    error: 'hsl(var(--state-error))',
    species: [
      'hsl(var(--brand-primary))',
      'hsl(var(--brand-secondary))',
      'hsl(var(--state-success))',
      'hsl(var(--state-warning))',
      'hsl(var(--state-error))'
    ]
  };

  const handleExportAnalytics = () => {
    try {
      const analyticsData = {
        timeRange,
        selectedSpecies,
        totalVolume,
        averageVolume,
        totalLogs,
        speciesStats,
        dailyVolume,
        generatedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(analyticsData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `forestry-analytics-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting analytics:', error);
      alert('Ошибка экспорта аналитики');
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Аналитика лесозаготовок
            </span>
            <Button onClick={handleExportAnalytics} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Экспорт
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-body font-medium text-surface-on-surface">Период</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
                className="w-full px-4 py-2 border border-surface-border rounded-lg bg-surface-bg text-surface-on-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              >
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="year">Год</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-body font-medium text-surface-on-surface">Порода</label>
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="w-full px-4 py-2 border border-surface-border rounded-lg bg-surface-bg text-surface-on-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              >
                <option value="all">Все породы</option>
                {speciesList.map(species => (
                  <option key={species} value={species}>{species}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                <TreePine className="w-5 h-5 text-brand-on-primary" />
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
              <div className="w-10 h-10 rounded-full bg-state-success flex items-center justify-center">
                <BarChart className="w-5 h-5 text-state-on-success" />
              </div>
              <div>
                <div className="text-caption text-surface-on-variant">Средний объём</div>
                <div className="text-title font-title text-surface-on-surface">{averageVolume.toFixed(3)} м³</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center">
                <Activity className="w-5 h-5 text-brand-on-secondary" />
              </div>
              <div>
                <div className="text-caption text-surface-on-variant">Количество брёвен</div>
                <div className="text-title font-title text-surface-on-surface">{totalLogs}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Species Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Распределение по породам
            </CardTitle>
          </CardHeader>
          <CardContent>
            {speciesChartData.length > 0 ? (
              <ChartContainer
                config={{
                  species: {
                    label: "Породы",
                    color: chartColors.primary,
                  },
                }}
                className="h-[300px]"
              >
                <RechartsPieChart>
                  <Pie
                    data={speciesChartData}
                    dataKey="volume"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                  >
                    {speciesChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors.species[index % chartColors.species.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} м³`, 'Объём']} />
                </RechartsPieChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-surface-on-variant">
                Нет данных для отображения
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Volume Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Тренд объёма (7 дней)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyChartData.length > 0 ? (
              <ChartContainer
                config={{
                  volume: {
                    label: "Объём",
                    color: chartColors.success,
                  },
                }}
                className="h-[300px]"
              >
                <RechartsLineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} м³`, 'Объём']} />
                  <Line type="monotone" dataKey="volume" stroke={chartColors.success} strokeWidth={2} />
                </RechartsLineChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-surface-on-variant">
                Нет данных для отображения
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Volume by Diameter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Объём по диаметрам
          </CardTitle>
        </CardHeader>
        <CardContent>
          {diameterChartData.length > 0 ? (
            <ChartContainer
              config={{
                volume: {
                  label: "Объём",
                  color: chartColors.primary,
                },
              }}
              className="h-[300px]"
            >
              <RechartsBarChart data={diameterChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value} м³`, 'Объём']} />
                <Bar dataKey="volume" fill={chartColors.primary} />
              </RechartsBarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-surface-on-variant">
              Нет данных для отображения
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Species Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Топ пород по объёму
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topSpecies.map(([species, volume], index) => (
              <div key={species} className="flex items-center justify-between p-3 rounded-lg bg-surface-bg-variant">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{index + 1}</Badge>
                  <div className="flex items-center gap-2">
                    <TreePine className="w-4 h-4 text-brand-primary" />
                    <span className="font-medium">{species}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{volume.toFixed(3)} м³</div>
                  <div className="text-caption text-surface-on-variant">
                    {((volume / totalVolume) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Сводная статистика
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-surface-bg-variant">
              <div className="text-caption text-surface-on-variant">Период анализа</div>
              <div className="text-body font-medium text-surface-on-surface">
                {timeRange === 'week' ? 'Неделя' : timeRange === 'month' ? 'Месяц' : 'Год'}
              </div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-surface-bg-variant">
              <div className="text-caption text-surface-on-variant">Породы в анализе</div>
              <div className="text-body font-medium text-surface-on-surface">
                {selectedSpecies === 'all' ? speciesList.length : 1}
              </div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-surface-bg-variant">
              <div className="text-caption text-surface-on-variant">Средний диаметр</div>
              <div className="text-body font-medium text-surface-on-surface">
                {filteredCalculations.length > 0 
                  ? (filteredCalculations.reduce((sum, calc) => sum + calc.diameter, 0) / filteredCalculations.length).toFixed(1)
                  : '0'
                } см
              </div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-surface-bg-variant">
              <div className="text-caption text-surface-on-variant">Средняя длина</div>
              <div className="text-body font-medium text-surface-on-surface">
                {filteredCalculations.length > 0 
                  ? (filteredCalculations.reduce((sum, calc) => sum + calc.length, 0) / filteredCalculations.length).toFixed(1)
                  : '0'
                } м
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}