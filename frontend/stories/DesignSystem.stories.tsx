import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/ui/button';
import { Typography } from '../components/ui/typography';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Container } from '../components/ui/container';
import { Grid, GridItem } from '../components/ui/grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  FocusTrap, 
  SkipLink, 
  LiveRegion, 
  KeyboardNavList, 
  KeyboardNavItem,
  VisuallyHidden,
  HighContrastBorder,
  TouchTarget,
  Announcement 
} from '../components/ui/accessibility';

const meta: Meta = {
  title: 'Design System/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete design system showcase including design tokens, components, and accessibility features.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Design Tokens Showcase
export const DesignTokens: Story = {
  render: () => (
    <Container size="xl" padding="lg">
      <Typography variant="display" as="h1" className="mb-lg">
        Design System Tokens
      </Typography>
      
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="motion">Motion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="mt-lg">
          <Grid cols={2} gap="lg">
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>Brand Colors</CardTitle>
                  <CardDescription>Primary brand colors used throughout the application</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-sm">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 rounded-md bg-brand-primary"></div>
                      <div>
                        <Typography variant="label">Primary</Typography>
                        <Typography variant="caption" color="secondary">#335CFF</Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 rounded-md bg-brand-secondary"></div>
                      <div>
                        <Typography variant="label">Secondary</Typography>
                        <Typography variant="caption" color="secondary">#6B8AFF</Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 rounded-md bg-brand-tertiary"></div>
                      <div>
                        <Typography variant="label">Tertiary</Typography>
                        <Typography variant="caption" color="secondary">#00BFA5</Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 rounded-md bg-brand-error"></div>
                      <div>
                        <Typography variant="label">Error</Typography>
                        <Typography variant="caption" color="secondary">#D14343</Typography>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>Surface Colors</CardTitle>
                  <CardDescription>Background and surface colors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-sm">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 rounded-md bg-surface-bg border border-surface-border"></div>
                      <div>
                        <Typography variant="label">Background</Typography>
                        <Typography variant="caption" color="secondary">#FFFFFF</Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 rounded-md bg-surface-bg-variant border border-surface-border"></div>
                      <div>
                        <Typography variant="label">Background Variant</Typography>
                        <Typography variant="caption" color="secondary">#F6F7F9</Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 rounded-md bg-surface-border"></div>
                      <div>
                        <Typography variant="label">Border</Typography>
                        <Typography variant="caption" color="secondary">#DDE3EE</Typography>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
          </Grid>
        </TabsContent>
        
        <TabsContent value="typography" className="mt-lg">
          <Card>
            <CardHeader>
              <CardTitle>Typography Scale</CardTitle>
              <CardDescription>Complete typography system with proper hierarchy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-md">
                <div>
                  <Typography variant="display">Display Text</Typography>
                  <Typography variant="caption" color="secondary">Display - 48px/56px - SF Pro Display</Typography>
                </div>
                <div>
                  <Typography variant="headline">Headline Text</Typography>
                  <Typography variant="caption" color="secondary">Headline - 32px/40px - SF Pro Display</Typography>
                </div>
                <div>
                  <Typography variant="title">Title Text</Typography>
                  <Typography variant="caption" color="secondary">Title - 24px/32px - SF Pro Display</Typography>
                </div>
                <div>
                  <Typography variant="subtitle">Subtitle Text</Typography>
                  <Typography variant="caption" color="secondary">Subtitle - 20px/28px - SF Pro Display</Typography>
                </div>
                <div>
                  <Typography variant="body-large">Body Large Text</Typography>
                  <Typography variant="caption" color="secondary">Body Large - 18px/26px - SF Pro Text</Typography>
                </div>
                <div>
                  <Typography variant="body">Body Text</Typography>
                  <Typography variant="caption" color="secondary">Body - 16px/24px - SF Pro Text</Typography>
                </div>
                <div>
                  <Typography variant="body-small">Body Small Text</Typography>
                  <Typography variant="caption" color="secondary">Body Small - 14px/20px - SF Pro Text</Typography>
                </div>
                <div>
                  <Typography variant="label">Label Text</Typography>
                  <Typography variant="caption" color="secondary">Label - 14px/20px - SF Pro Text</Typography>
                </div>
                <div>
                  <Typography variant="label-small">Label Small Text</Typography>
                  <Typography variant="caption" color="secondary">Label Small - 12px/16px - SF Pro Text</Typography>
                </div>
                <div>
                  <Typography variant="caption">Caption Text</Typography>
                  <Typography variant="caption" color="secondary">Caption - 12px/16px - SF Pro Text</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="spacing" className="mt-lg">
          <Card>
            <CardHeader>
              <CardTitle>Spacing Scale</CardTitle>
              <CardDescription>Consistent spacing system using 4px base unit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-md">
                <div className="flex items-center gap-md">
                  <div className="w-4 h-4 bg-brand-primary rounded-sm"></div>
                  <Typography variant="label">4px (xs)</Typography>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-8 h-8 bg-brand-primary rounded-sm"></div>
                  <Typography variant="label">8px (sm)</Typography>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 bg-brand-primary rounded-sm"></div>
                  <Typography variant="label">16px (md)</Typography>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-16 h-16 bg-brand-primary rounded-sm"></div>
                  <Typography variant="label">24px (lg)</Typography>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-20 h-20 bg-brand-primary rounded-sm"></div>
                  <Typography variant="label">32px (xl)</Typography>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-24 h-24 bg-brand-primary rounded-sm"></div>
                  <Typography variant="label">48px (2xl)</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="motion" className="mt-lg">
          <Card>
            <CardHeader>
              <CardTitle>Motion System</CardTitle>
              <CardDescription>Animation and transition utilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-lg">
                <div>
                  <Typography variant="title">Transition Durations</Typography>
                  <div className="flex gap-md mt-sm">
                    <Button className="transition-fast hover:scale-105">Fast (150ms)</Button>
                    <Button className="transition-normal hover:scale-105">Normal (250ms)</Button>
                    <Button className="transition-slow hover:scale-105">Slow (350ms)</Button>
                    <Button className="transition-slower hover:scale-105">Slower (500ms)</Button>
                  </div>
                </div>
                
                <div>
                  <Typography variant="title">Hover Animations</Typography>
                  <div className="flex gap-md mt-sm">
                    <Button className="hover-lift">Lift</Button>
                    <Button className="hover-scale">Scale</Button>
                    <Button className="hover-glow">Glow</Button>
                  </div>
                </div>
                
                <div>
                  <Typography variant="title">Loading Animations</Typography>
                  <div className="flex gap-md mt-sm">
                    <div className="animate-spin w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full"></div>
                    <div className="animate-pulse w-8 h-8 bg-brand-primary rounded-md"></div>
                    <div className="animate-bounce w-8 h-8 bg-brand-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  ),
};

// Component Showcase
export const Components: Story = {
  render: () => (
    <Container size="xl" padding="lg">
      <Typography variant="display" as="h1" className="mb-lg">
        Component Library
      </Typography>
      
      <Tabs defaultValue="buttons" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>
        
        <TabsContent value="buttons" className="mt-lg">
          <Grid cols={2} gap="lg">
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>Button Variants</CardTitle>
                  <CardDescription>All available button variants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-sm">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="tertiary">Tertiary Button</Button>
                    <Button variant="destructive">Destructive Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="link">Link Button</Button>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>Button Sizes</CardTitle>
                  <CardDescription>Different button sizes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-sm">
                    <Button size="sm">Small Button</Button>
                    <Button size="default">Default Button</Button>
                    <Button size="lg">Large Button</Button>
                    <Button size="icon">🔍</Button>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
          </Grid>
        </TabsContent>
        
        <TabsContent value="forms" className="mt-lg">
          <Grid cols={2} gap="lg">
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>Form Components</CardTitle>
                  <CardDescription>Input and form elements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-md">
                    <div>
                      <Typography variant="label" className="block mb-xs">Email Address</Typography>
                      <Input type="email" placeholder="Enter your email" />
                    </div>
                    <div>
                      <Typography variant="label" className="block mb-xs">Password</Typography>
                      <Input type="password" placeholder="Enter your password" />
                    </div>
                    <div>
                      <Typography variant="label" className="block mb-xs">Search</Typography>
                      <Input type="search" placeholder="Search..." />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>Typography Examples</CardTitle>
                  <CardDescription>Text hierarchy and styling</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-sm">
                    <Typography variant="display">Display Text</Typography>
                    <Typography variant="headline">Headline Text</Typography>
                    <Typography variant="title">Title Text</Typography>
                    <Typography variant="body">Body text with proper line height and spacing.</Typography>
                    <Typography variant="label">Label Text</Typography>
                    <Typography variant="caption" color="secondary">Caption text for additional information</Typography>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
          </Grid>
        </TabsContent>
        
        <TabsContent value="layout" className="mt-lg">
          <Card>
            <CardHeader>
              <CardTitle>Layout Components</CardTitle>
              <CardDescription>Container and grid system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-lg">
                <div>
                  <Typography variant="title">Grid System</Typography>
                  <Grid cols={3} gap="md" className="mt-sm">
                    <GridItem>
                      <Card>
                        <CardContent className="p-md">
                          <Typography variant="body">Grid Item 1</Typography>
                        </CardContent>
                      </Card>
                    </GridItem>
                    <GridItem>
                      <Card>
                        <CardContent className="p-md">
                          <Typography variant="body">Grid Item 2</Typography>
                        </CardContent>
                      </Card>
                    </GridItem>
                    <GridItem>
                      <Card>
                        <CardContent className="p-md">
                          <Typography variant="body">Grid Item 3</Typography>
                        </CardContent>
                      </Card>
                    </GridItem>
                  </Grid>
                </div>
                
                <div>
                  <Typography variant="title">Container Sizes</Typography>
                  <div className="space-y-sm mt-sm">
                    <Container size="sm" className="bg-surface-bg-variant p-md rounded-md">
                      <Typography variant="body">Small Container</Typography>
                    </Container>
                    <Container size="md" className="bg-surface-bg-variant p-md rounded-md">
                      <Typography variant="body">Medium Container</Typography>
                    </Container>
                    <Container size="lg" className="bg-surface-bg-variant p-md rounded-md">
                      <Typography variant="body">Large Container</Typography>
                    </Container>
                    <Container size="xl" className="bg-surface-bg-variant p-md rounded-md">
                      <Typography variant="body">Extra Large Container</Typography>
                    </Container>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accessibility" className="mt-lg">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Features</CardTitle>
              <CardDescription>WCAG 2.1 AA compliant components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-lg">
                <div>
                  <Typography variant="title">Skip Links</Typography>
                  <SkipLink href="#main-content" className="mb-sm">
                    Skip to main content
                  </SkipLink>
                  <Typography variant="body-small" color="secondary">
                    Press Tab to see skip links
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="title">Live Regions</Typography>
                  <LiveRegion priority="polite" className="mb-sm">
                    Status updates will appear here
                  </LiveRegion>
                  <Button 
                    onClick={() => {
                      const region = document.querySelector('[aria-live]');
                      if (region) {
                        region.textContent = 'Action completed successfully!';
                      }
                    }}
                  >
                    Trigger Announcement
                  </Button>
                </div>
                
                <div>
                  <Typography variant="title">High Contrast Borders</Typography>
                  <div className="flex gap-md">
                    <HighContrastBorder variant="focus">
                      <Button>Focus Border</Button>
                    </HighContrastBorder>
                    <HighContrastBorder variant="error">
                      <Button variant="destructive">Error Border</Button>
                    </HighContrastBorder>
                  </div>
                </div>
                
                <div>
                  <Typography variant="title">Touch Targets</Typography>
                  <div className="flex gap-md">
                    <TouchTarget size="sm">
                      <Button size="sm">Small Target</Button>
                    </TouchTarget>
                    <TouchTarget size="md">
                      <Button>Medium Target</Button>
                    </TouchTarget>
                    <TouchTarget size="lg">
                      <Button size="lg">Large Target</Button>
                    </TouchTarget>
                  </div>
                </div>
                
                <div>
                  <Typography variant="title">Keyboard Navigation</Typography>
                  <KeyboardNavList 
                    orientation="horizontal"
                    className="flex gap-sm"
                  >
                    <KeyboardNavItem index={0} isActive={true}>
                      <Button variant="outline">Item 1</Button>
                    </KeyboardNavItem>
                    <KeyboardNavItem index={1} isActive={false}>
                      <Button variant="outline">Item 2</Button>
                    </KeyboardNavItem>
                    <KeyboardNavItem index={2} isActive={false}>
                      <Button variant="outline">Item 3</Button>
                    </KeyboardNavItem>
                  </KeyboardNavList>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  ),
};

// Interactive Playground
export const Playground: Story = {
  render: () => (
    <Container size="xl" padding="lg">
      <Typography variant="display" as="h1" className="mb-lg">
        Interactive Component Playground
      </Typography>
      
      <Card>
        <CardHeader>
          <CardTitle>Customize Components</CardTitle>
          <CardDescription>Experiment with different component configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-lg">
            <div>
              <Typography variant="title">Button Playground</Typography>
              <div className="flex gap-md mt-sm">
                <Button variant="primary" className="hover-lift">
                  Primary with Lift
                </Button>
                <Button variant="secondary" className="hover-scale">
                  Secondary with Scale
                </Button>
                <Button variant="tertiary" className="hover-glow">
                  Tertiary with Glow
                </Button>
              </div>
            </div>
            
            <div>
              <Typography variant="title">Form Playground</Typography>
              <div className="grid grid-cols-2 gap-md mt-sm">
                <div>
                  <Typography variant="label" className="block mb-xs">Interactive Input</Typography>
                  <Input 
                    placeholder="Type something..." 
                    className="transition-all focus:scale-105"
                  />
                </div>
                <div>
                  <Typography variant="label" className="block mb-xs">Animated Input</Typography>
                  <Input 
                    placeholder="With animation..." 
                    className="animate-pulse"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Typography variant="title">Layout Playground</Typography>
              <Grid cols={4} gap="md" className="mt-sm">
                {Array.from({ length: 8 }, (_, i) => (
                  <GridItem key={i}>
                    <Card className="hover-lift transition-all">
                      <CardContent className="p-sm text-center">
                        <Typography variant="caption">Item {i + 1}</Typography>
                      </CardContent>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  ),
};
