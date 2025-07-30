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
  Zap,
  Settings,
  Check
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
  const [showStandardPicker, setShowStandardPicker] = useState(false);
  const [showSpeciesPicker, setShowSpeciesPicker] = useState(false);

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

  const handleStandardSelect = (standardId: string) => {
    onStandardChange(standardId);
    setShowStandardPicker(false);
  };

  const handleSpeciesSelect = (speciesId: string) => {
    onSpeciesChange(speciesId);
    setShowSpeciesPicker(false);
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

  const getSelectedStandardName = () => {
    return standards.find(s => s.id === selectedStandard)?.name || 'Выберите стандарт';
  };

  const getSelectedSpeciesName = () => {
    return speciesList.find(s => s.id === selectedSpecies)?.name || 'Выберите породу';
  };

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

      {/* Settings Section */}
      <div className="ios-section-header">Настройки измерения</div>
      <div className="ios-list">
        {/* Standard Picker */}
        <button
          onClick={() => setShowStandardPicker(true)}
          className="ios-list-item"
          style={{ border: 'none', background: 'transparent', width: '100%' }}
        >
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#007AFF' }}
            >
              <FileText className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Стандарт измерения</div>
              <div className="ios-list-item-subtitle">
                {getSelectedStandardName()}
              </div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronDown className="w-5 h-5" style={{ color: 'var(--ios-tertiary-label)' }} />
          </div>
        </button>

        {/* Species Picker */}
        <button
          onClick={() => setShowSpeciesPicker(true)}
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
              <div className="ios-list-item-title">Порода древесины</div>
              <div className="ios-list-item-subtitle">
                {getSelectedSpeciesName()}
                {selectedSpecies && (
                  <span style={{ marginLeft: '8px', color: 'var(--ios-tertiary-label)' }}>
                    • {speciesList.find(s => s.id === selectedSpecies)?.density} г/см³
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronDown className="w-5 h-5" style={{ color: 'var(--ios-tertiary-label)' }} />
          </div>
        </button>
      </div>

      {/* Selected Configuration Summary */}
      {selectedStandard && selectedSpecies && (
        <>
          <div className="ios-section-header">Выбранная конфигурация</div>
          <div className="ios-list">
            <div className="ios-list-item">
              <div className="ios-list-item-content">
                <div 
                  className="ios-list-item-icon"
                  style={{ backgroundColor: '#34C759' }}
                >
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="ios-list-item-text">
                  <div className="ios-list-item-title">Готово к расчётам</div>
                  <div className="ios-list-item-subtitle">
                    {getSelectedStandardName()} • {getSelectedSpeciesName()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Standard Picker Modal */}
      {showStandardPicker && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'var(--ios-secondary-system-grouped-background)',
            borderRadius: '14px 14px 0 0',
            width: '100%',
            maxWidth: '428px',
            maxHeight: '70vh',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: 'var(--ios-spacing-md)',
              borderBottom: '0.5px solid var(--ios-separator)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '600' }}>Выберите стандарт</h3>
              <button
                onClick={() => setShowStandardPicker(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--ios-blue)',
                  fontSize: '17px',
                  cursor: 'pointer'
                }}
              >
                Готово
              </button>
            </div>
            <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
              {standards.map((standard) => (
                <button
                  key={standard.id}
                  onClick={() => handleStandardSelect(standard.id)}
                  className="ios-list-item"
                  style={{ 
                    border: 'none', 
                    background: 'transparent', 
                    width: '100%',
                    borderBottom: '0.5px solid var(--ios-separator)'
                  }}
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
                      <Check className="w-5 h-5" style={{ color: 'var(--ios-blue)' }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Species Picker Modal */}
      {showSpeciesPicker && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'var(--ios-secondary-system-grouped-background)',
            borderRadius: '14px 14px 0 0',
            width: '100%',
            maxWidth: '428px',
            maxHeight: '70vh',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: 'var(--ios-spacing-md)',
              borderBottom: '0.5px solid var(--ios-separator)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '600' }}>Выберите породу</h3>
              <button
                onClick={() => setShowSpeciesPicker(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--ios-blue)',
                  fontSize: '17px',
                  cursor: 'pointer'
                }}
              >
                Готово
              </button>
            </div>
            <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
              {/* Common Species Section */}
              <div style={{ 
                padding: '8px var(--ios-spacing-md) 4px var(--ios-spacing-md)',
                fontSize: '13px',
                fontWeight: '400',
                color: 'var(--ios-secondary-label)',
                textTransform: 'uppercase',
                letterSpacing: '-0.08px'
              }}>
                Часто используемые
              </div>
              {commonSpecies.map((species) => (
                <button
                  key={species.id}
                  onClick={() => handleSpeciesSelect(species.id)}
                  className="ios-list-item"
                  style={{ 
                    border: 'none', 
                    background: 'transparent', 
                    width: '100%',
                    borderBottom: '0.5px solid var(--ios-separator)'
                  }}
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
                      <Check className="w-5 h-5" style={{ color: 'var(--ios-blue)' }} />
                    </div>
                  )}
                </button>
              ))}

              {/* All Species Sections */}
              <div style={{ 
                padding: '16px var(--ios-spacing-md) 4px var(--ios-spacing-md)',
                fontSize: '13px',
                fontWeight: '400',
                color: 'var(--ios-secondary-label)',
                textTransform: 'uppercase',
                letterSpacing: '-0.08px'
              }}>
                Хвойн��е породы
              </div>
              {coniferousSpecies.map((species) => (
                <button
                  key={species.id}
                  onClick={() => handleSpeciesSelect(species.id)}
                  className="ios-list-item"
                  style={{ 
                    border: 'none', 
                    background: 'transparent', 
                    width: '100%',
                    borderBottom: '0.5px solid var(--ios-separator)'
                  }}
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
                      <Check className="w-5 h-5" style={{ color: 'var(--ios-blue)' }} />
                    </div>
                  )}
                </button>
              ))}

              <div style={{ 
                padding: '16px var(--ios-spacing-md) 4px var(--ios-spacing-md)',
                fontSize: '13px',
                fontWeight: '400',
                color: 'var(--ios-secondary-label)',
                textTransform: 'uppercase',
                letterSpacing: '-0.08px'
              }}>
                Лиственные породы
              </div>
              {deciduousSpecies.map((species) => (
                <button
                  key={species.id}
                  onClick={() => handleSpeciesSelect(species.id)}
                  className="ios-list-item"
                  style={{ 
                    border: 'none', 
                    background: 'transparent', 
                    width: '100%',
                    borderBottom: species === deciduousSpecies[deciduousSpecies.length - 1] ? 'none' : '0.5px solid var(--ios-separator)'
                  }}
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
                      <Check className="w-5 h-5" style={{ color: 'var(--ios-blue)' }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
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