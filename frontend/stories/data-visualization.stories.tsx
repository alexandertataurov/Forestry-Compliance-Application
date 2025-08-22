import type { Meta, StoryObj } from '@storybook/react';
import {
  VolumeTrendChart,
  SpeciesDistributionChart,
  GradeDistributionChart,
  AnalyticsSummary,
  DataTable,
  ProgressIndicator,
  SyncStatus,
  DataProcessingProgress,
  StatusBadge,
  DataValidationStatus,
  QualityRatingBadge,
  ConnectionStatusBadge,
} from '../components/ui';

const meta: Meta = {
  title: 'Data Visualization',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for charts
const volumeTrendData = [
  { date: '2024-01-01', volume: 10.5 },
  { date: '2024-01-02', volume: 15.2 },
  { date: '2024-01-03', volume: 12.8 },
  { date: '2024-01-04', volume: 18.5 },
  { date: '2024-01-05', volume: 14.2 },
  { date: '2024-01-06', volume: 16.8 },
  { date: '2024-01-07', volume: 13.5 },
];

const speciesData = [
  { species: 'Pine', volume: 25.5, count: 10 },
  { species: 'Oak', volume: 18.2, count: 8 },
  { species: 'Maple', volume: 12.8, count: 6 },
  { species: 'Birch', volume: 9.5, count: 4 },
  { species: 'Spruce', volume: 7.2, count: 3 },
];

const gradeData = [
  { grade: 1, volume: 30.5, percentage: 60 },
  { grade: 2, volume: 15.2, percentage: 30 },
  { grade: 3, volume: 5.1, percentage: 10 },
];

const tableData = [
  { id: 1, species: 'Pine', volume: 10.5, grade: 1, date: '2024-01-01' },
  { id: 2, species: 'Oak', volume: 8.2, grade: 2, date: '2024-01-02' },
  { id: 3, species: 'Maple', volume: 6.8, grade: 1, date: '2024-01-03' },
  { id: 4, species: 'Birch', volume: 4.5, grade: 3, date: '2024-01-04' },
  { id: 5, species: 'Spruce', volume: 3.2, grade: 2, date: '2024-01-05' },
];

const tableColumns = [
  { key: 'species', label: 'Species', sortable: true, filterable: true },
  { key: 'volume', label: 'Volume (m³)', sortable: true, filterable: true },
  { key: 'grade', label: 'Grade', sortable: true, filterable: true },
  { key: 'date', label: 'Date', sortable: true, filterable: true },
];

const validationData = [
  { field: 'Species', status: 'valid' as const },
  { field: 'Volume', status: 'valid' as const },
  { field: 'Grade', status: 'warning' as const, message: 'Check value range' },
  { field: 'GPS Coordinates', status: 'invalid' as const, message: 'Invalid format' },
  { field: 'Timestamp', status: 'valid' as const },
];

export const Charts: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-headline font-bold text-surface-onSurface mb-4">Chart Components</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VolumeTrendChart data={volumeTrendData} title="Volume Trends (Last 7 Days)" />
        <SpeciesDistributionChart data={speciesData} title="Species Distribution" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GradeDistributionChart data={gradeData} title="Grade Distribution" />
        <AnalyticsSummary
          totalVolume={150.5}
          totalLogs={25}
          averageVolume={6.02}
          topSpecies="Pine"
        />
      </div>
    </div>
  ),
};

export const DataTableExample: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-headline font-bold text-surface-onSurface mb-4">Data Table</h2>
      <DataTable
        data={tableData}
        columns={tableColumns}
        title="Forestry Data"
        searchable={true}
        pagination={true}
        itemsPerPage={3}
      />
    </div>
  ),
};

export const ProgressIndicators: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-headline font-bold text-surface-onSurface mb-4">Progress Indicators</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressIndicator
          value={75}
          max={100}
          status="loading"
          label="Data Sync"
          description="Syncing 150 records..."
          variant="sync"
        />
        
        <ProgressIndicator
          value={100}
          max={100}
          status="success"
          label="Upload Complete"
          description="All files uploaded successfully"
          variant="upload"
        />
        
        <ProgressIndicator
          value={45}
          max={100}
          status="warning"
          label="Processing"
          description="Processing large dataset..."
          variant="download"
        />
        
        <ProgressIndicator
          value={0}
          max={100}
          status="error"
          label="Failed"
          description="Connection timeout"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SyncStatus
          status="synced"
          lastSync="2024-01-01T10:00:00Z"
          itemsCount={150}
        />
        
        <SyncStatus
          status="syncing"
          itemsCount={25}
        />
        
        <SyncStatus
          status="failed"
          lastSync="2024-01-01T09:30:00Z"
          itemsCount={0}
        />
        
        <SyncStatus
          status="pending"
          itemsCount={10}
        />
      </div>
      
      <DataProcessingProgress
        currentStep={2}
        totalSteps={4}
        stepLabels={['Validate', 'Process', 'Transform', 'Export']}
        currentStepLabel="Processing data transformation..."
      />
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-headline font-bold text-surface-onSurface mb-4">Status Badges</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-title font-semibold text-surface-onSurface mb-3">Basic Status Badges</h3>
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="success" label="Success" />
            <StatusBadge status="error" label="Error" />
            <StatusBadge status="warning" label="Warning" />
            <StatusBadge status="info" label="Info" />
            <StatusBadge status="pending" label="Pending" />
          </div>
        </div>
        
        <div>
          <h3 className="text-title font-semibold text-surface-onSurface mb-3">Variants</h3>
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="success" label="Default" variant="default" />
            <StatusBadge status="success" label="Outline" variant="outline" />
            <StatusBadge status="success" label="Solid" variant="solid" />
          </div>
        </div>
        
        <div>
          <h3 className="text-title font-semibold text-surface-onSurface mb-3">Sizes</h3>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status="success" label="Small" size="sm" />
            <StatusBadge status="success" label="Medium" size="md" />
            <StatusBadge status="success" label="Large" size="lg" />
          </div>
        </div>
      </div>
      
      <DataValidationStatus validations={validationData} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-title font-semibold text-surface-onSurface mb-3">Quality Ratings</h3>
          <div className="space-y-3">
            <QualityRatingBadge rating={5} maxRating={5} />
            <QualityRatingBadge rating={4} maxRating={5} />
            <QualityRatingBadge rating={3} maxRating={5} />
            <QualityRatingBadge rating={2} maxRating={5} />
            <QualityRatingBadge rating={1} maxRating={5} />
          </div>
        </div>
        
        <div>
          <h3 className="text-title font-semibold text-surface-onSurface mb-3">Connection Status</h3>
          <div className="space-y-3">
            <ConnectionStatusBadge isOnline={true} />
            <ConnectionStatusBadge
              isOnline={false}
              lastSeen="2024-01-01T10:00:00Z"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const CompleteDashboard: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-headline font-bold text-surface-onSurface mb-4">Complete Dashboard Example</h2>
      
      {/* Analytics Summary */}
      <AnalyticsSummary
        totalVolume={150.5}
        totalLogs={25}
        averageVolume={6.02}
        topSpecies="Pine"
      />
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VolumeTrendChart data={volumeTrendData} title="Volume Trends" />
        <SpeciesDistributionChart data={speciesData} title="Species Distribution" />
      </div>
      
      {/* Status and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SyncStatus
          status="synced"
          lastSync="2024-01-01T10:00:00Z"
          itemsCount={150}
        />
        <ProgressIndicator
          value={85}
          max={100}
          status="loading"
          label="Data Processing"
          description="Processing 85% complete"
        />
      </div>
      
      {/* Data Table */}
      <DataTable
        data={tableData}
        columns={tableColumns}
        title="Recent Calculations"
        searchable={true}
        pagination={true}
        itemsPerPage={5}
      />
      
      {/* Validation Status */}
      <DataValidationStatus validations={validationData} />
    </div>
  ),
};
