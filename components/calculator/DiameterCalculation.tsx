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
  Target,
  Zap,
  Settings
} from 'lucide-react';
import { calculateLogVolume } from '../../utils/gost-calculations';

interface DiameterEntry {
  id: string;
  diameter: number;
  volume: number;
}

interface SavedSettings {
  selectedStandard: string;
  selectedSpecies: string;
  length: string;
  operator: string;
  coordinates: { lat: number; lng: number } | null;
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
  hasCompletedFirstCalculation?: boolean;
  onQuickRestart?: () => void;
  savedSettings?: SavedSettings | null;
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
  onBack,
  hasCompletedFirstCalculation = false,
  onQuickRestart,
  savedSettings
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

  // ISO 26 standard diameter classes for forestry measurements
  // Optimized for harsh field conditions with larger touch targets
  const iso26DiameterClasses = {
    small: { label: 'Мелкие (6-14см)', values: [6, 8, 10, 12, 14] },
    medium: { label: 'Средние (16-24см)', values: [16, 18, 20, 22, 24] },
    large: { label: 'Крупные (26-36см)', values: [26, 28, 30, 32, 34, 36] },
    extraLarge: { label: 'Особо крупные (38-60см)', values: [38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60] }
  };

  const [selectedDiameterClass, setSelectedDiameterClass] = useState<keyof typeof iso26DiameterClasses>('medium');

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

      {/* ISO 26 Standard Diameter Classes */}
      <div className="ios-section-header">Стандартные диаметры ISO 26</div>
      
      {/* Diameter Class Selector */}
      <div className="ios-list">
        <div style={{ padding: 'var(--ios-spacing-md)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.entries(iso26DiameterClasses).map(([key, classData]) => (
            <button
              key={key}
              onClick={() => setSelectedDiameterClass(key as keyof typeof iso26DiameterClasses)}
              className="calculator-button-secondary"
              style={{
                background: selectedDiameterClass === key ? 'var(--ios-blue)' : 'var(--ios-quaternary-system-fill)',
                color: selectedDiameterClass === key ? 'white' : 'var(--ios-blue)',
                fontSize: '14px',
                padding: '10px 14px',
                minHeight: '44px',
                flex: '1 1 calc(50% - 4px)',
                maxWidth: 'calc(50% - 4px)'
              }}
            >
              {classData.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Class Diameter Values */}
      <div className="ios-list">
        <div style={{ padding: 'var(--ios-spacing-md)' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', 
            gap: '12px' 
          }}>
            {iso26DiameterClasses[selectedDiameterClass].values.map((diameter) => (
              <button
                key={diameter}
                onClick={() => addDiameterEntry(diameter)}
                className="calculator-button-preset"
                style={{
                  minHeight: '56px',
                  fontSize: '18px',
                  fontWeight: '700',
                  borderRadius: 'var(--ios-radius-lg)',
                  boxShadow: '0 2px 8px rgba(0, 122, 255, 0.15)',
                  background: 'var(--ios-blue)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {diameter}
              </button>
            ))}
          </div>
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
              className="calculator-button-small"
              style={{ 
                background: 'var(--ios-quaternary-system-fill)',
                color: 'var(--ios-blue)',
                borderRadius: '20px'
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
                width: '90px',
                padding: '12px 16px',
                borderRadius: 'var(--ios-radius-lg)',
                border: '1px solid var(--ios-separator)',
                background: 'var(--ios-secondary-system-grouped-background)',
                color: 'var(--ios-label)',
                fontSize: '18px',
                fontWeight: '600',
                textAlign: 'center',
                fontFamily: 'var(--font-family)'
              }}
            />
            <button
              onClick={() => adjustDiameter(1)}
              className="calculator-button-small"
              style={{ 
                borderRadius: '20px'
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

      {/* Quick Restart Section - shown after completing first calculation */}
      {hasCompletedFirstCalculation && diameterEntries.length === 0 && savedSettings && onQuickRestart && (
        <>
          <div className="ios-section-header">Быстрый старт новой партии</div>
          <div className="ios-list">
            <div className="ios-list-item">
              <div className="ios-list-item-content">
                <div 
                  className="ios-list-item-icon"
                  style={{ backgroundColor: '#FF9500' }}
                >
                  <Zap className="w-4 h-4" />
                </div>
                <div className="ios-list-item-text">
                  <div className="ios-list-item-title">Сохранённые настройки</div>
                  <div className="ios-list-item-subtitle">
                    {speciesNames[savedSettings.selectedSpecies]} • {savedSettings.length}м • {savedSettings.selectedStandard}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: 'var(--ios-spacing-md)', display: 'flex', gap: 'var(--ios-spacing-md)' }}>
            <button
              onClick={onQuickRestart}
              className="calculator-button-large"
              style={{ 
                flex: 2,
                background: 'var(--ios-orange)',
                color: 'white'
              }}
            >
              <Zap className="w-5 h-5" style={{ marginRight: '8px' }} />
              Быстрый расчёт
            </button>
            <button
              onClick={onBack}
              className="calculator-button-secondary"
              style={{ flex: 1 }}
            >
              <Settings className="w-4 h-4" style={{ marginRight: '4px' }} />
              Настройки
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
                    Выберите стандартный диаметр или введите значение вручную
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