import { useState, useEffect } from 'react';
import { 
  TreePine, 
  FileText, 
  ChevronRight,
  CheckCircle,
  Info,
  Star,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';

interface StandardSpeciesSelectionProps {
  selectedStandard: string;
  selectedSpecies: string;
  onStandardChange: (standard: string) => void;
  onSpeciesChange: (species: string) => void;
  onNext: () => void;
}

export function StandardSpeciesSelection({
  selectedStandard,
  selectedSpecies,
  onStandardChange,
  onSpeciesChange,
  onNext
}: StandardSpeciesSelectionProps) {
  const [showAllSpecies, setShowAllSpecies] = useState(false);

  // Default standard and species for quick start
  const defaultStandard = 'GOST-2708-75';
  const defaultSpecies = 'pine';

  // Auto-select defaults on component mount if nothing is selected
  useEffect(() => {
    if (!selectedStandard) {
      onStandardChange(defaultStandard);
    }
    if (!selectedSpecies) {
      onSpeciesChange(defaultSpecies);
    }
  }, [selectedStandard, selectedSpecies, onStandardChange, onSpeciesChange]);

  const handleQuickStart = () => {
    onStandardChange(defaultStandard);
    onSpeciesChange(defaultSpecies);
    onNext();
  };

  const standards = [
    {
      id: 'GOST-2708-75',
      name: 'ГОСТ 2708-75',
      description: 'Российский стандарт для круглых лесоматериалов',
      official: true
    },
    {
      id: 'GOST-2292-88',
      name: 'ГОСТ 2292-88',
      description: 'Лесоматериалы круглые. Маркировка, сортировка',
      official: true
    },
    {
      id: 'ISO-4480',
      name: 'ISO 4480',
      description: 'Международный стандарт измерения древесины',
      official: false
    },
    {
      id: 'EN-1309',
      name: 'EN 1309',
      description: 'Европейский стандарт круглых лесоматериалов',
      official: false
    }
  ];

  const speciesList = [
    { id: 'pine', name: 'Сосна', density: 0.52, category: 'Хвойные' },
    { id: 'spruce', name: 'Ель', density: 0.45, category: 'Хвойные' },
    { id: 'larch', name: 'Лиственница', density: 0.66, category: 'Хвойные' },
    { id: 'fir', name: 'Пихта', density: 0.39, category: 'Хвойные' },
    { id: 'cedar', name: 'Кедр', density: 0.44, category: 'Хвойные' },
    { id: 'birch', name: 'Берёза', density: 0.65, category: 'Лиственные' },
    { id: 'aspen', name: 'Осина', density: 0.51, category: 'Лиственные' },
    { id: 'oak', name: 'Дуб', density: 0.81, category: 'Лиственные' },
    { id: 'beech', name: 'Бук', density: 0.72, category: 'Лиственные' },
    { id: 'ash', name: 'Ясень', density: 0.75, category: 'Лиственные' }
  ];

  const coniferousSpecies = speciesList.filter(s => s.category === 'Хвойные');
  const deciduousSpecies = speciesList.filter(s => s.category === 'Лиственные');

  const canProceed = selectedStandard && selectedSpecies;

  // Most common species for quick selection
  const commonSpecies = [
    { id: 'pine', name: 'Сосна', density: 0.52, category: 'Хвойные', icon: '🌲', description: 'Самая распространённая' },
    { id: 'spruce', name: 'Ель', density: 0.45, category: 'Хвойные', icon: '🌲', description: 'Строительная древесина' },
    { id: 'birch', name: 'Берёза', density: 0.65, category: 'Лиственные', icon: '🌳', description: 'Твёрдая древесина' },
    { id: 'larch', name: 'Лиственница', density: 0.66, category: 'Хвойные', icon: '🌲', description: 'Высокая плотность' }
  ];

  return (
    <div>
      {/* Quick Start Section */}
      <div className="ios-section-header">Быстрый старт</div>
      <div className="ios-list">
        <button
          onClick={handleQuickStart}
          className="ios-list-item"
          style={{ border: 'none', background: 'transparent', width: '100%' }}
        >
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#FF9500' }}
            >
              <Zap className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Начать с настройками по умолчанию</div>
              <div className="ios-list-item-subtitle">
                ГОСТ 2708-75 • Сосна • Быстрый переход к расчётам
              </div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--ios-tertiary-label)' }} />
          </div>
        </button>
      </div>

      {/* Common Species */}
      <div className="ios-section-header">Часто используемые породы</div>
      <div className="ios-list">
        {commonSpecies.map((species) => (
          <button
            key={species.id}
            onClick={() => onSpeciesChange(species.id)}
            className="ios-list-item"
            style={{ border: 'none', background: 'transparent', width: '100%' }}
          >
            <div className="ios-list-item-content">
              <div 
                className="ios-list-item-icon"
                style={{ 
                  backgroundColor: species.category === 'Хвойные' ? '#34C759' : '#FF9500',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {species.icon}
              </div>
              <div className="ios-list-item-text">
                <div className="ios-list-item-title">
                  {species.name}
                  {species.id === defaultSpecies && (
                    <Star className="w-4 h-4" style={{ 
                      color: '#FFD60A', 
                      marginLeft: '8px', 
                      display: 'inline' 
                    }} />
                  )}
                </div>
                <div className="ios-list-item-subtitle">
                  {species.description} • {species.density} г/см³
                </div>
              </div>
            </div>
            {selectedSpecies === species.id && (
              <div className="ios-list-item-accessory">
                <div style={{ color: '#007AFF', fontSize: '17px', fontWeight: '600' }}>✓</div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Show All Species Toggle */}
      <div style={{ padding: 'var(--ios-spacing-md)' }}>
        <button
          onClick={() => setShowAllSpecies(!showAllSpecies)}
          className="ios-button ios-button-secondary"
          style={{ width: '100%' }}
        >
          <span style={{ marginRight: '8px' }}>
            {showAllSpecies ? 'Скрыть все породы' : 'Показать все породы'}
          </span>
          {showAllSpecies ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* All Species (Collapsible) */}
      {showAllSpecies && (
        <>
          {/* Measuring Standards */}
          <div className="ios-section-header">Стандарт измерения</div>
      <div className="ios-list">
        {standards.map((standard) => (
          <button
            key={standard.id}
            onClick={() => onStandardChange(standard.id)}
            className="ios-list-item"
            style={{ border: 'none', background: 'transparent', width: '100%' }}
          >
            <div className="ios-list-item-content">
              <div 
                className="ios-list-item-icon"
                style={{ backgroundColor: standard.official ? '#007AFF' : '#5856D6' }}
              >
                <FileText className="w-4 h-4" />
              </div>
              <div className="ios-list-item-text">
                <div className="ios-list-item-title">{standard.name}</div>
                <div className="ios-list-item-subtitle">{standard.description}</div>
              </div>
            </div>
            {selectedStandard === standard.id && (
              <div className="ios-list-item-accessory">
                <div style={{ color: '#007AFF', fontSize: '17px', fontWeight: '600' }}>✓</div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Standard Info */}
      {selectedStandard && (
        <>
          <div className="ios-section-header">Информация о стандарте</div>
          <div className="ios-list">
            <div className="ios-list-item">
              <div className="ios-list-item-content">
                <div 
                  className="ios-list-item-icon"
                  style={{ backgroundColor: '#34C759' }}
                >
                  <Info className="w-4 h-4" />
                </div>
                <div className="ios-list-item-text">
                  <div className="ios-list-item-title">
                    {standards.find(s => s.id === selectedStandard)?.name}
                  </div>
                  <div className="ios-list-item-subtitle">
                    {selectedStandard === 'GOST-2708-75' && 
                      'Точность расчёта: ±2%. Применим для диаметров 6-120 см'
                    }
                    {selectedStandard === 'GOST-2292-88' && 
                      'Учитывает сортность и маркировку. Расширенная классификация'
                    }
                    {selectedStandard === 'ISO-4480' && 
                      'Международные требования. Метрическая система'
                    }
                    {selectedStandard === 'EN-1309' && 
                      'Европейские стандарты качества и измерения'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Coniferous Species */}
      <div className="ios-section-header">Хвойные породы</div>
      <div className="ios-list">
        {coniferousSpecies.map((species) => (
          <button
            key={species.id}
            onClick={() => onSpeciesChange(species.id)}
            className="ios-list-item"
            style={{ border: 'none', background: 'transparent', width: '100%' }}
          >
            <div className="ios-list-item-content">
              <div 
                className="ios-list-item-icon"
                style={{ backgroundColor: '#34C759' }}
              >
                <TreePine className="w-4 h-4" />
              </div>
              <div className="ios-list-item-text">
                <div className="ios-list-item-title">{species.name}</div>
                <div className="ios-list-item-subtitle">
                  Плотность: {species.density} г/см³
                </div>
              </div>
            </div>
            {selectedSpecies === species.id && (
              <div className="ios-list-item-accessory">
                <div style={{ color: '#007AFF', fontSize: '17px', fontWeight: '600' }}>✓</div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Deciduous Species */}
      <div className="ios-section-header">Лиственные породы</div>
      <div className="ios-list">
        {deciduousSpecies.map((species) => (
          <button
            key={species.id}
            onClick={() => onSpeciesChange(species.id)}
            className="ios-list-item"
            style={{ border: 'none', background: 'transparent', width: '100%' }}
          >
            <div className="ios-list-item-content">
              <div 
                className="ios-list-item-icon"
                style={{ backgroundColor: '#FF9500' }}
              >
                <TreePine className="w-4 h-4" />
              </div>
              <div className="ios-list-item-text">
                <div className="ios-list-item-title">{species.name}</div>
                <div className="ios-list-item-subtitle">
                  Плотность: {species.density} г/см³
                </div>
              </div>
            </div>
            {selectedSpecies === species.id && (
              <div className="ios-list-item-accessory">
                <div style={{ color: '#007AFF', fontSize: '17px', fontWeight: '600' }}>✓</div>
              </div>
            )}
          </button>
        ))}
      </div>
        </>
      )}

      {/* Continue Button */}
      <div style={{ padding: 'var(--ios-spacing-md)' }}>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="ios-button"
          style={{ 
            width: '100%',
            opacity: !canProceed ? 0.3 : 1
          }}
        >
          <span style={{ marginRight: '8px' }}>Продолжить</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}