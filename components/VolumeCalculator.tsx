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
    currentDiameter: ''
  });

  const [calculations, setCalculations] = useState<any[]>([]);

  // Load saved calculations
  useEffect(() => {
    try {
      const saved = localStorage.getItem('forestry-calculations');
      if (saved) {
        setCalculations(JSON.parse(saved));
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
      
      alert(`Сохранена партия из ${batchCalculations.length} брёвен`);
      
      // Reset to first screen for new calculation
      setState({
        currentScreen: 'standard',
        selectedStandard: state.selectedStandard, // Keep standard selection
        selectedSpecies: state.selectedSpecies, // Keep species selection
        length: '',
        location: {
          coordinates: state.location.coordinates, // Keep GPS if available
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
          operator: state.batch.operator // Keep operator name
        },
        documents: [],
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
        />
      )}
    </div>
  );
}