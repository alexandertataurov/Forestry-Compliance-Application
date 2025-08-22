import type { Meta, StoryObj } from '@storybook/react';
import { 
  Home, 
  Calculator, 
  Database, 
  Send, 
  BarChart3, 
  Settings as SettingsIcon,
  Plus,
  ChevronLeft,
  MoreHorizontal,
  Wifi,
  WifiOff
} from 'lucide-react';
import { NavigationBar } from '../components/ui/navigation';
import { TabBar, type TabItem } from '../components/ui/tab-bar';
import { FloatingActionButton } from '../components/ui/floating-action-button';
import { ConnectionStatus } from '../components/ui/connection-status';

const meta: Meta<typeof NavigationBar> = {
  title: 'UI/Navigation',
  component: NavigationBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Navigation components for iOS-style app interface with accessibility features and design token integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'transparent', 'solid'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
    },
    showBackButton: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Navigation Bar Stories
export const NavigationBarDefault: Story = {
  args: {
    title: 'Главная',
    showBackButton: false,
  },
};

export const NavigationBarWithBackButton: Story = {
  args: {
    title: 'Расчёт объёма',
    showBackButton: true,
    onBack: () => console.log('Back button clicked'),
  },
};

export const NavigationBarVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <NavigationBar 
        title="Default Variant" 
        variant="default" 
        className="mb-4"
      />
      <NavigationBar 
        title="Transparent Variant" 
        variant="transparent" 
        className="mb-4"
      />
      <NavigationBar 
        title="Solid Variant" 
        variant="solid" 
        className="mb-4"
      />
    </div>
  ),
};

export const NavigationBarSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <NavigationBar 
        title="Small Size" 
        size="sm" 
        className="mb-4"
      />
      <NavigationBar 
        title="Default Size" 
        size="default" 
        className="mb-4"
      />
      <NavigationBar 
        title="Large Size" 
        size="lg" 
        className="mb-4"
      />
    </div>
  ),
};

export const NavigationBarWithCustomContent: Story = {
  args: {
    title: 'Custom Content',
    leftContent: (
      <button className="text-brand-primary text-label font-label">
        Cancel
      </button>
    ),
    rightContent: (
      <button className="text-brand-primary text-label font-label">
        Save
      </button>
    ),
  },
};

// Tab Bar Stories
const tabItems: TabItem[] = [
  { id: 'dashboard', label: 'Главная', icon: Home },
  { id: 'calculator', label: 'Расчёт', icon: Calculator },
  { id: 'data', label: 'Данные', icon: Database },
  { id: 'lesegais', label: 'ЕГАИС', icon: Send },
  { id: 'analytics', label: 'Анализ', icon: BarChart3 },
  { id: 'settings', label: 'Настройки', icon: SettingsIcon },
];

export const TabBarDefault: Story = {
  render: () => (
    <div className="h-96 relative">
      <TabBar 
        items={tabItems}
        activeTab="dashboard"
        onTabChange={(tabId) => console.log('Tab changed to:', tabId)}
        className="absolute bottom-0 left-0 right-0"
      />
    </div>
  ),
};

export const TabBarVariants: Story = {
  render: () => (
    <div className="h-96 relative space-y-4">
      <TabBar 
        items={tabItems.slice(0, 3)}
        activeTab="dashboard"
        onTabChange={(tabId) => console.log('Tab changed to:', tabId)}
        variant="default"
        className="absolute bottom-0 left-0 right-0"
      />
      <TabBar 
        items={tabItems.slice(0, 3)}
        activeTab="calculator"
        onTabChange={(tabId) => console.log('Tab changed to:', tabId)}
        variant="solid"
        className="absolute bottom-24 left-0 right-0"
      />
      <TabBar 
        items={tabItems.slice(0, 3)}
        activeTab="data"
        onTabChange={(tabId) => console.log('Tab changed to:', tabId)}
        variant="transparent"
        className="absolute bottom-48 left-0 right-0"
      />
    </div>
  ),
};

export const TabBarWithDisabledItems: Story = {
  render: () => (
    <div className="h-96 relative">
      <TabBar 
        items={[
          ...tabItems.slice(0, 2),
          { ...tabItems[2], disabled: true },
          ...tabItems.slice(3)
        ]}
        activeTab="dashboard"
        onTabChange={(tabId) => console.log('Tab changed to:', tabId)}
        className="absolute bottom-0 left-0 right-0"
      />
    </div>
  ),
};

export const TabBarVisibility: Story = {
  render: () => (
    <div className="h-96 relative">
      <TabBar 
        items={tabItems}
        activeTab="dashboard"
        onTabChange={(tabId) => console.log('Tab changed to:', tabId)}
        visible={true}
        className="absolute bottom-0 left-0 right-0"
      />
      <TabBar 
        items={tabItems}
        activeTab="calculator"
        onTabChange={(tabId) => console.log('Tab changed to:', tabId)}
        visible={false}
        className="absolute bottom-24 left-0 right-0"
      />
    </div>
  ),
};

// Floating Action Button Stories
export const FloatingActionButtonDefault: Story = {
  render: () => (
    <div className="h-96 relative">
      <FloatingActionButton 
        onClick={() => console.log('FAB clicked')}
        className="absolute bottom-24 right-md"
      />
    </div>
  ),
};

export const FloatingActionButtonVariants: Story = {
  render: () => (
    <div className="h-96 relative">
      <FloatingActionButton 
        variant="primary"
        className="absolute bottom-24 right-md"
      />
      <FloatingActionButton 
        variant="secondary"
        className="absolute bottom-24 right-32"
      />
      <FloatingActionButton 
        variant="tertiary"
        className="absolute bottom-24 right-56"
      />
      <FloatingActionButton 
        variant="surface"
        className="absolute bottom-24 right-80"
      />
    </div>
  ),
};

export const FloatingActionButtonSizes: Story = {
  render: () => (
    <div className="h-96 relative">
      <FloatingActionButton 
        size="sm"
        className="absolute bottom-24 right-md"
      />
      <FloatingActionButton 
        size="default"
        className="absolute bottom-24 right-32"
      />
      <FloatingActionButton 
        size="lg"
        className="absolute bottom-24 right-56"
      />
    </div>
  ),
};

export const FloatingActionButtonPositions: Story = {
  render: () => (
    <div className="h-96 relative">
      <FloatingActionButton 
        position="bottom-right"
        className="absolute"
      />
      <FloatingActionButton 
        position="bottom-left"
        className="absolute"
      />
      <FloatingActionButton 
        position="bottom-center"
        className="absolute"
      />
      <FloatingActionButton 
        position="top-right"
        className="absolute"
      />
      <FloatingActionButton 
        position="top-left"
        className="absolute"
      />
      <FloatingActionButton 
        position="top-center"
        className="absolute"
      />
    </div>
  ),
};

// Connection Status Stories
export const ConnectionStatusDefault: Story = {
  render: () => (
    <div className="space-y-4">
      <ConnectionStatus isOnline={true} />
      <ConnectionStatus isOnline={false} />
    </div>
  ),
};

export const ConnectionStatusWithSync: Story = {
  render: () => (
    <div className="space-y-4">
      <ConnectionStatus isOnline={true} pendingSync={5} />
      <ConnectionStatus isOnline={true} pendingSync={0} />
      <ConnectionStatus isOnline={false} pendingSync={3} />
    </div>
  ),
};

export const ConnectionStatusVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <ConnectionStatus 
        isOnline={true} 
        variant="compact" 
        pendingSync={2}
      />
      <ConnectionStatus 
        isOnline={true} 
        variant="default" 
        pendingSync={2}
      />
      <ConnectionStatus 
        isOnline={true} 
        variant="detailed" 
        pendingSync={2}
        showText={true}
      />
    </div>
  ),
};

export const ConnectionStatusSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <ConnectionStatus 
        isOnline={true} 
        size="sm" 
        pendingSync={1}
      />
      <ConnectionStatus 
        isOnline={true} 
        size="default" 
        pendingSync={1}
      />
      <ConnectionStatus 
        isOnline={true} 
        size="lg" 
        pendingSync={1}
      />
    </div>
  ),
};

export const ConnectionStatusWithText: Story = {
  render: () => (
    <div className="space-y-4">
      <ConnectionStatus 
        isOnline={true} 
        showText={true}
        statusText={{ online: "Подключено", offline: "Отключено" }}
      />
      <ConnectionStatus 
        isOnline={false} 
        showText={true}
        statusText={{ online: "Подключено", offline: "Отключено" }}
      />
    </div>
  ),
};

// Integration Example
export const NavigationIntegration: Story = {
  render: () => (
    <div className="h-screen relative bg-surface-bg">
      <NavigationBar 
        title="Главная"
        rightContent={
          <ConnectionStatus 
            isOnline={true} 
            pendingSync={3}
            variant="compact"
          />
        }
      />
      
      <div className="pt-16 pb-20 px-md">
        <div className="space-y-md">
          <h2 className="text-headline font-headline text-surface-on-surface">
            Основной контент
          </h2>
          <p className="text-body font-body text-surface-on-variant">
            Здесь отображается основной контент приложения с навигационными компонентами.
          </p>
        </div>
      </div>
      
      <FloatingActionButton 
        onClick={() => console.log('New action')}
        label="Новое действие"
      />
      
      <TabBar 
        items={tabItems}
        activeTab="dashboard"
        onTabChange={(tabId) => console.log('Tab changed to:', tabId)}
        className="absolute bottom-0 left-0 right-0"
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
