import { useState, useEffect } from 'react';
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
  Filter
} from 'lucide-react';

export function Analytics() {
  const [calculations, setCalculations] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');

  // Load calculations on component mount
  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = () => {
    try {
      const saved = localStorage.getItem('forestry-calculations');
      if (saved) {
        setCalculations(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading calculations:', error);
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

  // Grade breakdown
  const gradeStats = filteredCalculations.reduce((acc, calc) => {
    const grade = calc.grade || 1;
    acc[grade] = (acc[grade] || 0) + calc.volume;
    return acc;
  }, {} as Record<number, number>);

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

  const getGradeLabel = (grade: number) => {
    switch (grade) {
      case 1: return '1 сорт';
      case 2: return '2 сорт';
      case 3: return '3 сорт';
      default: return `${grade} сорт`;
    }
  };

  const getGradeColor = (grade: number) => {
    switch (grade) {
      case 1: return 'var(--ios-green)';
      case 2: return 'var(--ios-orange)';
      case 3: return 'var(--ios-red)';
      default: return 'var(--ios-gray)';
    }
  };

  const getSpeciesColor = (index: number) => {
  const colors = ['var(--ios-blue)', 'var(--ios-green)', 'var(--ios-orange)', 'var(--ios-purple)', 'var(--ios-teal)'];
    return colors[index % colors.length];
  };

  return (
    <div>
      {/* Time Range Filter */}
      <div className="ios-section-header">Период анализа</div>
      <div className="ios-list">
        {[
          { value: 'week', label: 'Неделя', subtitle: '7 дней' },
          { value: 'month', label: 'Месяц', subtitle: '30 дней' },
          { value: 'year', label: 'Год', subtitle: '365 дней' }
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeRange(option.value as any)}
            className="ios-list-item"
            style={{ border: 'none', background: 'transparent', width: '100%' }}
          >
            <div className="ios-list-item-content">
              <div 
                className="ios-list-item-icon"
                style={{ backgroundColor: 'var(--ios-blue)' }}
              >
                <Calendar className="w-4 h-4" />
              </div>
              <div className="ios-list-item-text">
                <div className="ios-list-item-title">{option.label}</div>
                <div className="ios-list-item-subtitle">{option.subtitle}</div>
              </div>
            </div>
            {timeRange === option.value && (
              <div className="ios-list-item-accessory">
                <div style={{ color: 'var(--ios-blue)', fontSize: '17px', fontWeight: '600' }}>✓</div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Species Filter */}
      <div className="ios-section-header">Фильтр по породе</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: 'var(--ios-indigo)' }}
            >
              <Filter className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Порода древесины</div>
            </div>
          </div>
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--ios-radius-md)',
              border: '1px solid var(--ios-separator)',
              background: 'var(--ios-secondary-system-grouped-background)',
              color: 'var(--ios-label)',
              fontSize: '17px'
            }}
          >
            <option value="all">Все породы</option>
            {speciesList.map(species => (
              <option key={species} value={species}>{species}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="ios-section-header">Ключевые показатели</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: 'var(--ios-green)' }}
            >
              <TreePine className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Общий объём</div>
              <div className="ios-list-item-subtitle">Кубических метров за период</div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <div style={{ 
              color: 'var(--ios-green)', 
              fontSize: '20px', 
              fontWeight: '600',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {totalVolume.toFixed(2)} м³
            </div>
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: 'var(--ios-blue)' }}
            >
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Средний объём</div>
              <div className="ios-list-item-subtitle">На один бревно</div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <div style={{ 
              color: 'var(--ios-blue)', 
              fontSize: '17px', 
              fontWeight: '600',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {averageVolume.toFixed(3)} м³
            </div>
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: 'var(--ios-orange)' }}
            >
              <Target className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Количество бревен</div>
              <div className="ios-list-item-subtitle">Измерено за период</div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <div style={{ 
              color: 'var(--ios-orange)', 
              fontSize: '17px', 
              fontWeight: '600'
            }}>
              {totalLogs}
            </div>
          </div>
        </div>
      </div>

      {/* Species Breakdown */}
      {topSpecies.length > 0 && (
        <>
          <div className="ios-section-header">Породы древесины</div>
          <div className="ios-list">
            {topSpecies.map(([species, volume], index) => (
              <div key={species} className="ios-list-item">
                <div className="ios-list-item-content">
                  <div 
                    className="ios-list-item-icon"
                    style={{ backgroundColor: getSpeciesColor(index) }}
                  >
                    <TreePine className="w-4 h-4" />
                  </div>
                  <div className="ios-list-item-text">
                    <div className="ios-list-item-title">{species}</div>
                    <div className="ios-list-item-subtitle">
                      {((volume / totalVolume) * 100).toFixed(1)}% от общего объёма
                    </div>
                  </div>
                </div>
                <div className="ios-list-item-accessory">
                  <div style={{ 
                    color: getSpeciesColor(index), 
                    fontSize: '17px', 
                    fontWeight: '600',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {volume.toFixed(2)} м³
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Grade Analysis */}
      {Object.keys(gradeStats).length > 0 && (
        <>
          <div className="ios-section-header">Сорта древесины</div>
          <div className="ios-list">
            {Object.entries(gradeStats)
              .sort(([,a], [,b]) => b - a)
              .map(([grade, volume]) => (
                <div key={grade} className="ios-list-item">
                  <div className="ios-list-item-content">
                    <div 
                      className="ios-list-item-icon"
                      style={{ backgroundColor: getGradeColor(Number(grade)) }}
                    >
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="ios-list-item-text">
                      <div className="ios-list-item-title">{getGradeLabel(Number(grade))}</div>
                      <div className="ios-list-item-subtitle">
                        {((volume / totalVolume) * 100).toFixed(1)}% от общего объёма
                      </div>
                    </div>
                  </div>
                  <div className="ios-list-item-accessory">
                    <div style={{ 
                      color: getGradeColor(Number(grade)), 
                      fontSize: '17px', 
                      fontWeight: '600',
                      fontVariantNumeric: 'tabular-nums'
                    }}>
                      {volume.toFixed(2)} м³
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {/* Daily Activity */}
      {Object.keys(dailyVolume).length > 0 && (
        <>
          <div className="ios-section-header">Активность по дням</div>
          <div className="ios-list">
            {Object.entries(dailyVolume)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, volume]) => (
                <div key={date} className="ios-list-item">
                  <div className="ios-list-item-content">
                    <div 
                      className="ios-list-item-icon"
                      style={{ backgroundColor: 'var(--ios-teal)' }}
                    >
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="ios-list-item-text">
                      <div className="ios-list-item-title">{date}</div>
                      <div className="ios-list-item-subtitle">Измерено в этот день</div>
                    </div>
                  </div>
                  <div className="ios-list-item-accessory">
                    <div style={{ 
                      color: 'var(--ios-teal)', 
                      fontSize: '17px', 
                      fontWeight: '600',
                      fontVariantNumeric: 'tabular-nums'
                    }}>
                      {volume.toFixed(2)} м³
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {/* Performance Insights */}
      <div className="ios-section-header">Аналитические выводы</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: 'var(--ios-purple)' }}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Производительность</div>
              <div className="ios-list-item-subtitle">
                {totalLogs > 0 
                  ? `${(totalVolume / totalLogs).toFixed(3)} м³ на бревно в среднем`
                  : 'Нет данных для анализа'
                }
              </div>
            </div>
          </div>
        </div>

        {topSpecies.length > 0 && (
          <div className="ios-list-item">
            <div className="ios-list-item-content">
              <div 
                className="ios-list-item-icon"
                style={{ backgroundColor: 'var(--ios-green)' }}
              >
                <Award className="w-4 h-4" />
              </div>
              <div className="ios-list-item-text">
                <div className="ios-list-item-title">Основная порода</div>
                <div className="ios-list-item-subtitle">
                  {topSpecies[0][0]} составляет {((topSpecies[0][1] / totalVolume) * 100).toFixed(1)}% объёма
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* No Data State */}
      {filteredCalculations.length === 0 && (
        <>
          <div className="ios-section-header">Нет данных</div>
          <div className="ios-list">
            <div className="ios-list-item">
              <div className="ios-list-item-content">
                <div 
                  className="ios-list-item-icon"
                  style={{ backgroundColor: 'var(--ios-gray)' }}
                >
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="ios-list-item-text">
                  <div className="ios-list-item-title">Данные отсутствуют</div>
                  <div className="ios-list-item-subtitle">
                    Выполните расчёты для получения аналитики
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
