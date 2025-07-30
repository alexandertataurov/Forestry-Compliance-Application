import { useState, useEffect } from 'react';
import { StandardSpeciesSelection } from './calculator/StandardSpeciesSelection';
import { BatchConfiguration } from './calculator/BatchConfiguration';
import { DiameterCalculation } from './calculator/DiameterCalculation';

interface DiameterEntry {
  id: string;
  diameter: number;
  volume: number;
}

interface CalculatorState {
  currentScreen: 'standard' | 'batch' | 'calculation';
  selectedStandard: string;
  selectedSpecies: string;
  length: string;
  location: {
    coordinates: { lat: number; lng: number } | null;
    address: string;
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
  diameterEntries: DiameterEntry[];
  currentDiameter: string;
  hasCompletedFirstCalculation: boolean;
}

interface SavedSettings {
  selectedStandard: string;
  selectedSpecies: string;
  length: string;
  operator: string;
  coordinates: { lat: number; lng: number } | null;
}

export function VolumeCalculator() {
  const [state, setState] = useState<CalculatorState>({
    currentScreen: 'standard',
    selectedStandard: '',
    selectedSpecies: '',
    length: '',
    location: {
      coordinates: null,
      address: '',
      forest: '',
      plot: ''
    },
    transport: {
      type: '',
      plateNumber: '',
      driverName: ''
    },
    batch: {
      number: '',
      date: '',
      operator: ''
    },
    documents: [],
    diameterEntries: [],
    currentDiameter: '',
    hasCompletedFirstCalculation: false
  });

  const [calculations, setCalculations] = useState<any[]>([]);
  const [savedSettings, setSavedSettings] = useState<SavedSettings | null>(null);

  // Load saved calculations and settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem('forestry-calculations');
      if (saved) {
        setCalculations(JSON.parse(saved));
      }

      // Load saved settings for quick restart
      const settings = localStorage.getItem('forestry-calculator-settings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setSavedSettings(parsedSettings);
        
        // Auto-populate with saved settings if available
        setState(prev => ({
          ...prev,
          selectedStandard: parsedSettings.selectedStandard || '',
          selectedSpecies: parsedSettings.selectedSpecies || '',
          length: parsedSettings.length || '',
          batch: {
            ...prev.batch,
            operator: parsedSettings.operator || ''
          },
          location: {
            ...prev.location,
            coordinates: parsedSettings.coordinates || null
          },
          hasCompletedFirstCalculation: true
        }));
      }
    } catch (error) {
      console.error('Error loading calculations:', error);
    }
  }, []);

  const updateState = (updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleStandardChange = (standard: string) => {
    updateState({ selectedStandard: standard });
  };

  const handleSpeciesChange = (species: string) => {
    updateState({ selectedSpecies: species });
  };

  const handleLengthChange = (length: string) => {
    updateState({ length });
  };

  const handleLocationChange = (location: any) => {
    updateState({ location });
  };

  const handleTransportChange = (transport: any) => {
    updateState({ transport });
  };

  const handleBatchChange = (batch: any) => {
    updateState({ batch });
  };

  const handleDocumentsChange = (documents: string[]) => {
    updateState({ documents });
  };

  const handleDiameterEntriesChange = (diameterEntries: DiameterEntry[]) => {
    updateState({ diameterEntries });
  };

  const handleCurrentDiameterChange = (currentDiameter: string) => {
    updateState({ currentDiameter });
  };

  const navigateToScreen = (screen: 'standard' | 'batch' | 'calculation') => {
    updateState({ currentScreen: screen });
  };

  const saveCurrentSettings = () => {
    const settingsToSave: SavedSettings = {
      selectedStandard: state.selectedStandard,
      selectedSpecies: state.selectedSpecies,
      length: state.length,
      operator: state.batch.operator,
      coordinates: state.location.coordinates
    };
    
    localStorage.setItem('forestry-calculator-settings', JSON.stringify(settingsToSave));
    setSavedSettings(settingsToSave);
  };

  const startQuickCalculation = () => {
    if (!savedSettings) return;
    
    // Generate new batch number
    const newBatchNumber = `B${Date.now().toString().slice(-6)}`;
    
    setState({
      currentScreen: 'calculation',
      selectedStandard: savedSettings.selectedStandard,
      selectedSpecies: savedSettings.selectedSpecies,
      length: savedSettings.length,
      location: {
        coordinates: savedSettings.coordinates,
        address: '',
        forest: '',
        plot: ''
      },
      transport: {
        type: '',
        plateNumber: '',
        driverName: ''
      },
      batch: {
        number: newBatchNumber,
        date: new Date().toISOString().split('T')[0],
        operator: savedSettings.operator
      },
      documents: [],
      diameterEntries: [],
      currentDiameter: '',
      hasCompletedFirstCalculation: true
    });
  };

  const handleSaveBatch = () => {
    if (state.diameterEntries.length === 0 || !state.length) {
      alert('Добавьте диаметры для сохранения');
      return;
    }

    const batchCalculations = state.diameterEntries.map(entry => ({
      id: Date.now() + Math.random(),
      diameter: entry.diameter,
      length: parseFloat(state.length),
      species: state.selectedSpecies,
      standard: state.selectedStandard,
      volume: entry.volume,
      timestamp: new Date().toISOString(),
      coordinates: state.location.coordinates,
      location: {
        forest: state.location.forest,
        plot: state.location.plot
      },
      transport: state.transport,
      batch: state.batch,
      documents: state.documents,
      synced: false
    }));

    const updatedCalculations = [...batchCalculations, ...calculations];
    setCalculations(updatedCalculations);
    
    try {
      localStorage.setItem('forestry-calculations', JSON.stringify(updatedCalculations));
      
      // Also save to batches for sync
      const batches = JSON.parse(localStorage.getItem('forestry-batches') || '[]');
      batches.push(...batchCalculations);
      localStorage.setItem('forestry-batches', JSON.stringify(batches));
      
      // Save settings for quick restart if this is the first calculation
      if (!state.hasCompletedFirstCalculation) {
        saveCurrentSettings();
      }
      
      alert(`Сохранена партия из ${batchCalculations.length} брёвен`);
      
      // Show quick restart option or reset to first screen
      updateState({ 
        hasCompletedFirstCalculation: true,
        diameterEntries: [],
        currentDiameter: ''
      });
      
    } catch (error) {
      console.error('Error saving calculations:', error);
      alert('Ошибка сохранения');
    }
  };

  // Preset diameters for quick selection
  const presetDiameters = [16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50];

  return (
    <div>
      {state.currentScreen === 'standard' && (
        <StandardSpeciesSelection
          selectedStandard={state.selectedStandard}
          selectedSpecies={state.selectedSpecies}
          onStandardChange={handleStandardChange}
          onSpeciesChange={handleSpeciesChange}
          onNext={() => navigateToScreen('batch')}
        />
      )}

      {state.currentScreen === 'batch' && (
        <BatchConfiguration
          length={state.length}
          location={state.location}
          transport={state.transport}
          batch={state.batch}
          documents={state.documents}
          onLengthChange={handleLengthChange}
          onLocationChange={handleLocationChange}
          onTransportChange={handleTransportChange}
          onBatchChange={handleBatchChange}
          onDocumentsChange={handleDocumentsChange}
          onNext={() => navigateToScreen('calculation')}
          onBack={() => navigateToScreen('standard')}
        />
      )}

      {state.currentScreen === 'calculation' && (
        <DiameterCalculation
          length={state.length}
          selectedSpecies={state.selectedSpecies}
          selectedStandard={state.selectedStandard}
          presetDiameters={presetDiameters}
          diameterEntries={state.diameterEntries}
          currentDiameter={state.currentDiameter}
          onDiameterEntriesChange={handleDiameterEntriesChange}
          onCurrentDiameterChange={handleCurrentDiameterChange}
          onSave={handleSaveBatch}
          onBack={() => navigateToScreen('batch')}
          hasCompletedFirstCalculation={state.hasCompletedFirstCalculation}
          onQuickRestart={startQuickCalculation}
          savedSettings={savedSettings}
        />
      )}
    </div>
  );
}

// Quick Start Screen Component
function QuickStartScreen({ 
  savedSettings, 
  onQuickStart, 
  onFullSetup 
}: { 
  savedSettings: SavedSettings;
  onQuickStart: () => void;
  onFullSetup: () => void;
}) {
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

  return (
    <div>
      <div className="ios-section-header">Быстрый старт</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Последние настройки</div>
              <div className="ios-list-item-subtitle">
                {speciesNames[savedSettings.selectedSpecies]} • {savedSettings.length}м �� {savedSettings.selectedStandard}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: 'var(--ios-spacing-md)', display: 'flex', gap: 'var(--ios-spacing-md)' }}>
        <button
          onClick={onQuickStart}
          className="calculator-button-large"
          style={{ flex: 2 }}
        >
          Быстрый расчёт
        </button>
        <button
          onClick={onFullSetup}
          className="calculator-button-secondary"
          style={{ flex: 1 }}
        >
          Новые настройки
        </button>
      </div>
    </div>
  );
}