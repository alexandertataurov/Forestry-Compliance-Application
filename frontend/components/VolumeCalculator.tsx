import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { NumericInput } from './ui/numeric-input';
import { SpeciesSelector } from './ui/species-selector';
import { GPSInput } from './ui/gps-input';
import { MeasurementInput } from './ui/measurement-input';
import { FormValidation } from './ui/form-validation';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useFieldOperations } from './ui/use-mobile';
import { cn } from './ui/utils';
import { 
  TreePine, 
  FileText, 
  ChevronRight,
  CheckCircle,
  Info,
  Star,
  Zap,
  Settings,
  Check,
  Ruler, 
  MapPin, 
  Truck, 
  Calendar, 
  Camera,
  Plus,
  Minus,
  User,
  Hash,
  Clock,
  Save,
  ArrowLeft,
  Calculator as CalculatorIcon
} from 'lucide-react';

interface DiameterEntry {
  id: string;
  diameter: number;
  volume: number;
}

interface CalculatorState {
  currentScreen: 'standard' | 'batch' | 'calculation';
  selectedStandard: string;
  selectedSpecies: string;
  length: MeasurementValue | null;
  location: GPSCoordinates | null;
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
  length: MeasurementValue | null;
  operator: string;
  coordinates: GPSCoordinates | null;
}

interface MeasurementValue {
  value: number;
  unit: string;
}

interface GPSCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

export function VolumeCalculator() {
  const fieldOps = useFieldOperations();
  const [state, setState] = useState<CalculatorState>({
    currentScreen: 'standard',
    selectedStandard: '',
    selectedSpecies: '',
    length: null,
    location: null,
    transport: {
      type: 'truck',
      plateNumber: '',
      driverName: ''
    },
    batch: {
      number: '',
      date: new Date().toISOString().split('T')[0],
      operator: ''
    },
    documents: [],
    diameterEntries: [],
    currentDiameter: '',
    hasCompletedFirstCalculation: false
  });

  const [calculations, setCalculations] = useState<any[]>([]);
  const [savedSettings, setSavedSettings] = useState<SavedSettings | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
          length: parsedSettings.length || null,
          batch: {
            ...prev.batch,
            operator: parsedSettings.operator || ''
          },
          location: parsedSettings.coordinates || null,
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

  const validateScreen = (screen: string): boolean => {
    const newErrors: Record<string, string> = {};

    if (screen === 'standard') {
      if (!state.selectedStandard) {
        newErrors.standard = 'Выберите стандарт';
      }
      if (!state.selectedSpecies) {
        newErrors.species = 'Выберите породу дерева';
      }
    }

    if (screen === 'batch') {
      if (!state.length || state.length.value <= 0) {
        newErrors.length = 'Введите длину бревна';
      }
      if (!state.batch.operator.trim()) {
        newErrors.operator = 'Введите имя оператора';
      }
      if (!state.transport.plateNumber.trim()) {
        newErrors.plateNumber = 'Введите номер транспорта';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStandardChange = (standard: string) => {
    updateState({ selectedStandard: standard });
    if (errors.standard) {
      setErrors(prev => ({ ...prev, standard: '' }));
    }
  };

  const handleSpeciesChange = (species: string) => {
    updateState({ selectedSpecies: species });
    if (errors.species) {
      setErrors(prev => ({ ...prev, species: '' }));
    }
  };

  const handleLengthChange = (length: MeasurementValue | null) => {
    updateState({ length });
    if (errors.length) {
      setErrors(prev => ({ ...prev, length: '' }));
    }
  };

  const handleLocationChange = (location: GPSCoordinates | null) => {
    updateState({ location });
  };

  const handleTransportChange = (field: string, value: string) => {
    updateState({
      transport: { ...state.transport, [field]: value }
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBatchChange = (field: string, value: string) => {
    updateState({
      batch: { ...state.batch, [field]: value }
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
    if (screen === 'batch' && !validateScreen('standard')) {
      return;
    }
    if (screen === 'calculation' && !validateScreen('batch')) {
      return;
    }
    updateState({ currentScreen: screen });
  };

  const saveCurrentSettings = () => {
    const settingsToSave: SavedSettings = {
      selectedStandard: state.selectedStandard,
      selectedSpecies: state.selectedSpecies,
      length: state.length,
      operator: state.batch.operator,
      coordinates: state.location
    };
    
    localStorage.setItem('forestry-calculator-settings', JSON.stringify(settingsToSave));
    setSavedSettings(settingsToSave);
  };

  const generateCalculationId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `CALC-${timestamp.toString().slice(-8)}-${random}`;
  };

  const generateBatchNumber = () => {
    const date = new Date();
    const batchNum = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    return batchNum;
  };

  const startQuickCalculation = () => {
    if (!savedSettings) return;
    
    // Prompt for new vehicle number
    const newVehicleNumber = prompt('Введите номер транспорта для новой партии:', '');
    if (newVehicleNumber === null) return; // User cancelled
    
    // Generate new batch number and calculation ID
    const newBatchNumber = generateBatchNumber();
    
    setState({
      currentScreen: 'calculation',
      selectedStandard: savedSettings.selectedStandard,
      selectedSpecies: savedSettings.selectedSpecies,
      length: savedSettings.length,
      location: savedSettings.coordinates,
      transport: {
        type: 'truck',
        plateNumber: newVehicleNumber,
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

    // Generate unique calculation ID for this batch
    const calculationId = generateCalculationId();

    const batchCalculations = state.diameterEntries.map(entry => ({
      id: Date.now() + Math.random(),
      calculationId: calculationId,
      diameter: entry.diameter,
      length: state.length?.value || 0,
      species: state.selectedSpecies,
      standard: state.selectedStandard,
      volume: entry.volume,
      timestamp: new Date().toISOString(),
      coordinates: state.location,
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

  const standards = [
    {
      id: 'GOST-2708-75',
      name: 'ГОСТ 2708-75',
      description: 'Российский стандарт для круглых лесоматериалов',
      official: true,
      icon: TreePine
    },
    {
      id: 'GOST-2292-88',
      name: 'ГОСТ 2292-88',
      description: 'Лесоматериалы круглые. Маркировка, сортировка',
      official: true,
      icon: FileText
    },
    {
      id: 'ISO-4480',
      name: 'ISO 4480',
      description: 'Международный стандарт измерения древесины',
      official: false,
      icon: Info
    },
    {
      id: 'EN-1309',
      name: 'EN 1309',
      description: 'Европейский стандарт круглых лесоматериалов',
      official: false,
      icon: Zap
    }
  ];

  const transportTypes = [
    { id: 'truck', name: 'Автомобиль', icon: Truck },
    { id: 'rail', name: 'Железная дорога', icon: ChevronRight },
    { id: 'ship', name: 'Водный транспорт', icon: Truck },
    { id: 'other', name: 'Другое', icon: Info }
  ];

  const renderStandardSelection = () => (
    <div className={cn(
      "space-y-4",
      fieldOps.shouldUseCompactLayout && "space-y-3"
    )}>
      <div className={cn(
        "ios-section-header",
        fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
      )}>
        Выберите стандарт
      </div>
      
      <div className={cn(
        "grid gap-3",
        fieldOps.isMobile ? "grid-cols-1" : "grid-cols-2",
        fieldOps.isLandscape && "grid-cols-2 gap-2"
      )}>
        {standards.map((standard) => (
          <button
            key={standard.id}
            onClick={() => handleStandardChange(standard.id)}
            className={cn(
              "ios-card touch-target p-4 text-left transition-all duration-200 hover:scale-105 active:scale-95",
              state.selectedStandard === standard.id && "ring-2 ring-brand-primary bg-brand-primary/5",
              fieldOps.shouldUseLargeButtons && "p-5",
              fieldOps.shouldUseLargerText && "p-4"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={cn(
                "ios-list-item-icon",
                fieldOps.shouldUseLargeButtons && "w-12 h-12"
              )}>
                <standard.icon className={cn(
                  fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-5 h-5"
                )} />
              </div>
              {state.selectedStandard === standard.id && (
                <CheckCircle className={cn(
                  "text-status-success",
                  fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-5 h-5"
                )} />
              )}
            </div>
            <div className={cn(
              "text-field-base font-semibold text-surface-on-surface mb-1",
              fieldOps.shouldUseLargerText && "text-field-lg"
            )}>
              {standard.name}
            </div>
            <div className={cn(
              "text-field-xs text-surface-on-variant",
              fieldOps.shouldUseLargerText && "text-field-sm"
            )}>
              {standard.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSpeciesSelection = () => (
    <div className={cn(
      "space-y-4",
      fieldOps.shouldUseCompactLayout && "space-y-3"
    )}>
      <div className={cn(
        "ios-section-header",
        fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
      )}>
        Выберите породу дерева
      </div>
      
      <SpeciesSelector
        value={state.selectedSpecies}
        onValueChange={handleSpeciesChange}
        placeholder="Выберите породу дерева..."
        showSearch={true}
        showCategoryFilter={true}
        showScientificName={true}
        showDensity={true}
        fieldMode={true}
        compact={fieldOps.shouldUseCompactLayout}
        largeButtons={fieldOps.shouldUseLargeButtons}
        largerText={fieldOps.shouldUseLargerText}
      />
    </div>
  );

  const renderMeasurementInput = () => (
    <div className={cn(
      "space-y-4",
      fieldOps.shouldUseCompactLayout && "space-y-3"
    )}>
      <div className={cn(
        "ios-section-header",
        fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
      )}>
        Измерения
      </div>
      
      <div className="ios-list space-y-2">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div className={cn(
              "ios-list-item-icon",
              fieldOps.shouldUseLargeButtons && "w-12 h-12"
            )}>
              <Ruler className={cn(
                fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
              )} />
            </div>
            <div className="ios-list-item-text">
              <div className={cn(
                "ios-list-item-title",
                fieldOps.shouldUseLargerText && "text-field-base font-medium"
              )}>
                Длина ствола
              </div>
              <div className={cn(
                "ios-list-item-subtitle",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {state.length ? `${state.length.value} ${state.length.unit}` : 'Не указана'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setState(prev => ({ ...prev, currentScreen: 'measurement' }))}
            className={cn(
              "ios-button ios-button-secondary touch-target",
              fieldOps.shouldUseLargeButtons && "ios-button-lg"
            )}
          >
            <span>Изменить</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div className={cn(
              "ios-list-item-icon",
              fieldOps.shouldUseLargeButtons && "w-12 h-12"
            )}>
              <MapPin className={cn(
                fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
              )} />
            </div>
            <div className="ios-list-item-text">
              <div className={cn(
                "ios-list-item-title",
                fieldOps.shouldUseLargerText && "text-field-base font-medium"
              )}>
                Местоположение
              </div>
              <div className={cn(
                "ios-list-item-subtitle",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {state.location ? `${state.location.lat.toFixed(6)}, ${state.location.lng.toFixed(6)}` : 'Не указано'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setState(prev => ({ ...prev, currentScreen: 'location' }))}
            className={cn(
              "ios-button ios-button-secondary touch-target",
              fieldOps.shouldUseLargeButtons && "ios-button-lg"
            )}
          >
            <span>Указать</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderDiameterInput = () => (
    <div className={cn(
      "space-y-4",
      fieldOps.shouldUseCompactLayout && "space-y-3"
    )}>
      <div className={cn(
        "ios-section-header",
        fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
      )}>
        Диаметр ствола
      </div>
      
      <div className="ios-card p-4">
        <div className={cn(
          "grid gap-3",
          fieldOps.isMobile ? "grid-cols-1" : "grid-cols-2",
          fieldOps.isLandscape && "grid-cols-2 gap-2"
        )}>
          <NumericInput
            label="Диаметр (см)"
            value={state.currentDiameter}
            onChange={handleCurrentDiameterChange}
            placeholder="0.0"
            precision={1}
            min={0}
            max={200}
            fieldMode={true}
            compact={fieldOps.shouldUseCompactLayout}
            largeButtons={fieldOps.shouldUseLargeButtons}
            largerText={fieldOps.shouldUseLargerText}
          />
          
          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                if (state.currentDiameter && parseFloat(state.currentDiameter) > 0) {
                  const diameter = parseFloat(state.currentDiameter);
                  const volume = calculateVolume(diameter, state.length?.value || 0);
                  const newEntry: DiameterEntry = {
                    id: Date.now().toString(),
                    diameter,
                    volume
                  };
                  handleDiameterEntriesChange([...state.diameterEntries, newEntry]);
                  handleCurrentDiameterChange('');
                }
              }}
              disabled={!state.currentDiameter || parseFloat(state.currentDiameter) <= 0}
              className={cn(
                "ios-button ios-button-primary touch-target flex-1",
                fieldOps.shouldUseLargeButtons && "ios-button-lg"
              )}
            >
              <Plus className="w-4 h-4" />
              <span>Добавить</span>
            </button>
          </div>
        </div>
      </div>

      {state.diameterEntries.length > 0 && (
        <div className="ios-card p-4">
          <div className={cn(
            "text-field-base font-semibold mb-3",
            fieldOps.shouldUseLargerText && "text-field-lg"
          )}>
            Измерения ({state.diameterEntries.length})
          </div>
          
          <div className="space-y-2">
            {state.diameterEntries.map((entry, index) => (
              <div key={entry.id} className="flex items-center justify-between p-2 bg-surface-card rounded-md">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-field-sm font-medium",
                    fieldOps.shouldUseLargerText && "text-field-base"
                  )}>
                    {index + 1}.
                  </span>
                  <span className={cn(
                    "text-field-base",
                    fieldOps.shouldUseLargerText && "text-field-lg"
                  )}>
                    {entry.diameter} см
                  </span>
                  <span className={cn(
                    "text-field-sm text-surface-on-variant",
                    fieldOps.shouldUseLargerText && "text-field-base"
                  )}>
                    → {entry.volume.toFixed(3)} м³
                  </span>
                </div>
                <button
                  onClick={() => {
                    const newEntries = state.diameterEntries.filter(e => e.id !== entry.id);
                    handleDiameterEntriesChange(newEntries);
                  }}
                  className={cn(
                    "text-status-error hover:text-status-error/80 touch-target p-1",
                    fieldOps.shouldUseLargeButtons && "p-2"
                  )}
                >
                  <Minus className={cn(
                    "w-4 h-4",
                    fieldOps.shouldUseLargeButtons && "w-5 h-5"
                  )} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-surface-border">
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-field-base font-semibold",
                fieldOps.shouldUseLargerText && "text-field-lg"
              )}>
                Общий объём:
              </span>
              <span className={cn(
                "text-field-lg font-bold text-brand-primary",
                fieldOps.shouldUseLargerText && "text-field-xl"
              )}>
                {calculateTotalVolume().toFixed(3)} м³
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTransportInfo = () => (
    <div className={cn(
      "space-y-4",
      fieldOps.shouldUseCompactLayout && "space-y-3"
    )}>
      <div className={cn(
        "ios-section-header",
        fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
      )}>
        Транспортная информация
      </div>
      
      <div className="ios-list space-y-2">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div className={cn(
              "ios-list-item-icon",
              fieldOps.shouldUseLargeButtons && "w-12 h-12"
            )}>
              <Truck className={cn(
                fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
              )} />
            </div>
            <div className="ios-list-item-text">
              <div className={cn(
                "ios-list-item-title",
                fieldOps.shouldUseLargerText && "text-field-base font-medium"
              )}>
                Тип транспорта
              </div>
              <div className={cn(
                "ios-list-item-subtitle",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {state.transport.type}
              </div>
            </div>
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div className={cn(
              "ios-list-item-icon",
              fieldOps.shouldUseLargeButtons && "w-12 h-12"
            )}>
              <Hash className={cn(
                fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
              )} />
            </div>
            <div className="ios-list-item-text">
              <div className={cn(
                "ios-list-item-title",
                fieldOps.shouldUseLargerText && "text-field-base font-medium"
              )}>
                Номер транспорта
              </div>
              <div className={cn(
                "ios-list-item-subtitle",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {state.transport.plateNumber || 'Не указан'}
              </div>
            </div>
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div className={cn(
              "ios-list-item-icon",
              fieldOps.shouldUseLargeButtons && "w-12 h-12"
            )}>
              <User className={cn(
                fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
              )} />
            </div>
            <div className="ios-list-item-text">
              <div className={cn(
                "ios-list-item-title",
                fieldOps.shouldUseLargerText && "text-field-base font-medium"
              )}>
                Водитель
              </div>
              <div className={cn(
                "ios-list-item-subtitle",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {state.transport.driverName || 'Не указан'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBatchInfo = () => (
    <div className={cn(
      "space-y-4",
      fieldOps.shouldUseCompactLayout && "space-y-3"
    )}>
      <div className={cn(
        "ios-section-header",
        fieldOps.shouldUseLargerText && "text-field-lg font-semibold"
      )}>
        Информация о партии
      </div>
      
      <div className="ios-list space-y-2">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div className={cn(
              "ios-list-item-icon",
              fieldOps.shouldUseLargeButtons && "w-12 h-12"
            )}>
              <Hash className={cn(
                fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
              )} />
            </div>
            <div className="ios-list-item-text">
              <div className={cn(
                "ios-list-item-title",
                fieldOps.shouldUseLargerText && "text-field-base font-medium"
              )}>
                Номер партии
              </div>
              <div className={cn(
                "ios-list-item-subtitle",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {state.batch.number || 'Не указан'}
              </div>
            </div>
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div className={cn(
              "ios-list-item-icon",
              fieldOps.shouldUseLargeButtons && "w-12 h-12"
            )}>
              <Calendar className={cn(
                fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
              )} />
            </div>
            <div className="ios-list-item-text">
              <div className={cn(
                "ios-list-item-title",
                fieldOps.shouldUseLargerText && "text-field-base font-medium"
              )}>
                Дата
              </div>
              <div className={cn(
                "ios-list-item-subtitle",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {state.batch.date}
              </div>
            </div>
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div className={cn(
              "ios-list-item-icon",
              fieldOps.shouldUseLargeButtons && "w-12 h-12"
            )}>
              <User className={cn(
                fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-4 h-4"
              )} />
            </div>
            <div className="ios-list-item-text">
              <div className={cn(
                "ios-list-item-title",
                fieldOps.shouldUseLargerText && "text-field-base font-medium"
              )}>
                Оператор
              </div>
              <div className={cn(
                "ios-list-item-subtitle",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {state.batch.operator || 'Не указан'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const calculateTotalVolume = () => {
    return state.diameterEntries.reduce((sum, entry) => sum + entry.volume, 0);
  };

  const getProgressPercentage = () => {
    if (state.currentScreen === 'standard') return 25;
    if (state.currentScreen === 'species') return 50;
    if (state.currentScreen === 'measurement') return 75;
    if (state.currentScreen === 'diameter') return 90;
    return 100;
  };

  const canGoBack = () => {
    return state.currentScreen !== 'standard';
  };

  const handlePrevious = () => {
    if (state.currentScreen === 'standard') return;
    if (state.currentScreen === 'species') {
      setState(prev => ({ ...prev, currentScreen: 'standard' }));
    } else if (state.currentScreen === 'measurement') {
      setState(prev => ({ ...prev, currentScreen: 'species' }));
    } else if (state.currentScreen === 'diameter') {
      setState(prev => ({ ...prev, currentScreen: 'measurement' }));
    }
  };

  const canProceed = () => {
    if (state.currentScreen === 'standard') return state.selectedStandard && state.selectedSpecies;
    if (state.currentScreen === 'species') return state.selectedSpecies;
    if (state.currentScreen === 'measurement') return state.length && state.location;
    if (state.currentScreen === 'diameter') return state.currentDiameter && parseFloat(state.currentDiameter) > 0;
    if (state.currentScreen === 'transport') return state.transport.plateNumber;
    if (state.currentScreen === 'batch') return state.batch.operator && state.batch.number && state.batch.date;
    return true;
  };

  const getNextButtonText = () => {
    if (state.currentScreen === 'standard') return 'Далее';
    if (state.currentScreen === 'species') return 'Далее';
    if (state.currentScreen === 'measurement') return 'Далее';
    if (state.currentScreen === 'diameter') return 'Далее';
    if (state.currentScreen === 'transport') return 'Далее';
    if (state.currentScreen === 'batch') return 'Сохранить партию';
    return 'Готово';
  };

  const handleNext = () => {
    if (state.currentScreen === 'standard') {
      if (!state.selectedStandard || !state.selectedSpecies) return;
      setState(prev => ({ ...prev, currentScreen: 'species' }));
    } else if (state.currentScreen === 'species') {
      setState(prev => ({ ...prev, currentScreen: 'measurement' }));
    } else if (state.currentScreen === 'measurement') {
      if (!state.length || !state.location) return;
      setState(prev => ({ ...prev, currentScreen: 'diameter' }));
    } else if (state.currentScreen === 'diameter') {
      if (state.currentDiameter && parseFloat(state.currentDiameter) <= 0) return;
      setState(prev => ({ ...prev, currentScreen: 'transport' }));
    } else if (state.currentScreen === 'transport') {
      if (!state.transport.plateNumber) return;
      setState(prev => ({ ...prev, currentScreen: 'batch' }));
    } else if (state.currentScreen === 'batch') {
      if (state.diameterEntries.length === 0) {
        alert('Добавьте диаметры для сохранения');
        return;
      }
      handleSaveBatch();
    }
  };

  return (
    <div className={cn(
      "space-y-6 pb-6",
      fieldOps.shouldUseCompactLayout && "space-y-4",
      fieldOps.isLandscape && "space-y-3"
    )}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setState(prev => ({ ...prev, currentScreen: 'standard' }))}
          className={cn(
            "ios-button ios-button-secondary touch-target",
            fieldOps.shouldUseLargeButtons && "ios-button-lg"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>
        <div className={cn(
          "text-field-lg font-semibold",
          fieldOps.shouldUseLargerText && "text-field-xl"
        )}>
          Расчёт объёма
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="ios-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className={cn(
            "text-field-sm font-medium",
            fieldOps.shouldUseLargerText && "text-field-base"
          )}>
            Прогресс
          </span>
          <span className={cn(
            "text-field-sm text-surface-on-variant",
            fieldOps.shouldUseLargerText && "text-field-base"
          )}>
            {getProgressPercentage()}%
          </span>
        </div>
        <div className="w-full bg-surface-border rounded-full h-2">
          <div 
            className="bg-brand-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Content based on current screen */}
      {state.currentScreen === 'standard' && renderStandardSelection()}
      {state.currentScreen === 'species' && renderSpeciesSelection()}
      {state.currentScreen === 'measurement' && renderMeasurementInput()}
      {state.currentScreen === 'diameter' && renderDiameterInput()}
      {state.currentScreen === 'transport' && renderTransportInfo()}
      {state.currentScreen === 'batch' && renderBatchInfo()}
      {state.currentScreen === 'summary' && renderSummary()}

      {/* Navigation */}
      {state.currentScreen !== 'summary' && (
        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={!canGoBack()}
            className={cn(
              "ios-button ios-button-secondary touch-target flex-1",
              fieldOps.shouldUseLargeButtons && "ios-button-lg"
            )}
          >
            <span>Назад</span>
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              "ios-button ios-button-primary touch-target flex-1",
              fieldOps.shouldUseLargeButtons && "ios-button-lg"
            )}
          >
            <span>{getNextButtonText()}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// Helper function to calculate volume based on diameter and length
function calculateVolume(diameter: number, length: number): number {
  // Simple cylinder volume calculation: V = π * r² * h
  const radius = diameter / 200; // Convert cm to meters and get radius
  return Math.PI * radius * radius * length;
}