import { useState, useEffect } from 'react';
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
  AlertTriangle
} from 'lucide-react';

export function DataManagement() {
  const [calculations, setCalculations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showSyncOnly, setShowSyncOnly] = useState(false);

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

  // Filter and sort calculations
  const filteredCalculations = calculations
    .filter(calc => {
      const matchesSearch = calc.species.toLowerCase().includes(searchTerm.toLowerCase());
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

  return (
    <div>
      {/* Statistics */}
      <div className="ios-section-header">Статистика данных</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#007AFF' }}
            >
              <Database className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Всего записей</div>
              <div className="ios-list-item-subtitle">{calculations.length} расчётов</div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <div style={{ 
              color: '#007AFF', 
              fontSize: '17px', 
              fontWeight: '600'
            }}>
              {calculations.length}
            </div>
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#34C759' }}
            >
              <TreePine className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Общий объём</div>
              <div className="ios-list-item-subtitle">{totalVolume.toFixed(3)} м³</div>
            </div>
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: unsyncedCount > 0 ? '#FF9500' : '#34C759' }}
            >
              {unsyncedCount > 0 ? (
                <Clock className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Статус синхронизации</div>
              <div className="ios-list-item-subtitle">
                {unsyncedCount > 0 ? `${unsyncedCount} ожидает` : 'Все синхронизировано'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="ios-section-header">Поиск и фильтры</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#5856D6' }}
            >
              <Search className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text" style={{ flex: 1 }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск по породе..."
                style={{
                  width: '100%',
                  padding: '8px 0',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--ios-label)',
                  fontSize: '17px',
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
              <Filter className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Порода</div>
            </div>
          </div>
          <select
            value={filterSpecies}
            onChange={(e) => setFilterSpecies(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--ios-radius-md)',
              border: '1px solid var(--ios-separator)',
              background: 'var(--ios-secondary-system-grouped-background)',
              color: 'var(--ios-label)',
              fontSize: '17px'
            }}
          >
            <option value="">Все</option>
            {speciesList.map(species => (
              <option key={species} value={species}>{species}</option>
            ))}
          </select>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Только несинхронизированные</div>
            </div>
          </div>
          <button
            onClick={() => setShowSyncOnly(!showSyncOnly)}
            style={{
              width: '44px',
              height: '28px',
              borderRadius: '14px',
              border: 'none',
              background: showSyncOnly ? 'var(--ios-blue)' : 'var(--ios-system-fill)',
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
                left: showSyncOnly ? '18px' : '2px',
                transition: 'left 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
          </button>
        </div>
      </div>

      {/* Data Management Actions */}
      <div className="ios-section-header">Управление данными</div>
      <div className="ios-list">
        <button
          onClick={handleExport}
          className="ios-list-item"
          style={{ border: 'none', background: 'transparent', width: '100%' }}
        >
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#34C759' }}
            >
              <Download className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Экспорт данных</div>
              <div className="ios-list-item-subtitle">Сохранить данные в файл JSON</div>
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
              <Upload className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Импорт данных</div>
              <div className="ios-list-item-subtitle">Загрузить данные из файла</div>
            </div>
          </div>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
            id="file-import"
          />
          <label 
            htmlFor="file-import"
            className="ios-list-item-accessory"
            style={{ cursor: 'pointer' }}
          >
            <ChevronRight className="w-5 h-5" />
          </label>
        </div>

        <button
          onClick={handleClearAll}
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
                Удалить все данные
              </div>
              <div className="ios-list-item-subtitle">
                Необратимое действие
              </div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Data List */}
      {filteredCalculations.length > 0 && (
        <>
          <div className="ios-section-header">
            Данные ({filteredCalculations.length} из {calculations.length})
          </div>
          <div className="ios-list">
            {filteredCalculations.map((calc) => (
              <div key={calc.id} className="ios-list-item">
                <div className="ios-list-item-content">
                  <div 
                    className="ios-list-item-icon"
                    style={{ backgroundColor: calc.synced ? '#34C759' : '#FF9500' }}
                  >
                    {calc.synced ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="ios-list-item-text">
                    <div className="ios-list-item-title">
                      {calc.species} • {calc.volume.toFixed(3)} м³
                    </div>
                    <div className="ios-list-item-subtitle">
                      Ø{calc.diameter}см × {calc.length}м • {new Date(calc.timestamp).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(calc.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FF3B30',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: 'var(--ios-radius-md)'
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {filteredCalculations.length === 0 && calculations.length > 0 && (
        <>
          <div className="ios-section-header">Результаты поиска</div>
          <div className="ios-list">
            <div className="ios-list-item">
              <div className="ios-list-item-content">
                <div 
                  className="ios-list-item-icon"
                  style={{ backgroundColor: '#8E8E93' }}
                >
                  <Search className="w-4 h-4" />
                </div>
                <div className="ios-list-item-text">
                  <div className="ios-list-item-title">Ничего не найдено</div>
                  <div className="ios-list-item-subtitle">Попробуйте изменить параметры поиска</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {calculations.length === 0 && (
        <>
          <div className="ios-section-header">Нет данных</div>
          <div className="ios-list">
            <div className="ios-list-item">
              <div className="ios-list-item-content">
                <div 
                  className="ios-list-item-icon"
                  style={{ backgroundColor: '#8E8E93' }}
                >
                  <Database className="w-4 h-4" />
                </div>
                <div className="ios-list-item-text">
                  <div className="ios-list-item-title">Данные отсутствуют</div>
                  <div className="ios-list-item-subtitle">Выполните первый расчёт объёма</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}