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

  const transportTypes = [
    { id: 'truck', name: 'Автомобиль', icon: '🚛' },
    { id: 'rail', name: 'Железная дорога', icon: '🚂' },
    { id: 'ship', name: 'Водный транспорт', icon: '🚢' },
    { id: 'other', name: 'Другое', icon: '📦' }
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          state.currentScreen === 'standard' ? 'bg-brand-primary text-brand-on-primary' : 
          state.currentScreen === 'batch' ? 'bg-brand-primary text-brand-on-primary' : 
          'bg-surface-border text-surface-on-variant'
        }`}>
          1
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          state.currentScreen === 'batch' ? 'bg-brand-primary text-brand-on-primary' : 
          state.currentScreen === 'calculation' ? 'bg-brand-primary text-brand-on-primary' : 
          'bg-surface-border text-surface-on-variant'
        }`}>
          2
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          state.currentScreen === 'calculation' ? 'bg-brand-primary text-brand-on-primary' : 
          'bg-surface-border text-surface-on-variant'
        }`}>
          3
        </div>
      </div>

      {/* Standard and Species Selection Screen */}
      {state.currentScreen === 'standard' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Выбор стандарта и породы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Standard Selection */}
              <div className="space-y-3">
                <label className="text-body font-medium text-surface-on-surface">
                  Стандарт измерения
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {standards.map((standard) => (
                    <Button
                      key={standard.id}
                      variant={state.selectedStandard === standard.id ? "default" : "outline"}
                      className="justify-start h-auto p-4"
                      onClick={() => handleStandardChange(standard.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex items-center gap-2">
                          {standard.official && <Star className="w-4 h-4 text-brand-primary" />}
                          <div className="text-left">
                            <div className="text-body font-medium">{standard.name}</div>
                            <div className="text-caption text-surface-on-variant">{standard.description}</div>
                          </div>
                        </div>
                        {state.selectedStandard === standard.id && (
                          <CheckCircle className="w-5 h-5 ml-auto" />
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
                {errors.standard && (
                  <div className="text-caption text-state-error">{errors.standard}</div>
                )}
              </div>

              <Separator />

              {/* Species Selection */}
              <div className="space-y-3">
                <label className="text-body font-medium text-surface-on-surface">
                  Порода дерева
                </label>
                <SpeciesSelector
                  value={state.selectedSpecies}
                  onValueChange={handleSpeciesChange}
                  placeholder="Выберите породу дерева..."
                  showSearch={true}
                  showCategoryFilter={true}
                  showScientificName={true}
                  showDensity={true}
                />
                {errors.species && (
                  <div className="text-caption text-state-error">{errors.species}</div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={() => navigateToScreen('batch')}
              disabled={!state.selectedStandard || !state.selectedSpecies}
              className="min-w-[120px]"
            >
              Далее
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Batch Configuration Screen */}
      {state.currentScreen === 'batch' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Настройка партии
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Length Input */}
              <div className="space-y-3">
                <label className="text-body font-medium text-surface-on-surface">
                  Длина бревна
                </label>
                <MeasurementInput
                  value={state.length}
                  onChange={handleLengthChange}
                  category="length"
                  defaultUnit="m"
                  placeholder="Введите длину бревна"
                  min={0.1}
                  max={50}
                  step={0.1}
                  showValidation={true}
                  showConversion={true}
                  allowUnitChange={true}
                />
                {errors.length && (
                  <div className="text-caption text-state-error">{errors.length}</div>
                )}
              </div>

              <Separator />

              {/* GPS Location */}
              <div className="space-y-3">
                <label className="text-body font-medium text-surface-on-surface">
                  Местоположение
                </label>
                <GPSInput
                  value={state.location}
                  onChange={handleLocationChange}
                  placeholder="Определить GPS координаты"
                  showAccuracy={true}
                  showTimestamp={true}
                  allowManualEntry={true}
                  precision={6}
                />
              </div>

              <Separator />

              {/* Transport Information */}
              <div className="space-y-4">
                <label className="text-body font-medium text-surface-on-surface">
                  Транспорт
                </label>
                
                <div className="grid grid-cols-2 gap-3">
                  {transportTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={state.transport.type === type.id ? "default" : "outline"}
                      className="justify-start h-auto p-3"
                      onClick={() => handleTransportChange('type', type.id)}
                    >
                      <span className="mr-2">{type.icon}</span>
                      {type.name}
                    </Button>
                  ))}
                </div>

                <div className="space-y-3">
                  <NumericInput
                    label="Номер транспорта"
                    value={state.transport.plateNumber}
                    onChange={(value) => handleTransportChange('plateNumber', value)}
                    placeholder="А123БВ77"
                    showValidation={true}
                    required={true}
                  />
                  {errors.plateNumber && (
                    <div className="text-caption text-state-error">{errors.plateNumber}</div>
                  )}

                  <NumericInput
                    label="Имя водителя"
                    value={state.transport.driverName}
                    onChange={(value) => handleTransportChange('driverName', value)}
                    placeholder="Иванов И.И."
                    showValidation={false}
                  />
                </div>
              </div>

              <Separator />

              {/* Batch Information */}
              <div className="space-y-4">
                <label className="text-body font-medium text-surface-on-surface">
                  Информация о партии
                </label>
                
                <div className="space-y-3">
                  <NumericInput
                    label="Номер партии"
                    value={state.batch.number}
                    onChange={(value) => handleBatchChange('number', value)}
                    placeholder="20241201-ABC123"
                    showValidation={true}
                    required={true}
                  />

                  <NumericInput
                    label="Дата"
                    value={state.batch.date}
                    onChange={(value) => handleBatchChange('date', value)}
                    placeholder="2024-12-01"
                    showValidation={true}
                    required={true}
                  />

                  <NumericInput
                    label="Оператор"
                    value={state.batch.operator}
                    onChange={(value) => handleBatchChange('operator', value)}
                    placeholder="Иванов И.И."
                    showValidation={true}
                    required={true}
                  />
                  {errors.operator && (
                    <div className="text-caption text-state-error">{errors.operator}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => navigateToScreen('standard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <Button 
              onClick={() => navigateToScreen('calculation')}
              disabled={!state.length || !state.batch.operator || !state.transport.plateNumber}
              className="min-w-[120px]"
            >
              Далее
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Diameter Calculation Screen */}
      {state.currentScreen === 'calculation' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalculatorIcon className="w-5 h-5" />
                Измерение диаметров
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Settings Summary */}
              <div className="p-4 rounded-lg bg-surface-bg-variant">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-surface-on-variant">Стандарт:</div>
                    <div className="font-medium">{standards.find(s => s.id === state.selectedStandard)?.name}</div>
                  </div>
                  <div>
                    <div className="text-surface-on-variant">Порода:</div>
                    <div className="font-medium">{state.selectedSpecies}</div>
                  </div>
                  <div>
                    <div className="text-surface-on-variant">Длина:</div>
                    <div className="font-medium">{state.length?.value} {state.length?.unit}</div>
                  </div>
                  <div>
                    <div className="text-surface-on-variant">Партия:</div>
                    <div className="font-medium">{state.batch.number}</div>
                  </div>
                </div>
              </div>

              {/* Diameter Input */}
              <div className="space-y-3">
                <label className="text-body font-medium text-surface-on-surface">
                  Диаметр бревна (см)
                </label>
                <NumericInput
                  value={state.currentDiameter}
                  onChange={handleCurrentDiameterChange}
                  placeholder="Введите диаметр"
                  min={10}
                  max={100}
                  step={0.1}
                  precision={1}
                  unit="см"
                  showValidation={true}
                  allowDecimal={true}
                />
              </div>

              {/* Preset Diameters */}
              <div className="space-y-3">
                <label className="text-body font-medium text-surface-on-surface">
                  Быстрый выбор диаметров
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {presetDiameters.map((diameter) => (
                    <Button
                      key={diameter}
                      variant="outline"
                      size="sm"
                      onClick={() => handleCurrentDiameterChange(diameter.toString())}
                      className="h-8"
                    >
                      {diameter}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Add Diameter Button */}
              <Button
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
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить диаметр
              </Button>

              {/* Diameter Entries List */}
              {state.diameterEntries.length > 0 && (
                <div className="space-y-3">
                  <label className="text-body font-medium text-surface-on-surface">
                    Измеренные диаметры ({state.diameterEntries.length})
                  </label>
                  <div className="space-y-2">
                    {state.diameterEntries.map((entry, index) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-bg-variant">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{index + 1}</Badge>
                          <div>
                            <div className="text-body font-medium">{entry.diameter} см</div>
                            <div className="text-caption text-surface-on-variant">
                              Объём: {entry.volume.toFixed(3)} м³
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newEntries = state.diameterEntries.filter(e => e.id !== entry.id);
                            handleDiameterEntriesChange(newEntries);
                          }}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Volume */}
              {state.diameterEntries.length > 0 && (
                <div className="p-4 rounded-lg bg-brand-primary/10 border border-brand-primary/20">
                  <div className="text-center">
                    <div className="text-caption text-surface-on-variant">Общий объём партии</div>
                    <div className="text-title font-title text-brand-primary">
                      {state.diameterEntries.reduce((sum, entry) => sum + entry.volume, 0).toFixed(3)} м³
                    </div>
                    <div className="text-caption text-surface-on-variant">
                      {state.diameterEntries.length} брёвен
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => navigateToScreen('batch')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <Button 
              onClick={handleSaveBatch}
              disabled={state.diameterEntries.length === 0}
              className="min-w-[120px]"
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить партию
            </Button>
          </div>
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