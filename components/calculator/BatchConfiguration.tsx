import { useState, useEffect } from 'react';
import { 
  Ruler, 
  MapPin, 
  Truck, 
  Calendar, 
  Camera,
  FileText,
  ChevronRight,
  Plus,
  Minus,
  User,
  Hash,
  Clock
} from 'lucide-react';

interface BatchConfigurationProps {
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
  onLengthChange: (length: string) => void;
  onLocationChange: (location: any) => void;
  onTransportChange: (transport: any) => void;
  onBatchChange: (batch: any) => void;
  onDocumentsChange: (documents: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BatchConfiguration({
  length,
  location,
  transport,
  batch,
  documents,
  onLengthChange,
  onLocationChange,
  onTransportChange,
  onBatchChange,
  onDocumentsChange,
  onNext,
  onBack
}: BatchConfigurationProps) {
  const [gpsLoading, setGpsLoading] = useState(false);

  const transportTypes = [
    { id: 'truck', name: 'Автомобиль', icon: '🚛' },
    { id: 'rail', name: 'Железная дорога', icon: '🚂' },
    { id: 'ship', name: 'Водный транспорт', icon: '🚢' },
    { id: 'other', name: 'Другое', icon: '📦' }
  ];

  const adjustLength = (increment: number) => {
    const current = parseFloat(length) || 0;
    const newValue = Math.max(0, current + increment);
    onLengthChange(newValue.toString());
  };

  const getCurrentGPS = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationChange({
            ...location,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
          setGpsLoading(false);
        },
        (error) => {
          console.error('GPS Error:', error);
          setGpsLoading(false);
          alert('Не удалось получить GPS координаты');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setGpsLoading(false);
      alert('GPS не поддерживается');
    }
  };

  const generateBatchNumber = () => {
    const date = new Date();
    const batchNum = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    onBatchChange({ ...batch, number: batchNum });
  };

  const setQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    onBatchChange({ ...batch, date: date.toISOString().split('T')[0] });
  };

  useEffect(() => {
    if (!batch.number) {
      generateBatchNumber();
    }
    if (!batch.date) {
      setQuickDate(0); // Today
    }
  }, []);

  const canProceed = length && parseFloat(length) > 0;

  return (
    <div>
      {/* Length Configuration */}
      <div className="ios-section-header">Длина брёвен (одинаковая для партии)</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#FF9500' }}
            >
              <Ruler className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Длина (м)</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => adjustLength(-0.5)}
              className="ios-button"
              style={{ 
                width: '32px', 
                height: '32px', 
                padding: '0',
                background: 'var(--ios-quaternary-system-fill)',
                color: 'var(--ios-blue)',
                fontSize: '18px',
                borderRadius: '16px'
              }}
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={length}
              onChange={(e) => onLengthChange(e.target.value)}
              placeholder="0"
              step="0.1"
              style={{
                width: '80px',
                padding: '8px 12px',
                borderRadius: 'var(--ios-radius-md)',
                border: '1px solid var(--ios-separator)',
                background: 'var(--ios-secondary-system-grouped-background)',
                color: 'var(--ios-label)',
                fontSize: '17px',
                textAlign: 'left'
              }}
            />
            <button
              onClick={() => adjustLength(0.5)}
              className="ios-button"
              style={{ 
                width: '32px', 
                height: '32px', 
                padding: '0',
                background: 'var(--ios-blue)',
                color: 'white',
                fontSize: '18px',
                borderRadius: '16px'
              }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="ios-section-header">Местоположение</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: location.coordinates ? '#34C759' : '#8E8E93' }}
            >
              <MapPin className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">
                {location.coordinates ? 'GPS координаты получены' : 'GPS координаты'}
              </div>
              <div className="ios-list-item-subtitle">
                {location.coordinates 
                  ? `${location.coordinates.lat.toFixed(6)}, ${location.coordinates.lng.toFixed(6)}`
                  : 'Нажмите для получения координат'
                }
              </div>
            </div>
          </div>
          <button
            onClick={getCurrentGPS}
            disabled={gpsLoading}
            style={{
              background: 'none',
              border: 'none',
              color: '#007AFF',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: 'var(--ios-radius-md)',
              opacity: gpsLoading ? 0.3 : 1
            }}
          >
            {gpsLoading ? 'Получение...' : 'Обновить'}
          </button>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#5856D6' }}
            >
              <MapPin className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text" style={{ flex: 1 }}>
              <div className="ios-list-item-title">Лесничество</div>
              <input
                type="text"
                value={location.forest}
                onChange={(e) => onLocationChange({ ...location, forest: e.target.value })}
                placeholder="Название лесничества"
                style={{
                  width: '100%',
                  padding: '8px 0',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--ios-label)',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#AF52DE' }}
            >
              <Hash className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text" style={{ flex: 1 }}>
              <div className="ios-list-item-title">Квартал/Выдел</div>
              <input
                type="text"
                value={location.plot}
                onChange={(e) => onLocationChange({ ...location, plot: e.target.value })}
                placeholder="Номер квартала и выдела"
                style={{
                  width: '100%',
                  padding: '8px 0',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--ios-label)',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transport Information */}
      <div className="ios-section-header">Транспорт</div>
      <div className="ios-list">
        {transportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onTransportChange({ ...transport, type: type.id })}
            className="ios-list-item"
            style={{ border: 'none', background: 'transparent', width: '100%' }}
          >
            <div className="ios-list-item-content">
              <div 
                className="ios-list-item-icon"
                style={{ backgroundColor: '#5AC8FA' }}
              >
                <Truck className="w-4 h-4" />
              </div>
              <div className="ios-list-item-text">
                <div className="ios-list-item-title">{type.icon} {type.name}</div>
              </div>
            </div>
            {transport.type === type.id && (
              <div className="ios-list-item-accessory">
                <div style={{ color: '#007AFF', fontSize: '17px', fontWeight: '600' }}>✓</div>
              </div>
            )}
          </button>
        ))}

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#FF9500' }}
            >
              <Hash className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text" style={{ flex: 1 }}>
              <div className="ios-list-item-title">Номер транспорта</div>
              <input
                type="text"
                value={transport.plateNumber}
                onChange={(e) => onTransportChange({ ...transport, plateNumber: e.target.value })}
                placeholder="A123BC77"
                style={{
                  width: '100%',
                  padding: '8px 0',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--ios-label)',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#007AFF' }}
            >
              <User className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text" style={{ flex: 1 }}>
              <div className="ios-list-item-title">Водитель</div>
              <input
                type="text"
                value={transport.driverName}
                onChange={(e) => onTransportChange({ ...transport, driverName: e.target.value })}
                placeholder="ФИО водителя"
                style={{
                  width: '100%',
                  padding: '8px 0',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--ios-label)',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Batch Information */}
      <div className="ios-section-header">Информация о партии</div>
      <div className="ios-list">
        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#34C759' }}
            >
              <Hash className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Номер партии</div>
              <div className="ios-list-item-subtitle">{batch.number}</div>
            </div>
          </div>
          <button
            onClick={generateBatchNumber}
            style={{
              background: 'none',
              border: 'none',
              color: '#007AFF',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: 'var(--ios-radius-md)'
            }}
          >
            Новый
          </button>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#FF9500' }}
            >
              <Calendar className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Дата</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setQuickDate(0)}
              style={{
                background: batch.date === new Date().toISOString().split('T')[0] ? 'var(--ios-blue)' : 'var(--ios-quaternary-system-fill)',
                color: batch.date === new Date().toISOString().split('T')[0] ? 'white' : 'var(--ios-blue)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--ios-radius-md)',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              Сегодня
            </button>
            <input
              type="date"
              value={batch.date}
              onChange={(e) => onBatchChange({ ...batch, date: e.target.value })}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--ios-radius-md)',
                border: '1px solid var(--ios-separator)',
                background: 'var(--ios-secondary-system-grouped-background)',
                color: 'var(--ios-label)',
                fontSize: '15px'
              }}
            />
          </div>
        </div>

        <div className="ios-list-item">
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#5856D6' }}
            >
              <User className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text" style={{ flex: 1 }}>
              <div className="ios-list-item-title">Оператор</div>
              <input
                type="text"
                value={batch.operator}
                onChange={(e) => onBatchChange({ ...batch, operator: e.target.value })}
                placeholder="ФИО оператора"
                style={{
                  width: '100%',
                  padding: '8px 0',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--ios-label)',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Document Scanning */}
      <div className="ios-section-header">Документы</div>
      <div className="ios-list">
        <button
          className="ios-list-item"
          style={{ border: 'none', background: 'transparent', width: '100%' }}
        >
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#FF2D92' }}
            >
              <Camera className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Сканировать документ</div>
              <div className="ios-list-item-subtitle">
                {documents.length > 0 ? `${documents.length} документов` : 'Добавить документы'}
              </div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        <button
          className="ios-list-item"
          style={{ border: 'none', background: 'transparent', width: '100%' }}
        >
          <div className="ios-list-item-content">
            <div 
              className="ios-list-item-icon"
              style={{ backgroundColor: '#34C759' }}
            >
              <FileText className="w-4 h-4" />
            </div>
            <div className="ios-list-item-text">
              <div className="ios-list-item-title">Лесорубочный билет</div>
              <div className="ios-list-item-subtitle">Сканировать или ввести номер</div>
            </div>
          </div>
          <div className="ios-list-item-accessory">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Navigation Buttons */}
      <div style={{ padding: 'var(--ios-spacing-md)', display: 'flex', gap: 'var(--ios-spacing-md)' }}>
        <button
          onClick={onBack}
          className="ios-button ios-button-secondary"
          style={{ flex: 1 }}
        >
          Назад
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="ios-button"
          style={{ 
            flex: 2,
            opacity: !canProceed ? 0.3 : 1
          }}
        >
          <span style={{ marginRight: '8px' }}>К расчётам</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}