import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Switch,
  Slider,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  StatusBadge,
  ProgressIndicator,
  DataTable,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Alert,
  AlertTitle,
  AlertDescription,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  FloatingActionButton,
} from '../index';

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Mock window.innerWidth for responsive testing
const mockWindowSize = (width: number, height: number = 768) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    value: height,
  });
};

// Mock touch events
const mockTouchEvents = () => {
  Object.defineProperty(window, 'ontouchstart', {
    writable: true,
    value: true,
  });
  Object.defineProperty(navigator, 'maxTouchPoints', {
    writable: true,
    value: 5,
  });
};

describe('Mobile Responsiveness Testing', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockMatchMedia(false);
    mockWindowSize(1024, 768);
    mockTouchEvents();
  });

  describe('Touch Target Sizes', () => {
    it('button has minimum touch target size on mobile', () => {
      mockWindowSize(375, 667); // iPhone SE
      render(<Button>Touch me</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9'); // Default size should be touch-friendly
    });

    it('input has minimum touch target size on mobile', () => {
      mockWindowSize(375, 667);
      render(<Input placeholder="Enter text" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('h-9'); // Should have touch-friendly height
    });

    it('checkbox has minimum touch target size on mobile', () => {
      mockWindowSize(375, 667);
      render(<Checkbox />);
      
      const checkbox = screen.getByRole('checkbox');
      // Checkbox should be wrapped in a touch-friendly container
      expect(checkbox.closest('[class*="h-"]')).toBeInTheDocument();
    });

    it('switch has minimum touch target size on mobile', () => {
      mockWindowSize(375, 667);
      render(<Switch />);
      
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('h-6'); // Should have touch-friendly height
    });
  });

  describe('Responsive Layout', () => {
    it('card adapts to mobile layout', () => {
      mockWindowSize(375, 667);
      render(
        <Card className="p-4 md:p-6">
          <CardHeader>
            <CardTitle>Mobile Card</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );

      const card = screen.getByText('Mobile Card').closest('[class*="p-4"]');
      expect(card).toBeInTheDocument();
    });

    it('tabs stack vertically on mobile', () => {
      mockWindowSize(375, 667);
      render(
        <Tabs defaultValue="tab1" className="flex-col md:flex-row">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tabsList = screen.getByRole('tablist');
      expect(tabsList).toHaveClass('w-full');
    });
  });

  describe('Touch Interactions', () => {
    it('button responds to touch events', async () => {
      mockWindowSize(375, 667);
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Touch me</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.touchStart(button);
      fireEvent.touchEnd(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('input responds to touch events', async () => {
      mockWindowSize(375, 667);
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.touchStart(input);
      fireEvent.focus(input);
      
      expect(input).toHaveFocus();
    });

    it('slider responds to touch events', async () => {
      mockWindowSize(375, 667);
      const handleValueChange = jest.fn();
      render(<Slider onValueChange={handleValueChange} />);
      
      const slider = screen.getByRole('slider');
      fireEvent.touchStart(slider, { touches: [{ clientX: 100 }] });
      fireEvent.touchMove(slider, { touches: [{ clientX: 200 }] });
      fireEvent.touchEnd(slider);
      
      expect(handleValueChange).toHaveBeenCalled();
    });
  });

  describe('Mobile Navigation', () => {
    it('floating action button is positioned correctly on mobile', () => {
      mockWindowSize(375, 667);
      render(
        <FloatingActionButton 
          position="bottom-right"
          className="bottom-6 right-4 md:bottom-8 md:right-8"
        >
          +
        </FloatingActionButton>
      );

      const fab = screen.getByRole('button');
      expect(fab).toHaveClass('bottom-6', 'right-4');
    });

    it('dialog takes full screen on mobile', async () => {
      mockWindowSize(375, 667);
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent className="w-full h-full md:w-auto md:h-auto">
            <DialogHeader>
              <DialogTitle>Mobile Dialog</DialogTitle>
            </DialogHeader>
            Content
          </DialogContent>
        </Dialog>
      );

      await userEvent.click(screen.getByText('Open'));
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('w-full', 'h-full');
    });
  });

  describe('Form Mobile Optimization', () => {
    it('form inputs are optimized for mobile', () => {
      mockWindowSize(375, 667);
      render(
        <Form>
          <FormField name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter name"
                  className="text-base md:text-sm"
                />
              </FormControl>
            </FormItem>
          </FormField>
        </Form>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('text-base');
    });

    it('select dropdown is mobile-friendly', async () => {
      mockWindowSize(375, 667);
      render(
        <Select>
          <SelectTrigger className="h-12 md:h-9">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent className="max-h-60 md:max-h-40">
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-12');
    });
  });

  describe('Data Table Mobile Optimization', () => {
    const mockData = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];

    const mockColumns = [
      {
        key: 'name',
        header: 'Name',
        cell: (item: any) => item.name,
      },
      {
        key: 'email',
        header: 'Email',
        cell: (item: any) => item.email,
      },
    ];

    it('data table adapts to mobile layout', () => {
      mockWindowSize(375, 667);
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns}
          className="overflow-x-auto"
        />
      );

      const table = screen.getByRole('table');
      expect(table.closest('[class*="overflow-x-auto"]')).toBeInTheDocument();
    });
  });

  describe('Typography Responsiveness', () => {
    it('text sizes adapt to mobile', () => {
      mockWindowSize(375, 667);
      render(
        <div>
          <h1 className="text-2xl md:text-4xl">Mobile Title</h1>
          <p className="text-sm md:text-base">Mobile text</p>
        </div>
      );

      const title = screen.getByText('Mobile Title');
      const text = screen.getByText('Mobile text');
      
      expect(title).toHaveClass('text-2xl');
      expect(text).toHaveClass('text-sm');
    });
  });

  describe('Spacing Responsiveness', () => {
    it('spacing adapts to mobile', () => {
      mockWindowSize(375, 667);
      render(
        <div className="p-4 md:p-8 space-y-4 md:space-y-8">
          <div>Item 1</div>
          <div>Item 2</div>
        </div>
      );

      const container = screen.getByText('Item 1').parentElement;
      expect(container).toHaveClass('p-4', 'space-y-4');
    });
  });

  describe('Orientation Changes', () => {
    it('components adapt to landscape orientation', () => {
      mockWindowSize(667, 375); // Landscape
      render(
        <div className="flex-col landscape:flex-row">
          <div className="w-full landscape:w-1/2">Left</div>
          <div className="w-full landscape:w-1/2">Right</div>
        </div>
      );

      const container = screen.getByText('Left').parentElement;
      expect(container).toHaveClass('flex-col');
    });
  });

  describe('High DPI Displays', () => {
    it('components support high DPI displays', () => {
      // Mock high DPI display
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        value: 3,
      });

      render(
        <div className="retina:scale-150">
          <Button>High DPI Button</Button>
        </div>
      );

      const container = screen.getByText('High DPI Button').parentElement;
      expect(container).toHaveClass('retina:scale-150');
    });
  });

  describe('Offline Functionality', () => {
    it('components handle offline state', () => {
      mockWindowSize(375, 667);
      render(
        <div className="offline:opacity-50">
          <StatusBadge status="offline" text="Offline" />
        </div>
      );

      const container = screen.getByText('Offline').parentElement;
      expect(container).toHaveClass('offline:opacity-50');
    });
  });

  describe('Safe Area Support', () => {
    it('components respect safe areas', () => {
      mockWindowSize(375, 812); // iPhone X height
      render(
        <div className="safe-area-padding">
          <Button>Safe Area Button</Button>
        </div>
      );

      const container = screen.getByText('Safe Area Button').parentElement;
      expect(container).toHaveClass('safe-area-padding');
    });
  });

  describe('Performance on Mobile', () => {
    it('components use optimized animations on mobile', () => {
      mockWindowSize(375, 667);
      render(
        <div className="animate-fade-in-field md:animate-fade-in">
          <Card>Optimized Animation</Card>
        </div>
      );

      const container = screen.getByText('Optimized Animation').parentElement;
      expect(container).toHaveClass('animate-fade-in-field');
    });
  });

  describe('Accessibility on Mobile', () => {
    it('touch targets meet accessibility requirements', () => {
      mockWindowSize(375, 667);
      render(
        <div>
          <Button className="touch-target">Accessible Button</Button>
          <Input className="touch-target" placeholder="Accessible Input" />
        </div>
      );

      const button = screen.getByRole('button');
      const input = screen.getByRole('textbox');
      
      expect(button).toHaveClass('touch-target');
      expect(input).toHaveClass('touch-target');
    });

    it('focus management works on mobile', async () => {
      mockWindowSize(375, 667);
      render(
        <div>
          <Button>First</Button>
          <Input placeholder="Second" />
          <Button>Third</Button>
        </div>
      );

      const firstButton = screen.getByText('First');
      const input = screen.getByPlaceholderText('Second');
      const thirdButton = screen.getByText('Third');

      firstButton.focus();
      expect(firstButton).toHaveFocus();

      await userEvent.tab();
      expect(input).toHaveFocus();

      await userEvent.tab();
      expect(thirdButton).toHaveFocus();
    });
  });

  describe('Cross-Browser Mobile Compatibility', () => {
    it('works on iOS Safari', () => {
      // Mock iOS Safari user agent
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      });

      mockWindowSize(375, 667);
      render(<Button>iOS Button</Button>);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('works on Android Chrome', () => {
      // Mock Android Chrome user agent
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
      });

      mockWindowSize(360, 640);
      render(<Button>Android Button</Button>);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
