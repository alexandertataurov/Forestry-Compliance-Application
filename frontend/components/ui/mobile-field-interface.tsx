import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { useFieldOperations } from './use-mobile';
import { Button } from './button';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Input } from './input';
import { Badge } from './badge';
import { Progress } from './progress';
import { StatusBadge } from './status-badge';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { FloatingActionButton } from './floating-action-button';
import { 
  MapPin, 
  Camera, 
  Gps, 
  Wifi, 
  WifiOff, 
  Battery, 
  Signal,
  Menu,
  X,
  Plus,
  Save,
  Upload,
  Download
} from 'lucide-react';

// Mobile field interface variants
const mobileFieldInterfaceVariants = cva(
  "fixed inset-0 z-50 bg-background safe-area-padding overflow-hidden",
  {
    variants: {
      mode: {
        default: "bg-background",
        dark: "bg-background dark",
        highContrast: "bg-background border-2 border-foreground",
      },
      orientation: {
        portrait: "flex flex-col",
        landscape: "flex flex-row",
      },
    },
    defaultVariants: {
      mode: "default",
      orientation: "portrait",
    },
  }
);

export interface MobileFieldInterfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mobileFieldInterfaceVariants> {
  onClose?: () => void;
  onSave?: () => void;
  onUpload?: () => void;
  onDownload?: () => void;
  isOnline?: boolean;
  batteryLevel?: number;
  signalStrength?: number;
  gpsAccuracy?: number;
  currentLocation?: { lat: number; lng: number };
  dataCount?: number;
  syncStatus?: 'synced' | 'pending' | 'error';
}

// Mobile field header component
const MobileFieldHeader: React.FC<{
  onClose?: () => void;
  onMenu?: () => void;
  title: string;
  isOnline?: boolean;
  batteryLevel?: number;
  signalStrength?: number;
}> = ({ onClose, onMenu, title, isOnline, batteryLevel, signalStrength }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        {onMenu && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenu}
            className="touch-target"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Connection Status */}
        <div className="flex items-center gap-1">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
        </div>
        
        {/* Signal Strength */}
        {signalStrength !== undefined && (
          <div className="flex items-center gap-1">
            <Signal className="h-4 w-4" />
            <span className="text-xs">{signalStrength}%</span>
          </div>
        )}
        
        {/* Battery Level */}
        {batteryLevel !== undefined && (
          <div className="flex items-center gap-1">
            <Battery className="h-4 w-4" />
            <span className="text-xs">{batteryLevel}%</span>
          </div>
        )}
        
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="touch-target"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

// GPS status component
const GPSStatus: React.FC<{
  accuracy?: number;
  location?: { lat: number; lng: number };
  onCaptureLocation?: () => void;
}> = ({ accuracy, location, onCaptureLocation }) => {
  return (
    <Card className="m-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Gps className="h-4 w-4" />
          GPS Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {location ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Latitude:</span>
              <span className="font-mono">{location.lat.toFixed(6)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Longitude:</span>
              <span className="font-mono">{location.lng.toFixed(6)}</span>
            </div>
            {accuracy && (
              <div className="flex justify-between text-sm">
                <span>Accuracy:</span>
                <span>{accuracy}m</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            No GPS location available
          </div>
        )}
        
        {onCaptureLocation && (
          <Button
            onClick={onCaptureLocation}
            className="w-full touch-target"
            variant="outline"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Capture Location
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Data entry form component
const MobileDataEntryForm: React.FC<{
  onSubmit?: (data: any) => void;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea';
    required?: boolean;
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
  }>;
}> = ({ onSubmit, fields }) => {
  const [formData, setFormData] = React.useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {field.type === 'text' && (
            <Input
              type="text"
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              className="touch-target"
            />
          )}
          
          {field.type === 'number' && (
            <Input
              type="number"
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              className="touch-target"
            />
          )}
          
          {field.type === 'textarea' && (
            <textarea
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              className="w-full min-h-20 p-3 border border-input rounded-md resize-none touch-target"
            />
          )}
          
          {field.type === 'select' && field.options && (
            <select
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              className="w-full p-3 border border-input rounded-md touch-target"
            >
              <option value="">{field.placeholder || 'Select option'}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
      
      <Button type="submit" className="w-full touch-target">
        <Save className="h-4 w-4 mr-2" />
        Save Data
      </Button>
    </form>
  );
};

// Sync status component
const SyncStatus: React.FC<{
  status?: 'synced' | 'pending' | 'error';
  dataCount?: number;
  onSync?: () => void;
}> = ({ status, dataCount, onSync }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'synced': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'synced': return 'Synced';
      case 'pending': return 'Pending';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="m-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Sync Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Status:</span>
          <Badge variant={status === 'error' ? 'destructive' : 'default'}>
            {getStatusText()}
          </Badge>
        </div>
        
        {dataCount !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm">Data Count:</span>
            <span className="text-sm font-medium">{dataCount}</span>
          </div>
        )}
        
        {onSync && (
          <Button
            onClick={onSync}
            className="w-full touch-target"
            variant="outline"
            disabled={status === 'pending'}
          >
            {status === 'pending' ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                Syncing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Sync Data
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Main mobile field interface component
const MobileFieldInterface = React.forwardRef<HTMLDivElement, MobileFieldInterfaceProps>(
  ({ 
    className, 
    mode, 
    orientation,
    onClose,
    onSave,
    onUpload,
    onDownload,
    isOnline = true,
    batteryLevel,
    signalStrength,
    gpsAccuracy,
    currentLocation,
    dataCount,
    syncStatus,
    children,
    ...props 
  }, ref) => {
    const fieldOps = useFieldOperations();
    
    // Auto-detect orientation
    const detectedOrientation = fieldOps.isLandscape ? 'landscape' : 'portrait';
    const finalOrientation = orientation || detectedOrientation;

    return (
      <div
        ref={ref}
        className={cn(mobileFieldInterfaceVariants({ mode, orientation: finalOrientation, className }))}
        {...props}
      >
        {/* Header */}
        <MobileFieldHeader
          onClose={onClose}
          title="Forestry Field Operations"
          isOnline={isOnline}
          batteryLevel={batteryLevel}
          signalStrength={signalStrength}
        />
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Panel - GPS and Status */}
            <div className="w-full lg:w-1/3 space-y-4">
              <GPSStatus
                accuracy={gpsAccuracy}
                location={currentLocation}
                onCaptureLocation={() => {
                  // GPS capture logic
                  console.log('Capturing GPS location...');
                }}
              />
              
              <SyncStatus
                status={syncStatus}
                dataCount={dataCount}
                onSync={onUpload}
              />
            </div>
            
            {/* Right Panel - Data Entry */}
            <div className="w-full lg:w-2/3">
              <MobileDataEntryForm
                fields={[
                  {
                    name: 'species',
                    label: 'Tree Species',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'pine', label: 'Pine' },
                      { value: 'oak', label: 'Oak' },
                      { value: 'maple', label: 'Maple' },
                      { value: 'birch', label: 'Birch' },
                    ]
                  },
                  {
                    name: 'diameter',
                    label: 'Diameter (cm)',
                    type: 'number',
                    required: true,
                    placeholder: 'Enter diameter'
                  },
                  {
                    name: 'height',
                    label: 'Height (m)',
                    type: 'number',
                    required: true,
                    placeholder: 'Enter height'
                  },
                  {
                    name: 'notes',
                    label: 'Notes',
                    type: 'textarea',
                    placeholder: 'Additional observations...'
                  }
                ]}
                onSubmit={(data) => {
                  console.log('Form data:', data);
                  onSave?.();
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 space-y-3">
          <FloatingActionButton
            onClick={() => {
              // Camera capture logic
              console.log('Opening camera...');
            }}
            className="touch-target"
          >
            <Camera className="h-6 w-6" />
          </FloatingActionButton>
          
          <FloatingActionButton
            onClick={onDownload}
            variant="secondary"
            className="touch-target"
          >
            <Download className="h-6 w-6" />
          </FloatingActionButton>
        </div>
        
        {/* Offline Warning */}
        {!isOnline && (
          <div className="fixed top-20 left-4 right-4 z-50">
            <Alert variant="destructive">
              <AlertTitle>Offline Mode</AlertTitle>
              <AlertDescription>
                You are currently offline. Data will be synced when connection is restored.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    );
  }
);

MobileFieldInterface.displayName = 'MobileFieldInterface';

export { 
  MobileFieldInterface, 
  MobileFieldHeader, 
  GPSStatus, 
  MobileDataEntryForm, 
  SyncStatus,
  mobileFieldInterfaceVariants 
};
