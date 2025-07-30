import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { NumericKeypadModal } from './NumericKeypadModal';
import { 
  ArrowLeft,
  Info,
  Star,
  Calculator,
  DollarSign
} from 'lucide-react';
import { formatVolume } from '../utils/gost-calculations';

const QUALITY_GRADES = [
  { 
    value: '1', 
    label: 'Grade 1', 
    description: 'Premium quality - no defects, straight grain',
    multiplier: 1.0,
    color: 'bg-green-500 text-white border-green-500',
    colorInactive: 'bg-green-50 text-green-700 border-green-200'
  },
  { 
    value: '2', 
    label: 'Grade 2', 
    description: 'Good quality - minor defects allowed',
    multiplier: 0.8,
    color: 'bg-yellow-500 text-white border-yellow-500',
    colorInactive: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  },
  { 
    value: '3', 
    label: 'Grade 3', 
    description: 'Standard quality - some defects allowed',
    multiplier: 0.6,
    color: 'bg-orange-500 text-white border-orange-500',
    colorInactive: 'bg-orange-50 text-orange-700 border-orange-200'
  }
];

const PRICE_PRESETS = [500, 1000, 1500];

interface QualityPriceScreenProps {
  volume: number;
  onBack: () => void;
  onNext: (quality: string, price: number) => void;
}

export function QualityPriceScreen({ volume, onBack, onNext }: QualityPriceScreenProps) {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);

  // Calculate final price with quality multiplier
  const calculateFinalPrice = () => {
    const price = parseFloat(basePrice) || 0;
    const grade = QUALITY_GRADES.find(g => g.value === selectedGrade);
    const multiplier = grade?.multiplier || 1.0;
    return price * multiplier;
  };

  // Calculate total value
  const calculateTotal = () => {
    const finalPrice = calculateFinalPrice();
    return volume * finalPrice;
  };

  const handleNext = () => {
    if (selectedGrade && basePrice) {
      const finalPrice = calculateFinalPrice();
      onNext(selectedGrade, finalPrice);
    }
  };

  const handleKeypadConfirm = (value: string) => {
    setBasePrice(value);
    setIsKeypadOpen(false);
  };

  const selectedGradeData = QUALITY_GRADES.find(g => g.value === selectedGrade);
  const finalPrice = calculateFinalPrice();
  const total = calculateTotal();

  return (
    <TooltipProvider>
      <div className="bg-white touch-action-manipulation">
        {/* Header - iOS 16 Style */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200/50">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="w-11 h-11 rounded-full bg-gray-100/80 hover:bg-gray-200/80 flex items-center justify-center transition-all duration-200 active:scale-96"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Quality & Price</h1>
          </div>
        </div>

        {/* Main Content - iOS 16 Style */}
        <div className="px-6 py-6 space-y-8 pb-24">
          {/* Quality Grade Selector */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Label className="text-lg font-semibold text-gray-900 tracking-tight">Quality Grade</Label>
              <Tooltip>
                <TooltipTrigger>
                  <div className="w-6 h-6 rounded-full bg-gray-200/80 flex items-center justify-center">
                    <Info className="w-3 h-3 text-gray-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="rounded-xl shadow-lg backdrop-blur-lg">
                  <p>Quality grades affect the final price calculation</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Segmented Control - iOS 16 Style */}
            <div className="flex bg-gray-100/80 p-2 rounded-2xl border border-gray-200/50">
              {QUALITY_GRADES.map((grade) => (
                <button
                  key={grade.value}
                  onClick={() => setSelectedGrade(grade.value)}
                  className={`flex-1 px-4 py-4 rounded-xl font-semibold transition-all duration-200 ${
                    selectedGrade === grade.value
                      ? grade.color + ' shadow-md scale-105'
                      : 'text-gray-600 hover:bg-gray-50 active:scale-96'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>{grade.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Grade Description - iOS 16 Style */}
            {selectedGradeData && (
              <div className={`mt-5 p-5 rounded-2xl border shadow-sm ${selectedGradeData.colorInactive}`}>
                <p className="text-base font-semibold mb-2">{selectedGradeData.label}</p>
                <p className="text-sm leading-relaxed">{selectedGradeData.description}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-current/20">
                  <span className="text-sm font-medium">Price multiplier:</span>
                  <div className="px-3 py-1.5 bg-white/60 rounded-xl text-sm font-bold">
                    ×{selectedGradeData.multiplier}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price Entry - iOS 16 Style */}
          <div>
            <Label className="text-lg font-semibold text-gray-900 mb-5 block tracking-tight">
              Base Price per m³ (₽)
            </Label>
            
            {/* Preset Price Buttons - iOS 16 Style */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              {PRICE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setBasePrice(preset.toString())}
                  className={`h-16 rounded-2xl text-xl font-bold transition-all duration-200 shadow-sm ${
                    basePrice === preset.toString()
                      ? 'bg-blue-500 text-white shadow-md scale-105'
                      : 'bg-gray-100/80 text-gray-900 hover:bg-gray-200/80 active:scale-96 border border-gray-200/50'
                  }`}
                >
                  {preset}₽
                </button>
              ))}
            </div>
            
            {/* Other Button - iOS 16 Style */}
            <button
              onClick={() => setIsKeypadOpen(true)}
              className="w-full h-14 rounded-2xl bg-gray-100/80 border border-gray-200/50 text-base font-semibold text-gray-700 hover:bg-gray-200/80 transition-all duration-200 active:scale-98 flex items-center justify-center gap-3"
            >
              <Calculator className="w-5 h-5" />
              Other {basePrice && !PRICE_PRESETS.includes(parseFloat(basePrice)) ? `(${basePrice}₽)` : ''}
            </button>

            {/* Current Price Display - iOS 16 Style */}
            {basePrice && (
              <div className="mt-5 p-5 bg-blue-50/80 rounded-2xl border border-blue-200/50 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-700">Base price:</span>
                  <span className="font-bold text-blue-900">{basePrice}₽/m³</span>
                </div>
                {selectedGradeData && selectedGradeData.multiplier !== 1.0 && (
                  <div className="flex items-center justify-between pt-3 border-t border-blue-200/50">
                    <span className="text-sm font-medium text-blue-700">After grade adjustment:</span>
                    <span className="font-bold text-blue-600">{finalPrice.toFixed(2)}₽/m³</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary Card - iOS 16 Style */}
          {volume > 0 && basePrice && selectedGrade && (
            <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl p-6 border-2 border-green-200/50 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-700">Volume:</span>
                  <span className="font-bold text-green-900">{formatVolume(volume)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-700">Final price:</span>
                  <span className="font-bold text-green-900">{finalPrice.toFixed(2)}₽/m³</span>
                </div>
                
                <div className="border-t border-green-200/50 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-green-900 text-lg">Total Value:</span>
                    </div>
                    <span className="text-2xl font-bold text-green-900 tracking-tight">
                      {total.toFixed(2)}₽
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Next Button - iOS 16 Style */}
          <button
            onClick={handleNext}
            disabled={!selectedGrade || !basePrice}
            className="w-full h-16 rounded-2xl bg-blue-500 text-white text-lg font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-98 shadow-lg mt-8"
          >
            Next
          </button>
        </div>

        {/* Price Keypad Modal */}
        <NumericKeypadModal
          isOpen={isKeypadOpen}
          onClose={() => setIsKeypadOpen(false)}
          onConfirm={handleKeypadConfirm}
          title="Enter Price"
          unit="₽/m³"
          min={0}
          max={50000}
          initialValue={basePrice}
        />
      </div>
    </TooltipProvider>
  );
}