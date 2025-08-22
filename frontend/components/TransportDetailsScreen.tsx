import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  ArrowLeft,
  Truck,
  Train,
  Ship,
  Package,
  Calendar as CalendarIcon,
  Info,
  CheckCircle
} from 'lucide-react';

import { toast } from 'sonner@2.0.3';

const TRANSPORT_MODES = [
  {
    id: 'truck',
    name: 'Truck',
    icon: Truck,
    description: 'Road transport',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    id: 'rail',
    name: 'Rail',
    icon: Train,
    description: 'Railway transport',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    id: 'ship',
    name: 'Ship',
    icon: Ship,
    description: 'Water transport',
    color: 'bg-cyan-500 hover:bg-cyan-600'
  },
  {
    id: 'other',
    name: 'Other',
    icon: Package,
    description: 'Other transport',
    color: 'bg-gray-500 hover:bg-gray-600'
  }
];

interface TransportDetailsScreenProps {
  volume: number;
  quality: string;
  price: number;
  onBack: () => void;
  onNext: (transportData: {
    mode: string;
    vehiclePlate: string;
    transportDate: Date;
    lesegaisRegistered: boolean;
  }) => void;
}

export function TransportDetailsScreen({ 
  volume, 
  quality, 
  price, 
  onBack, 
  onNext 
}: TransportDetailsScreenProps) {
  const [selectedMode, setSelectedMode] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [transportDate, setTransportDate] = useState<Date>(new Date());
  const [lesegaisRegistered, setLesegaisRegistered] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Auto-format vehicle plate (Russian format)
  const formatVehiclePlate = (value: string) => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Za-z0-9А-Яа-я]/g, '').toUpperCase();
    
    // Russian format: А123БВ123 or А123БВ12
    if (cleaned.length <= 1) return cleaned;
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 6) return cleaned.slice(0, 4) + cleaned.slice(4);
    if (cleaned.length <= 9) return cleaned.slice(0, 6) + cleaned.slice(6);
    
    return cleaned.slice(0, 9);
  };

  const handleVehiclePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatVehiclePlate(e.target.value);
    setVehiclePlate(formatted);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setTransportDate(date);
      setIsCalendarOpen(false);
    }
  };

  const setDateToday = () => {
    setTransportDate(new Date());
    setIsCalendarOpen(false);
  };

  const setDateTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTransportDate(tomorrow);
    setIsCalendarOpen(false);
  };

  const handleNext = () => {
    if (!selectedMode) {
      toast.error('Please select transport mode');
      return;
    }

    if (!vehiclePlate.trim()) {
      toast.error('Please enter vehicle plate number');
      return;
    }

    const transportData = {
      mode: selectedMode,
      vehiclePlate: vehiclePlate.trim(),
      transportDate,
      lesegaisRegistered
    };

    onNext(transportData);
  };

  const selectedModeData = TRANSPORT_MODES.find(mode => mode.id === selectedMode);
  const totalValue = volume * price;

  return (
    <div className="bg-background touch-action-manipulation">
      {/* Header - iOS 16 Style */}
      <div className="flex items-center justify-between px-6 py-4 bg-background border-b border-border/50">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            aria-label="Назад"
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-secondary/60 hover:bg-secondary flex items-center justify-center transition-all duration-200 active:scale-96 focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Transport & LesEGAIS</h1>
        </div>
      </div>

      {/* Main Content - iOS 16 Style */}
      <div className="px-6 py-6 space-y-8 pb-24">
        {/* Summary Card - iOS 16 Style */}
        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">Volume:</span>
              <span className="font-bold text-foreground">{volume.toFixed(3)} m³</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">Quality Grade:</span>
              <span className="font-bold text-foreground">{quality}</span>
            </div>
            <div className="border-t border-border/50 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-semibold text-lg">Total Value:</span>
                <span className="text-2xl font-bold text-foreground tracking-tight">{totalValue.toFixed(2)}₽</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transport Mode Selection - iOS 16 Style */}
        <div>
          <Label className="text-lg font-semibold text-gray-900 mb-6 block tracking-tight">
            Transport Mode
          </Label>
          
          {/* 2x2 Grid of Transport Mode Buttons - iOS 16 Style */}
          <div className="grid grid-cols-2 gap-4">
            {TRANSPORT_MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.id;
              
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={mode.name}
                  className={`p-6 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'border-primary/50 bg-primary/10 scale-105 shadow-md'
                      : 'border-border/50 bg-background hover:border-border hover:bg-secondary/50 active:scale-96'
                  }`}
                  style={{ minHeight: '120px' }}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm ${
                      isSelected ? 'bg-primary' : 'bg-secondary'
                    }`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`font-semibold text-base ${
                      isSelected ? 'text-foreground' : 'text-foreground'
                    }`}>
                      {mode.name}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">{mode.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vehicle Plate Input - iOS 16 Style */}
        <div>
          <Label className="text-lg font-semibold text-foreground mb-4 block tracking-tight">
            Vehicle Plate Number
          </Label>
          
          <input
            value={vehiclePlate}
            onChange={handleVehiclePlateChange}
            placeholder="А123БВ123"
            className="w-full h-16 px-4 bg-secondary/60 border border-border/50 rounded-2xl text-xl font-mono text-center tracking-wider text-foreground placeholder-muted-foreground focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all duration-200"
            maxLength={9}
          />
          
          {vehiclePlate && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-secondary/60 rounded-2xl border border-border/50">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--ios-green)' }}>
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">Valid format</span>
            </div>
          )}
        </div>

        {/* Date Picker - iOS 16 Style */}
        <div>
          <Label className="text-lg font-semibold text-foreground mb-5 block tracking-tight">
            Transport Date
          </Label>
          
          {/* Quick Date Preset Buttons - iOS 16 Style */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <button
              onClick={setDateToday}
              className={`h-14 rounded-2xl text-base font-semibold transition-all duration-200 shadow-sm ${
                transportDate.toDateString() === new Date().toDateString()
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : 'bg-secondary/60 text-foreground hover:bg-secondary active:scale-96 border border-border/50'
              }`}
              type="button"
            >
              Today
            </button>
            <button
              onClick={setDateTomorrow}
              className={`h-14 rounded-2xl text-base font-semibold transition-all duration-200 shadow-sm ${
                transportDate.toDateString() === new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toDateString()
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : 'bg-secondary/60 text-foreground hover:bg-secondary active:scale-96 border border-border/50'
              }`}
              type="button"
            >
              Tomorrow
            </button>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <button type="button" className="h-14 rounded-2xl bg-secondary/60 border border-border/50 text-base font-semibold text-muted-foreground hover:bg-secondary transition-all duration-200 active:scale-96 flex items-center justify-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Pick Date
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl shadow-lg border-border/50" align="center">
                <Calendar
                  mode="single"
                  selected={transportDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Selected Date Display - iOS 16 Style */}
          <div className="p-5 bg-secondary/60 rounded-2xl border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--ios-blue)' }}>
                <CalendarIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold text-foreground">
                Selected: {transportDate.toLocaleDateString('ru-RU', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric',
                  weekday: 'long'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* LesEGAIS Registration Toggle - iOS 16 Style */}
        <div>
          <div className="flex items-center justify-between p-6 bg-secondary/60 border border-border/50 rounded-2xl shadow-sm">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Label className="text-lg font-semibold text-foreground tracking-tight">
                  Register in LesEGAIS
                </Label>
                <div className="group relative">
                  <div className="w-6 h-6 rounded-full bg-secondary/80 flex items-center justify-center cursor-help">
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-xl whitespace-nowrap z-10">
                    Required for commercial timber trade
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Automatically register this shipment with the state forestry system
              </p>
            </div>
            <Switch 
              checked={lesegaisRegistered}
              onCheckedChange={setLesegaisRegistered}
              className="ml-6 data-[state=checked]:bg-primary"
            />
          </div>
          
          {lesegaisRegistered && (
            <div className="mt-4 p-5 bg-secondary/60 border border-border/50 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--ios-green)' }}>
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-semibold text-foreground">
                  Will be registered in LesEGAIS upon completion
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Complete Entry Button - iOS 16 Style */}
        <button
          onClick={handleNext}
          disabled={!selectedMode || !vehiclePlate.trim()}
          className="w-full h-16 rounded-2xl text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-98 shadow-lg mt-8"
          style={{ background: 'var(--ios-blue)', color: 'white' }}
          type="button"
          aria-label="Complete Entry"
        >
          Complete Entry
        </button>
      </div>
    </div>
  );
}
