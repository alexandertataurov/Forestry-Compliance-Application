import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Delete, Check } from 'lucide-react';

interface NumericKeypadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  initialValue?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumericKeypadModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  initialValue = '',
  unit = '',
  min,
  max,
  step = 0.1
}: NumericKeypadModalProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setValue(prev => prev.slice(0, -1));
    } else if (key === '.' && !value.includes('.')) {
      setValue(prev => prev + key);
    } else if (key !== '.') {
      setValue(prev => prev + key);
    }
  };

  const handleConfirm = () => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && value.trim() !== '') {
      if (min !== undefined && numValue < min) return;
      if (max !== undefined && numValue > max) return;
      onConfirm(value);
      onClose();
    }
  };

  const isValid = () => {
    if (value.trim() === '') return false;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;
    if (min !== undefined && numValue < min) return false;
    if (max !== undefined && numValue > max) return false;
    return true;
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'backspace']
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[320px] mx-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Enter a numeric value{unit ? ` in ${unit}` : ''}
            {min !== undefined && max !== undefined ? ` (Range: ${min} - ${max})` : ''}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Display */}
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-mono font-semibold text-gray-900">
              {value || '0'}{unit}
            </div>
            {min !== undefined && max !== undefined && (
              <div className="text-sm text-gray-500 mt-1">
                Range: {min} - {max}{unit}
              </div>
            )}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {keys.flat().map((key) => (
              <Button
                key={key}
                variant={key === 'backspace' ? 'outline' : 'secondary'}
                className="h-12 text-lg font-semibold"
                onClick={() => handleKeyPress(key)}
                disabled={key === '.' && value.includes('.')}
              >
                {key === 'backspace' ? (
                  <Delete className="w-5 h-5" />
                ) : (
                  key
                )}
              </Button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              className="flex-1"
              disabled={!isValid()}
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}