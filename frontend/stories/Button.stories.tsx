import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Container } from '../components/ui/container';
import { Grid, GridItem } from '../components/ui/grid';
import { Typography } from '../components/ui/typography';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and accessibility features.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destructive', 'outline', 'ghost', 'link'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    children: {
      control: 'text',
      description: 'The content inside the button',
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'default',
    disabled: false,
  },
  decorators: [
    (Story) => (
      <Container size="lg" padding="md">
        <Story />
      </Container>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

// Basic Button Variants
export const Variants: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Button Variants</CardTitle>
        <CardDescription>All available button variants with their use cases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-md">
          <div>
            <Typography variant="label" className="block mb-sm">Primary Actions</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="primary">Primary Button</Button>
              <Button variant="primary" disabled>Disabled Primary</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Secondary Actions</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="secondary" disabled>Disabled Secondary</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Tertiary Actions</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="tertiary">Tertiary Button</Button>
              <Button variant="tertiary" disabled>Disabled Tertiary</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Destructive Actions</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="destructive">Delete</Button>
              <Button variant="destructive" disabled>Disabled Delete</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Outline Style</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="outline">Outline Button</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Ghost Style</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="ghost" disabled>Disabled Ghost</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Link Style</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="link">Link Button</Button>
              <Button variant="link" disabled>Disabled Link</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Button Sizes
export const Sizes: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Button Sizes</CardTitle>
        <CardDescription>Different button sizes for various contexts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-md">
          <div>
            <Typography variant="label" className="block mb-sm">Small (sm)</Typography>
            <div className="flex gap-sm flex-wrap items-center">
              <Button size="sm" variant="primary">Small Primary</Button>
              <Button size="sm" variant="secondary">Small Secondary</Button>
              <Button size="sm" variant="outline">Small Outline</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Default</Typography>
            <div className="flex gap-sm flex-wrap items-center">
              <Button size="default" variant="primary">Default Primary</Button>
              <Button size="default" variant="secondary">Default Secondary</Button>
              <Button size="default" variant="outline">Default Outline</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Large (lg)</Typography>
            <div className="flex gap-sm flex-wrap items-center">
              <Button size="lg" variant="primary">Large Primary</Button>
              <Button size="lg" variant="secondary">Large Secondary</Button>
              <Button size="lg" variant="outline">Large Outline</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Icon Buttons</Typography>
            <div className="flex gap-sm flex-wrap items-center">
              <Button size="icon" variant="primary">🔍</Button>
              <Button size="icon" variant="secondary">➕</Button>
              <Button size="icon" variant="outline">✏️</Button>
              <Button size="icon" variant="ghost">⚙️</Button>
              <Button size="icon" variant="destructive">🗑️</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Interactive Examples
export const Interactive: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Examples</CardTitle>
        <CardDescription>Buttons with different interactions and states</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-md">
          <div>
            <Typography variant="label" className="block mb-sm">Loading States</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="primary" disabled>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-sm"></div>
                Loading...
              </Button>
              <Button variant="secondary" disabled>
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-sm"></div>
                Processing
              </Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">With Icons</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="primary">
                <span className="mr-sm">📧</span>
                Send Email
              </Button>
              <Button variant="secondary">
                <span className="mr-sm">💾</span>
                Save Changes
              </Button>
              <Button variant="outline">
                <span className="mr-sm">⬇️</span>
                Download
              </Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Hover Effects</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="primary" className="hover-lift">Lift Effect</Button>
              <Button variant="secondary" className="hover-scale">Scale Effect</Button>
              <Button variant="tertiary" className="hover-glow">Glow Effect</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Focus States</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="primary">Focus Me (Tab)</Button>
              <Button variant="secondary">Focus Me (Tab)</Button>
              <Button variant="outline">Focus Me (Tab)</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Accessibility Features
export const Accessibility: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Accessibility Features</CardTitle>
        <CardDescription>WCAG 2.1 AA compliant button features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-md">
          <div>
            <Typography variant="label" className="block mb-sm">ARIA Labels</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button 
                variant="primary" 
                aria-label="Close dialog"
                aria-describedby="close-description"
              >
                ✕
              </Button>
              <span id="close-description" className="sr-only">
                Closes the current dialog window
              </span>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Touch Targets</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button size="sm" variant="primary" className="min-touch-target">
                Small with Touch Target
              </Button>
              <Button size="default" variant="primary" className="min-touch-target">
                Default with Touch Target
              </Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Keyboard Navigation</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="primary" tabIndex={0}>Tab Focusable</Button>
              <Button variant="secondary" tabIndex={0}>Tab Focusable</Button>
              <Button variant="outline" tabIndex={0}>Tab Focusable</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="label" className="block mb-sm">Screen Reader Support</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button 
                variant="primary"
                aria-pressed="false"
                aria-label="Toggle notifications"
              >
                🔔
              </Button>
              <Button 
                variant="secondary"
                aria-expanded="false"
                aria-controls="menu-content"
                aria-label="Open menu"
              >
                ☰ Menu
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Usage Examples
export const UsageExamples: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Usage Examples</CardTitle>
        <CardDescription>Common button patterns and use cases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-lg">
          <div>
            <Typography variant="title" className="block mb-sm">Form Actions</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="primary">Submit</Button>
              <Button variant="outline">Cancel</Button>
              <Button variant="ghost">Reset</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="title" className="block mb-sm">Data Actions</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="primary">Save</Button>
              <Button variant="secondary">Edit</Button>
              <Button variant="outline">Duplicate</Button>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="title" className="block mb-sm">Navigation</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button variant="primary">Continue</Button>
              <Button variant="outline">Back</Button>
              <Button variant="link">Skip</Button>
            </div>
          </div>
          
          <div>
            <Typography variant="title" className="block mb-sm">Toolbar Actions</Typography>
            <div className="flex gap-sm flex-wrap">
              <Button size="icon" variant="ghost">🔍</Button>
              <Button size="icon" variant="ghost">➕</Button>
              <Button size="icon" variant="ghost">✏️</Button>
              <Button size="icon" variant="ghost">⚙️</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Default Story
export const Default: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
    size: 'default',
  },
};
