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
  Settings,
  Star,
  AlertTriangle,
  Truck,
  Check,
  Table,
  Edit3,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { calculateLogVolume } from '../../utils/gost-calculations';

interface DiameterEntry {
  id: string;
  diameter: number;
  volume: number;
  quality?: string;
  timestamp?: string;
}

interface GroupedEntry {
  quality: string;
  diameter: number;
  count: number;
  totalVolume: number;
  entries: DiameterEntry[];
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
  const [selectedQuality, setSelectedQuality] = useState('1');
  const [showVolumeWarning, setShowVolumeWarning] = useState(false);
  const [batchCompleted, setBatchCompleted] = useState(false);
  const [showFullTable, setShowFullTable] = useState(false);
  const [showStandardDiameters, setShowStandardDiameters] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [currentDiameterCategory, setCurrentDiameterCategory] = useState<'small' | 'medium' | 'large'>('medium');
  const [isSliding, setIsSliding] = useState(false);
  const [slideStartX, setSlideStartX] = useState(0);

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
        volume: volume,
        quality: selectedQuality,
        timestamp: new Date().toISOString()
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
    const totalVolume = diameterEntries.reduce((total, entry) => total + entry.volume, 0);
    checkVolumeLimit(totalVolume);
    return totalVolume;
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

  // Diameter categories for sliding
  const diameterCategories = {
    small: { label: 'Мелкие', range: '6-14см', values: [6, 8, 10, 12, 14] },
    medium: { label: 'Средние', range: '16-28см', values: [16, 18, 20, 22, 24, 26, 28] },
    large: { label: 'Крупные', range: '30-50см', values: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50] }
  };
  
  // ISO 26 standard diameter classes for forestry measurements
  // Combined medium and large diameters as requested
  const iso26DiameterClasses = {
    small: { label: 'Мелкие (6-14см)', values: [6, 8, 10, 12, 14] },
    mediumLarge: { label: 'Средние и крупные (16-36см)', values: [16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36] },
    extraLarge: { label: 'Особо крупные (38-60см)', values: [38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60] }
  };

  // Handle category slide interactions
  const handleCategorySlideStart = (clientX: number) => {
    setIsSliding(true);
    setSlideStartX(clientX);
  };

  const handleCategorySlideMove = (clientX: number) => {
    if (!isSliding) return;
    
    const deltaX = clientX - slideStartX;
    const sensitivity = 80; // pixels per category step
    const steps = Math.round(deltaX / sensitivity);
    
    const categories = ['small', 'medium', 'large'] as const;
    const currentIndex = categories.indexOf(currentDiameterCategory);
    const newIndex = Math.max(0, Math.min(categories.length - 1, currentIndex - steps));
    
    if (newIndex !== currentIndex) {
      setCurrentDiameterCategory(categories[newIndex]);
      setSlideStartX(clientX); // Reset start position
    }
  };

  const handleCategorySlideEnd = () => {
    setIsSliding(false);
  };

  const getCurrentCategoryValues = () => diameterCategories[currentDiameterCategory].values;

  const [selectedDiameterClass, setSelectedDiameterClass] = useState<keyof typeof iso26DiameterClasses>('mediumLarge');

  // Quality grades for hot button selector
  const qualityGrades = [
    { value: '1', label: '1', description: 'Premium quality', color: '#34C759' },
    { value: '2', label: '2', description: 'Good quality', color: '#FF9500' },
    { value: '3', label: '3', description: 'Standard quality', color: '#FF3B30' }
  ];

  // Maximum volume warning (35m3 for trucks)
  const MAX_TRUCK_VOLUME = 35.0;

  // Check if volume exceeds limit
  const checkVolumeLimit = (totalVolume: number) => {
    if (totalVolume > MAX_TRUCK_VOLUME && !showVolumeWarning) {
      setShowVolumeWarning(true);
    } else if (totalVolume <= MAX_TRUCK_VOLUME && showVolumeWarning) {
      setShowVolumeWarning(false);
    }
  };

  // Prompt for new vehicle number
  const promptForNewVehicle = () => {
    const vehicleNumber = prompt('Введите номер нового транспортного средства:', '');
    if (vehicleNumber && vehicleNumber.trim()) {
      return vehicleNumber.trim();
    }
    return null;
  };

  // Complete batch function
  const completeBatch = () => {
    if (diameterEntries.length === 0) {
      alert('Добавьте диаметры перед завершением партии');
      return;
    }
    
    const vehicleNumber = promptForNewVehicle();
    if (vehicleNumber === null) return; // User cancelled
    
    setBatchCompleted(true);
    
    // Save the batch with new vehicle number
    onSave();
    
    alert(`Партия завершена!\nТранспорт: ${vehicleNumber}\nОбъём: ${getTotalVolume().toFixed(3)} м³\nКоличество: ${diameterEntries.length} брёвен`);
  };

  // Group entries by quality and diameter
  const getGroupedEntries = (): GroupedEntry[] => {
    const groups: { [key: string]: GroupedEntry } = {};
    
    diameterEntries.forEach(entry => {
      const quality = entry.quality || '1';
      const key = `${quality}-${entry.diameter}`;
      
      if (!groups[key]) {
        groups[key] = {
          quality,
          diameter: entry.diameter,
          count: 0,
          totalVolume: 0,
          entries: []
        };
      }
      
      groups[key].count += 1;
      groups[key].totalVolume += entry.volume;
      groups[key].entries.push(entry);
    });
    
    return Object.values(groups).sort((a, b) => {
      if (a.quality !== b.quality) return a.quality.localeCompare(b.quality);
      return a.diameter - b.diameter;
    });
  };

  // Update entry function
  const updateEntry = (entryId: string, newDiameter: number) => {
    const updatedEntries = diameterEntries.map(entry => {
      if (entry.id === entryId) {
        const newVolume = calculateLogVolume(newDiameter, parseFloat(length));
        return { ...entry, diameter: newDiameter, volume: newVolume };
      }
      return entry;
    });
    onDiameterEntriesChange(updatedEntries);
    setEditingEntry(null);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Fixed Summary Bar - Always Visible (iOS 16 Style) */}
      <div style={{
        position: 'fixed',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: 'calc(100% - 32px)',
        maxWidth: '390px',
        background: 'rgba(242, 242, 247, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: '16px',
        padding: '12px 16px',
        boxShadow: '0 1px 0 0 rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '0.33px solid rgba(0, 0, 0, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '14px',
            backgroundColor: '#007AFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CalculatorIcon className="w-4 h-4" style={{ color: 'white' }} />
          </div>
          <div>
            <div style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#1C1C1E',
              lineHeight: '1.33'
            }}>
              {diameterEntries.length > 0 ? `${getTotalVolume().toFixed(3)} м³` : 'Начните измерения'}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#8E8E93',
              lineHeight: '1.38'
            }}>
              {diameterEntries.length > 0 ? `${diameterEntries.length} брёвен` : 'Выберите диаметр для добавления'}
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '17px',
          fontWeight: '600',
          color: '#007AFF',
          fontVariantNumeric: 'tabular-nums',
          minWidth: '44px',
          textAlign: 'right'
        }}>
          {diameterEntries.length}
        </div>
      </div>

      {/* Content with fixed top padding for summary bar */}
      <div style={{ paddingTop: '80px' }}>

      {/* Quality Selector - iOS 16 Segmented Control */}
      <div className="ios-section-header">Качество</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#007AFF' }}
            >
              <Star className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Выбор качества</div>
            </div>
          </div>
          <div style={{
            background: '#F2F2F7',
            borderRadius: '10px',
            padding: '2px',
            display: 'flex',
            minWidth: '120px'
          }}>
            {qualityGrades.map((grade) => (
              <button
                key={grade.value}
                onClick={() => setSelectedQuality(grade.value)}
                style={{
                  background: selectedQuality === grade.value ? '#FFFFFF' : 'transparent',
                  color: selectedQuality === grade.value ? '#007AFF' : '#8E8E93',
                  fontSize: '15px',
                  fontWeight: '600',
                  padding: '8px 12px',
                  minHeight: '32px',
                  flex: '1',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedQuality === grade.value ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                {grade.label}
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Volume Warning */}
      {showVolumeWarning && (
        <div className="ios-list">
          <div className="ios-list-item" style={{ backgroundColor: '#FFE6E6', border: '1px solid #FF3B30' }}>
            <div className="ios-list-item-content">
              <div 
                className="ios-list-item-icon"
                style={{ backgroundColor: '#FF3B30' }}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="ios-list-item-text">
                <div className="ios-list-item-title" style={{ color: '#FF3B30', fontWeight: '600' }}>
                  Превышен максимальный объём!
                </div>
                <div className="ios-list-item-subtitle" style={{ color: '#FF3B30' }}>
                  Текущий объём: {getTotalVolume().toFixed(3)} м³ (макс. {MAX_TRUCK_VOLUME} м³ для грузовика)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diameter Selector Header - iOS 16 */}
      <div className="ios-section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 var(--ios-spacing-md)' }}>
          <span>Выбор диаметра</span>
          <button
            onClick={() => setShowStandardDiameters(!showStandardDiameters)}
            style={{
              background: 'none',
              border: 'none',
              color: '#007AFF',
              fontSize: '17px',
              fontWeight: '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 0'
            }}
          >
            {showStandardDiameters ? 'Скрыть' : 'Ещё'}
            {showStandardDiameters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Category Slider for Diameter Presets */}
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
              <div className="ios-list-item-title">Перетащите для смены категории</div>
              <div className="ios-list-item-subtitle">
                {diameterCategories[currentDiameterCategory].label} диаметры ({diameterCategories[currentDiameterCategory].range})
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ padding: '16px' }}>
          {/* Category Slider Track */}
          <div style={{
            position: 'relative',
            height: '60px',
            background: '#F2F2F7',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(0, 0, 0, 0.04)',
            marginBottom: '20px'
          }}>
            {/* Category Indicators */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px'
            }}>
              {Object.entries(diameterCategories).map(([key, category]) => {
                const isSelected = key === currentDiameterCategory;
                
                return (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    <div style={{
                      width: '6px',
                      height: isSelected ? '36px' : '20px',
                      background: isSelected ? '#007AFF' : '#C7C7CC',
                      borderRadius: '3px',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }} />
                    <div style={{
                      fontSize: isSelected ? '13px' : '11px',
                      fontWeight: isSelected ? '600' : '500',
                      color: isSelected ? '#007AFF' : '#8E8E93',
                      marginTop: '4px',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}>
                      {category.label}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Interactive Slide Area */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                cursor: isSliding ? 'grabbing' : 'grab',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'none'
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSlideStart(e.clientX);
              }}
              onMouseMove={(e) => {
                if (isSliding) {
                  e.preventDefault();
                  handleSlideMove(e.clientX);
                }
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                handleSlideEnd();
              }}
              onMouseLeave={(e) => {
                if (isSliding) {
                  e.preventDefault();
                  handleSlideEnd();
                }
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                handleSlideStart(touch.clientX);
              }}
              onTouchMove={(e) => {
                if (isSliding) {
                  e.preventDefault();
                  const touch = e.touches[0];
                  handleSlideMove(touch.clientX);
                }
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleSlideEnd();
              }}
            />
            
            {/* Selected Diameter Display */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: `translateX(-50%) scale(${isSliding ? 1.1 : 1})`,
              background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '20px',
              fontWeight: '700',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 122, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              {getCurrentDiameter()}см
            </div>
          </div>
          
          {/* Large Diameter Buttons Grid - Weather Resistant */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
            marginTop: '20px'
          }}>
            {diameterCategories[currentDiameterCategory].diameters.map((diameter) => (
              <button
                key={diameter}
                onClick={() => addDiameterEntry(diameter)}
                style={{
                  height: '72px', // Large touch target for harsh weather
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  touchAction: 'manipulation',
                  minWidth: '120px'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.95)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 122, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.95)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 122, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }}
                onTouchEnd={(e) => {
                  setTimeout(() => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  }, 100);
                }}
              >
                {diameter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Diameter Buttons */}
      {showStandardDiameters && (
        <div className="ios-list">
          <div style={{ padding: '12px var(--ios-spacing-md)' }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--ios-secondary-label)',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textAlign: 'center'
            }}>
              Дополнительные диаметры
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {[6, 8, 10, 52, 54, 56, 58, 60].map((diameter) => (
                <button
                  key={diameter}
                  onClick={() => addDiameterEntry(diameter)}
                  style={{
                    minHeight: '48px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #FF9500 0%, #E8890B 100%)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(255, 149, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(255, 149, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 149, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(255, 149, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 149, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 149, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {diameter}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manual Diameter Entry - iOS 16 Style */}
      <div className="ios-section-header">Ручной ввод</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#FF9500' }}
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
              style={{
                width: '44px',
                height: '44px',
                background: '#F2F2F7',
                color: '#007AFF',
                border: 'none',
                borderRadius: '22px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                transition: 'all 0.2s ease'
              }}
              onTouchStart={(e) => e.currentTarget.style.backgroundColor = '#E5E5EA'}
              onTouchEnd={(e) => e.currentTarget.style.backgroundColor = '#F2F2F7'}
              onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#E5E5EA'}
              onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#F2F2F7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F2F2F7'}
            >
              <Minus className="w-5 h-5" />
            </button>
            
            <input
              type="number"
              value={currentDiameter}
              onChange={(e) => onCurrentDiameterChange(e.target.value)}
              placeholder="0"
              style={{
                width: '80px',
                height: '44px',
                padding: '0 12px',
                borderRadius: '12px',
                border: '1px solid #C7C7CC',
                background: '#FFFFFF',
                color: '#1C1C1E',
                fontSize: '17px',
                fontWeight: '400',
                textAlign: 'center',
                outline: 'none'
              }}
            />
            
            <button
              onClick={() => adjustDiameter(1)}
              style={{
                width: '44px',
                height: '44px',
                background: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '22px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                transition: 'all 0.2s ease'
              }}
              onTouchStart={(e) => e.currentTarget.style.backgroundColor = '#0051D5'}
              onTouchEnd={(e) => e.currentTarget.style.backgroundColor = '#007AFF'}
              onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#0051D5'}
              onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#007AFF'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007AFF'}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Diameter Button - iOS 16 Style */}
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
              <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Записи ({diameterEntries.length})</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => setShowFullTable(!showFullTable)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--ios-blue)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {showFullTable ? <Eye className="w-3 h-3" /> : <Table className="w-3 h-3" />}
                  {showFullTable ? 'Группы' : 'Таблица'}
                </button>
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
          </div>
          <div className="ios-list">
            {!showFullTable ? (
              // Grouped View
              getGroupedEntries().map((group) => {
                const qualityGrade = qualityGrades.find(g => g.value === group.quality);
                return (
                  <div key={`${group.quality}-${group.diameter}`} className="ios-list-item" style={{ 
                    borderLeft: `4px solid ${qualityGrade?.color || '#34C759'}`,
                    backgroundColor: 'var(--ios-system-grouped-background)'
                  }}>
                    <div className="ios-list-item-content">
                      <div 
                        className="ios-list-item-icon"
                        style={{ 
                          backgroundColor: qualityGrade?.color || '#34C759',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}
                      >
                        <span style={{ color: 'white' }}>
                          {group.count}
                        </span>
                      </div>
                      <div className="ios-list-item-text">
                        <div className="ios-list-item-title" style={{ 
                          fontSize: '16px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word'
                        }}>
                          Ø{group.diameter}см × {length}м
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            color: 'var(--ios-secondary-label)',
                            backgroundColor: 'var(--ios-quaternary-system-fill)',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap'
                          }}>
                            Сорт {group.quality}
                          </span>
                        </div>
                        <div className="ios-list-item-subtitle" style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '14px',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word'
                        }}>
                          <span>Кол-во: {group.count} шт.</span>
                          <span>Объём: {group.totalVolume.toFixed(3)} м³</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Удалить все ${group.count} записей с диаметром ${group.diameter}см?`)) {
                          const filteredEntries = diameterEntries.filter(entry => 
                            !(entry.diameter === group.diameter && (entry.quality || '1') === group.quality)
                          );
                          onDiameterEntriesChange(filteredEntries);
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#FF3B30',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: 'var(--ios-radius-md)',
                        opacity: 0.7,
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              // Full Table View
              diameterEntries.slice(-20).reverse().map((entry, index) => {
                const actualIndex = diameterEntries.length - index;
                const qualityGrade = qualityGrades.find(g => g.value === entry.quality || '1');
                return (
                  <div key={entry.id} className="ios-list-item" style={{ 
                    borderLeft: `3px solid ${qualityGrade?.color || '#34C759'}`,
                    backgroundColor: index < 5 ? 'var(--ios-secondary-system-grouped-background)' : 'var(--ios-system-grouped-background)',
                    minHeight: '56px'
                  }}>
                    <div className="ios-list-item-content">
                      <div 
                        className="ios-list-item-icon"
                        style={{ 
                          backgroundColor: qualityGrade?.color || '#34C759',
                          fontSize: '10px',
                          fontWeight: '600',
                          width: '28px',
                          height: '28px'
                        }}
                      >
                        <span style={{ color: 'white' }}>
                          #{actualIndex}
                        </span>
                      </div>
                      <div className="ios-list-item-text" style={{ flex: 1 }}>
                        {editingEntry === entry.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="number"
                              defaultValue={entry.diameter}
                              style={{
                                width: '60px',
                                padding: '4px 8px',
                                borderRadius: 'var(--ios-radius-sm)',
                                border: '1px solid var(--ios-blue)',
                                background: 'var(--ios-secondary-system-grouped-background)',
                                fontSize: '14px'
                              }}
                              onBlur={(e) => {
                                const newDiameter = parseFloat(e.target.value);
                                if (newDiameter > 0) {
                                  updateEntry(entry.id, newDiameter);
                                } else {
                                  setEditingEntry(null);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newDiameter = parseFloat((e.target as HTMLInputElement).value);
                                  if (newDiameter > 0) {
                                    updateEntry(entry.id, newDiameter);
                                  }
                                } else if (e.key === 'Escape') {
                                  setEditingEntry(null);
                                }
                              }}
                              autoFocus
                            />
                            <span style={{ fontSize: '14px' }}>см × {length}м</span>
                          </div>
                        ) : (
                          <div className="ios-list-item-title" style={{ 
                            fontSize: '15px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word'
                          }}>
                            Ø{entry.diameter}см × {length}м
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '500',
                              color: 'var(--ios-secondary-label)',
                              backgroundColor: 'var(--ios-quaternary-system-fill)',
                              padding: '1px 4px',
                              borderRadius: '3px',
                              whiteSpace: 'nowrap'
                            }}>
                              С{entry.quality || '1'}
                            </span>
                          </div>
                        )}
                        <div className="ios-list-item-subtitle" style={{
                          fontSize: '13px',
                          color: 'var(--ios-secondary-label)',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word'
                        }}>
                          Объём: {entry.volume.toFixed(3)} м³
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        onClick={() => setEditingEntry(editingEntry === entry.id ? null : entry.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--ios-blue)',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: 'var(--ios-radius-sm)',
                          opacity: 0.7,
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeDiameterEntry(entry.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#FF3B30',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: 'var(--ios-radius-sm)',
                          opacity: 0.7,
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
            {showFullTable && diameterEntries.length > 20 && (
              <div className="ios-list-item" style={{ backgroundColor: '#F2F2F7' }}>
                <div className="ios-list-item-content">
                  <div 
                    className="ios-list-item-icon"
                    style={{ backgroundColor: '#8E8E93' }}
                  >
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="ios-list-item-text">
                    <div className="ios-list-item-title" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      ... и ещё {diameterEntries.length - 20} брёвен
                    </div>
                    <div className="ios-list-item-subtitle" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      Показаны последние 20 записей • Общий объём: {getTotalVolume().toFixed(3)} м³
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Batch Information - Moved to Bottom */}
          <div className="ios-section-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 var(--ios-spacing-md)' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Информация о партии</span>
            </div>
          </div>
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
                  <div className="ios-list-item-title" style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal'
                  }}>
                    {speciesNames[selectedSpecies]} • {length}м
                  </div>
                  <div className="ios-list-item-subtitle" style={{
                    fontSize: '14px',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal'
                  }}>
                    Стандарт: {selectedStandard}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="ios-section-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 var(--ios-spacing-md)' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Итоги</span>
            </div>
          </div>
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

          {/* Action Buttons - iOS 16 Style */}
          <div style={{ padding: 'var(--ios-spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--ios-spacing-md)' }}>
            <div style={{ display: 'flex', gap: 'var(--ios-spacing-md)' }}>
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
            <button
              onClick={completeBatch}
              className="ios-button"
              style={{ 
                background: '#FF9500',
                color: 'white',
                fontWeight: '600'
              }}
            >
              <Check className="w-5 h-5" style={{ marginRight: '8px' }} />
              Завершить партию и сменить транспорт
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

      </div> {/* Close content wrapper */}
    </div>
  );
}