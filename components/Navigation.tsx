import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Badge } from './ui/badge';
import { 
  Home,
  Calculator, 
  Database, 
  Send, 
  BarChart3, 
  Settings, 
  Menu,
  MapPin,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOnline?: boolean;
  pendingSync?: number;
}

export function Navigation({ activeSection, onSectionChange, isOnline = true, pendingSync = 0 }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calculator', label: 'Volume Calculator', icon: Calculator },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'lesegais', label: 'LesEGAIS Integration', icon: Send },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (itemId: string) => {
    onSectionChange(itemId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-semibold">Forestry Compliance</h1>
          <p className="text-sm text-slate-400 mt-1">GOST 2708-75</p>
        </div>
        
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-2 text-sm">
            {isOnline ? (
              <><Wifi className="w-4 h-4 text-green-400" /> Online</>
            ) : (
              <><WifiOff className="w-4 h-4 text-red-400" /> Offline</>
            )}
          </div>
          {pendingSync > 0 && (
            <Badge variant="secondary" className="mt-2">
              {pendingSync} pending sync
            </Badge>
          )}
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Button
                    variant={activeSection === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => onSectionChange(item.id)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="w-3 h-3" />
            <span>Field Operations Mode</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <Clock className="w-3 h-3" />
            <span>{new Date().toLocaleString('ru-RU')}</span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
        <div>
          <h1 className="font-semibold">Forestry Compliance</h1>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            {isOnline ? (
              <><Wifi className="w-3 h-3 text-green-400" /> Online</>
            ) : (
              <><WifiOff className="w-3 h-3 text-red-400" /> Offline</>
            )}
            {pendingSync > 0 && (
              <Badge variant="secondary" className="text-xs py-0">
                {pendingSync} sync
              </Badge>
            )}
          </div>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-slate-900 text-white border-slate-700">
            <SheetHeader>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Access different sections of the forestry compliance application
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <nav>
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <Button
                          variant={activeSection === item.id ? "secondary" : "ghost"}
                          className="w-full justify-start text-left"
                          onClick={() => handleItemClick(item.id)}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.label}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}