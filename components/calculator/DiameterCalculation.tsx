import { useState } from 'react';
import { 
  Ruler, 
  Calculator as CalculatorIcon, 
  Save, 
  Trash2,
  TreePine,
  Plus,
  Minus,
  RotateCcw,
  CheckCircle,
  Target
} from 'lucide-react';
import { calculateLogVolume } from '../../utils/gost-calculations';

interface DiameterEntry {
  id: string;
  diameter: number;
  volume: number;
}

interface DiameterCalculationProps {
  length: string;
  selectedSpecies: string;
  selectedStandard: string;
  presetDiameters: number[];
  diameterEntries: DiameterEntry[];
  currentDiameter: string;
  onDiameterEntriesChange: (entries: DiameterEntry[]) => void;
  onCurrentDiameterChange: (diameter: string) => void;
  onSave: () => void;
  onBack: () => void;
}

export function DiameterCalculation({
  length,
  selectedSpecies,
  selectedStandard,
  presetDiameters,
  diameterEntries,
  currentDiameter,
  onDiameterEntriesChange,
  onCurrentDiameterChange,
  onSave,
  onBack
}: DiameterCalculationProps) {
  const [showPresets, setShowPresets] = useState(true);

  const speciesNames: Record<string, string> = {
    'pine': 'Сосна',
    'spruce': 'Ель',
    'larch': 'Лиственница',
    'fir': 'Пихта',
    'cedar': 'Кедр',
    'birch': 'Берёза',
    'aspen': 'Осина',
    'oak': 'Дуб',
    'beech': 'Бук',
    'ash': 'Ясень'
  };

  const addDiameterEntry = (diameter?: number) => {
    const d = diameter || parseFloat(currentDiameter);
    const l = parseFloat(length);
    
    if (d > 0 && l > 0) {
      const volume = calculateLogVolume(d, l);
      const newEntry: DiameterEntry = {
        id: Date.now().toString() + Math.random(),
        diameter: d,
        volume: volume
      };
      
      onDiameterEntriesChange([...diameterEntries, newEntry]);
      if (!diameter) {
        onCurrentDiameterChange('');
      }
    }
  };

  const removeDiameterEntry = (id: string) => {
    onDiameterEntriesChange(diameterEntries.filter(entry => entry.id !== id));
  };

  const clearAllEntries = () => {
    if (confirm('Очистить все введённые диаметры?')) {
      onDiameterEntriesChange([]);
    }
  };

  const getTotalVolume = () => {
    return diameterEntries.reduce((total, entry) => total + entry.volume, 0);
  };

  const getAverageDiameter = () => {
    if (diameterEntries.length === 0) return 0;
    const totalDiameter = diameterEntries.reduce((total, entry) => total + entry.diameter, 0);
    return totalDiameter / diameterEntries.length;
  };

  const adjustDiameter = (increment: number) => {
    const current = parseFloat(currentDiameter) || 0;
    const newValue = Math.max(0, current + increment);
    onCurrentDiameterChange(newValue.toString());
  };

  const standardPresets = [
    16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50
  ];

  const quickPresets = [20, 24, 28, 32, 36, 40];

  return (
    <div>
      {/* Summary Info */}
      <div className="ios-section-header">Информация о партии</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#34C759' }}
            >
              <TreePine className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">
                {speciesNames[selectedSpecies]} • {length}м
              </div>
              <div className="ios-list-item-subtitle">
                Стандарт: {selectedStandard}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Preset Diameters */}
      <div className="ios-section-header">Быстрый выбор диаметров</div>
      <div className="ios-list">
        <div style={{ padding: 'var(--ios-spacing-md)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {quickPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => addDiameterEntry(preset)}
              style={{
                background: 'var(--ios-blue)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 'var(--ios-radius-md)',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                minWidth: '60px'
              }}
            >
              {preset}см
            </button>
          ))}
        </div>
      </div>

      {/* Manual Diameter Entry */}
      <div className="ios-section-header">Ввод диаметра</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#007AFF' }}
            >
              <Ruler className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Диаметр (см)</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => adjustDiameter(-1)}
              className="ios-button"
              style={{ 
                width: '32px', 
                height: '32px', 
                padding: '0',
                background: 'var(--ios-quaternary-system-fill)',
                color: 'var(--ios-blue)',
                fontSize: '18px',
                borderRadius: '16px'
              }}
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={currentDiameter}
              onChange={(e) => onCurrentDiameterChange(e.target.value)}
              placeholder="0"
              style={{
                width: '80px',
                padding: '8px 12px',
                borderRadius: 'var(--ios-radius-md)',
                border: '1px solid var(--ios-separator)',
                background: 'var(--ios-secondary-system-grouped-background)',
                color: 'var(--ios-label)',
                fontSize: '17px',
                textAlign: 'left'
              }}
            />
            <button
              onClick={() => adjustDiameter(1)}
              className="ios-button"
              style={{ 
                width: '32px', 
                height: '32px', 
                padding: '0',
                background: 'var(--ios-blue)',
                color: 'white',
                fontSize: '18px',
                borderRadius: '16px'
              }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Diameter Button */}
      <div style={{ padding: '0 var(--ios-spacing-md)' }}>
        <button
          onClick={() => addDiameterEntry()}
          disabled={!currentDiameter || parseFloat(currentDiameter) <= 0}
          className="ios-button"
          style={{ 
            width: '100%',
            opacity: (!currentDiameter || parseFloat(currentDiameter) <= 0) ? 0.3 : 1
          }}
        >
          <Plus className="w-5 h-5" style={{ marginRight: '8px' }} />
          Добавить диаметр
        </button>
      </div>

      {/* All Preset Diameters */}
      <div className="ios-section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 var(--ios-spacing-md)' }}>
          <span>Стандартные диаметры</span>
          <button
            onClick={() => setShowPresets(!showPresets)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--ios-blue)',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {showPresets ? 'Скрыть' : 'Показать'}
          </button>
        </div>
      </div>
      {showPresets && (
        <div className="ios-list">
          <div style={{ padding: 'var(--ios-spacing-md)', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {standardPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => addDiameterEntry(preset)}
                style={{
                  background: 'var(--ios-quaternary-system-fill)',
                  color: 'var(--ios-blue)',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 'var(--ios-radius-md)',
                  fontSize: '15px',
                  cursor: 'pointer',
                  minWidth: '50px'
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Entries */}
      {diameterEntries.length > 0 && (
        <>
          <div className="ios-section-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 var(--ios-spacing-md)' }}>
              <span>Введённые диаметры ({diameterEntries.length})</span>
              <button
                onClick={clearAllEntries}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--ios-red)',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Очистить
              </button>
            </div>
          </div>
          <div className="ios-list">
            {diameterEntries.slice(-10).reverse().map((entry, index) => (
              <div key={entry.id} className="ios-list-item">
                <div className="ios-list-item-content">
                  <div 
                    className="ios-list-item-icon"
                    style={{ backgroundColor: '#34C759' }}
                  >
                    <span style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>
                      {diameterEntries.length - index}
                    </span>
                  </div>
                  <div className="ios-list-item-text">
                    <div className="ios-list-item-title">
                      Ø{entry.diameter}см × {length}м
                    </div>
                    <div className="ios-list-item-subtitle">
                      Объём: {entry.volume.toFixed(3)} м³
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeDiameterEntry(entry.id)}
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
            {diameterEntries.length > 10 && (
              <div className="ios-list-item">
                <div className="ios-list-item-content">
                  <div 
                    className="ios-list-item-icon"
                    style={{ backgroundColor: '#8E8E93' }}
                  >
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="ios-list-item-text">
                    <div className="ios-list-item-title">
                      ... и ещё {diameterEntries.length - 10} брёвен
                    </div>
                    <div className="ios-list-item-subtitle">
                      Показаны последние 10 записей
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subtotals and Totals */}
          <div className="ios-section-header">Итоговая информация</div>
          <div className="ios-list">
            <div className="ios-list-item">
              <div className="ios-list-item-content">
                <div 
                  className="ios-list-item-icon"
                  style={{ backgroundColor: '#007AFF' }}
                >
                  <Target className="w-4 h-4" />
                </div>
                <div className="ios-list-item-text">
                  <div className="ios-list-item-title">Количество брёвен</div>
                  <div className="ios-list-item-subtitle">Общее количество в партии</div>
                </div>
              </div>
              <div className="ios-list-item-accessory">
                <div style={{ 
                  color: '#007AFF', 
                  fontSize: '20px', 
                  fontWeight: '600'
                }}>
                  {diameterEntries.length}
                </div>
              </div>
            </div>

            <div className="ios-list-item">
              <div className="ios-list-item-content">
                <div 
                  className="ios-list-item-icon"
                  style={{ backgroundColor: '#FF9500' }}
                >
                  <Ruler className="w-4 h-4" />
                </div>
                <div className="ios-list-item-text">
                  <div className="ios-list-item-title">Средний диаметр</div>
                  <div className="ios-list-item-subtitle">Арифметическое среднее</div>
                </div>
              </div>
              <div className="ios-list-item-accessory">
                <div style={{ 
                  color: '#FF9500', 
                  fontSize: '17px', 
                  fontWeight: '600'
                }}>
                  {getAverageDiameter().toFixed(1)} см
                </div>
              </div>
            </div>

            <div className="ios-list-item">
              <div className="ios-list-item-content">
                <div 
                  className="ios-list-item-icon"
                  style={{ backgroundColor: '#34C759' }}
                >
                  <CalculatorIcon className="w-4 h-4" />
                </div>
                <div className="ios-list-item-text">
                  <div className="ios-list-item-title">Общий объём партии</div>
                  <div className="ios-list-item-subtitle">
                    {speciesNames[selectedSpecies]} • {selectedStandard}
                  </div>
                </div>
              </div>
              <div className="ios-list-item-accessory">
                <div style={{ 
                  color: '#34C759', 
                  fontSize: '24px', 
                  fontWeight: '700',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {getTotalVolume().toFixed(3)} м³
                </div>
              </div>
            </div>
          </div>

          {/* Save Batch Button */}
          <div style={{ padding: 'var(--ios-spacing-md)', display: 'flex', gap: 'var(--ios-spacing-md)' }}>
            <button
              onClick={onBack}
              className="ios-button ios-button-secondary"
              style={{ flex: 1 }}
            >
              Назад
            </button>
            <button
              onClick={onSave}
              className="ios-button"
              style={{ 
                flex: 2,
                background: 'var(--ios-green)'
              }}
            >
              <Save className="w-5 h-5" style={{ marginRight: '8px' }} />
              Сохранить партию ({diameterEntries.length})
            </button>
          </div>
        </>
      )}

      {/* Empty State */}
      {diameterEntries.length === 0 && (
        <>
          <div className="ios-section-header">Начните измерения</div>
          <div className="ios-list">
            <div className="ios-list-item">
              <div className="ios-list-item-content">
                <div 
                  className="ios-list-item-icon"
                  style={{ backgroundColor: '#8E8E93' }}
                >
                  <Target className="w-4 h-4" />
                </div>
                <div className="ios-list-item-text">
                  <div className="ios-list-item-title">Добавьте диаметры брёвен</div>
                  <div className="ios-list-item-subtitle">
                    Используйте быстрый выбор или введите значение вручную
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