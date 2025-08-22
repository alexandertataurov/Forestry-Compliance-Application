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
} from '../index';

// Mock data for testing
const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
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
  {
    key: 'status',
    header: 'Status',
    cell: (item: any) => item.status,
  },
];

describe('Component Library', () => {
  describe('Button Component', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Button variant="destructive">Delete</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-destructive');

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toHaveClass('border');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-8');

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-10');
    });

    it('handles click events', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Input Component', () => {
    it('renders with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('handles value changes', async () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('supports different input types', () => {
      render(<Input type="email" placeholder="Email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('can be disabled', () => {
      render(<Input disabled placeholder="Disabled" />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('Card Component', () => {
    it('renders card with content', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>Card content</CardContent>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });
  });

  describe('Badge Component', () => {
    it('renders with text', () => {
      render(<Badge>Status</Badge>);
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Badge variant="destructive">Error</Badge>);
      expect(screen.getByText('Error')).toHaveClass('bg-destructive');

      rerender(<Badge variant="outline">Outline</Badge>);
      expect(screen.getByText('Outline')).toHaveClass('border');
    });
  });

  describe('Select Component', () => {
    it('renders select trigger', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    it('opens select content on click', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      await userEvent.click(screen.getByRole('combobox'));
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Checkbox Component', () => {
    it('renders checkbox', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('handles checked state', async () => {
      const handleCheckedChange = jest.fn();
      render(<Checkbox onCheckedChange={handleCheckedChange} />);
      
      await userEvent.click(screen.getByRole('checkbox'));
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Switch Component', () => {
    it('renders switch', () => {
      render(<Switch />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('handles toggle', async () => {
      const handleCheckedChange = jest.fn();
      render(<Switch onCheckedChange={handleCheckedChange} />);
      
      await userEvent.click(screen.getByRole('switch'));
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Slider Component', () => {
    it('renders slider', () => {
      render(<Slider defaultValue={[50]} max={100} step={1} />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('has correct attributes', () => {
      render(<Slider defaultValue={[50]} max={100} step={1} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('max', '100');
      expect(slider).toHaveAttribute('step', '1');
    });
  });

  describe('Progress Component', () => {
    it('renders progress bar', () => {
      render(<Progress value={50} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('has correct value', () => {
      render(<Progress value={75} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
    });
  });

  describe('Tabs Component', () => {
    it('renders tabs', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('switches tabs on click', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      await userEvent.click(screen.getByText('Tab 2'));
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  describe('StatusBadge Component', () => {
    it('renders with status and text', () => {
      render(<StatusBadge status="success" text="Completed" />);
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('applies correct status styles', () => {
      const { rerender } = render(<StatusBadge status="success" text="Success" />);
      expect(screen.getByText('Success')).toHaveClass('bg-green-100');

      rerender(<StatusBadge status="error" text="Error" />);
      expect(screen.getByText('Error')).toHaveClass('bg-red-100');
    });
  });

  describe('ProgressIndicator Component', () => {
    it('renders progress indicator', () => {
      render(<ProgressIndicator current={5} total={10} label="Progress" />);
      expect(screen.getByText('Progress')).toBeInTheDocument();
      expect(screen.getByText('5 / 10')).toBeInTheDocument();
    });

    it('shows percentage when enabled', () => {
      render(<ProgressIndicator current={5} total={10} showPercentage />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  describe('DataTable Component', () => {
    it('renders data table', () => {
      render(<DataTable data={mockData} columns={mockColumns} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
    });

    it('renders column headers', () => {
      render(<DataTable data={mockData} columns={mockColumns} />);
      
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  describe('Form Component', () => {
    it('renders form with fields', () => {
      render(
        <Form>
          <FormField name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </Form>
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    });
  });

  describe('Dialog Component', () => {
    it('renders dialog trigger', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
            Dialog content
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Open Dialog')).toBeInTheDocument();
    });

    it('opens dialog on trigger click', async () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
            Dialog content
          </DialogContent>
        </Dialog>
      );

      await userEvent.click(screen.getByText('Open Dialog'));
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
      expect(screen.getByText('Dialog content')).toBeInTheDocument();
    });
  });

  describe('Alert Component', () => {
    it('renders alert with title and description', () => {
      render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert description</AlertDescription>
        </Alert>
      );

      expect(screen.getByText('Alert Title')).toBeInTheDocument();
      expect(screen.getByText('Alert description')).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong</AlertDescription>
        </Alert>
      );
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  describe('Tooltip Component', () => {
    it('renders tooltip trigger', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('shows tooltip on hover', async () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      await userEvent.hover(screen.getByText('Hover me'));
      await waitFor(() => {
        expect(screen.getByText('Tooltip content')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('button has proper ARIA attributes', () => {
      render(<Button aria-label="Submit form">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Submit form');
    });

    it('input has proper ARIA attributes', () => {
      render(<Input aria-describedby="help-text" aria-invalid="true" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'help-text');
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('checkbox has proper ARIA attributes', () => {
      render(<Checkbox aria-label="Accept terms" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-label', 'Accept terms');
    });
  });

  describe('Keyboard Navigation', () => {
    it('button responds to Enter key', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      screen.getByRole('button').focus();
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('button responds to Space key', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      screen.getByRole('button').focus();
      fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
