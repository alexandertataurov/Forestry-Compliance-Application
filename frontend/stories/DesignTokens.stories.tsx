import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Container } from '../components/ui/container';
import { Grid, GridItem } from '../components/ui/grid';
import { Typography } from '../components/ui/typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { validateDesignTokens, generateAccessibilityReport } from '../utils/color-contrast';

const meta: Meta = {
  title: 'Design System/Design Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete documentation of design tokens including colors, typography, spacing, and motion.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Color System Documentation
export const ColorSystem: Story = {
  render: () => (
    <Container size="xl" padding="lg">
      <Typography variant="display" as="h1" className="mb-lg">
        Color System
      </Typography>
      
      <Tabs defaultValue="brand" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="neutral">Neutral</TabsTrigger>
          <TabsTrigger value="surface">Surface</TabsTrigger>
          <TabsTrigger value="state">State</TabsTrigger>
        </TabsList>
        
        <TabsContent value="brand" className="mt-lg">
          <Grid cols={2} gap="lg">
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>Brand Colors</CardTitle>
                  <CardDescription>Primary brand colors used throughout the application</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-md">
                    <div>
                      <div className="flex items-center gap-md mb-sm">
                        <div className="w-16 h-16 rounded-lg bg-brand-primary flex items-center justify-center">
                          <Typography variant="label" color="primary" className="text-white">
                            Primary
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="label">Primary</Typography>
                          <Typography variant="caption" color="secondary">#335CFF</Typography>
                          <Typography variant="caption" color="secondary">CSS: var(--color-brand-primary)</Typography>
                        </div>
                      </div>
                      <Typography variant="body-small" color="secondary">
                        Used for primary actions, links, and key interactive elements.
                      </Typography>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-md mb-sm">
                        <div className="w-16 h-16 rounded-lg bg-brand-secondary flex items-center justify-center">
                          <Typography variant="label" color="primary" className="text-white">
                            Secondary
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="label">Secondary</Typography>
                          <Typography variant="caption" color="secondary">#6B8AFF</Typography>
                          <Typography variant="caption" color="secondary">CSS: var(--color-brand-secondary)</Typography>
                        </div>
                      </div>
                      <Typography variant="body-small" color="secondary">
                        Used for secondary actions and supporting elements.
                      </Typography>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-md mb-sm">
                        <div className="w-16 h-16 rounded-lg bg-brand-tertiary flex items-center justify-center">
                          <Typography variant="label" color="primary" className="text-white">
                            Tertiary
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="label">Tertiary</Typography>
                          <Typography variant="caption" color="secondary">#00BFA5</Typography>
                          <Typography variant="caption" color="secondary">CSS: var(--color-brand-tertiary)</Typography>
                        </div>
                      </div>
                      <Typography variant="body-small" color="secondary">
                        Used for accent elements and highlighting.
                      </Typography>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-md mb-sm">
                        <div className="w-16 h-16 rounded-lg bg-brand-error flex items-center justify-center">
                          <Typography variant="label" color="primary" className="text-white">
                            Error
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="label">Error</Typography>
                          <Typography variant="caption" color="secondary">#D14343</Typography>
                          <Typography variant="caption" color="secondary">CSS: var(--color-brand-error)</Typography>
                        </div>
                      </div>
                      <Typography variant="body-small" color="secondary">
                        Used for error states, validation failures, and destructive actions.
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>Color Usage Guidelines</CardTitle>
                  <CardDescription>Best practices for using brand colors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-md">
                    <div>
                      <Typography variant="title" className="mb-sm">Primary Color</Typography>
                      <ul className="list-disc list-inside space-y-xs text-sm">
                        <li>Main call-to-action buttons</li>
                        <li>Primary navigation links</li>
                        <li>Important form submissions</li>
                        <li>Key interactive elements</li>
                      </ul>
                    </div>
                    
                    <div>
                      <Typography variant="title" className="mb-sm">Secondary Color</Typography>
                      <ul className="list-disc list-inside space-y-xs text-sm">
                        <li>Secondary action buttons</li>
                        <li>Supporting navigation</li>
                        <li>Alternative options</li>
                        <li>Less critical interactions</li>
                      </ul>
                    </div>
                    
                    <div>
                      <Typography variant="title" className="mb-sm">Tertiary Color</Typography>
                      <ul className="list-disc list-inside space-y-xs text-sm">
                        <li>Success states</li>
                        <li>Positive feedback</li>
                        <li>Accent highlights</li>
                        <li>Progress indicators</li>
                      </ul>
                    </div>
                    
                    <div>
                      <Typography variant="title" className="mb-sm">Error Color</Typography>
                      <ul className="list-disc list-inside space-y-xs text-sm">
                        <li>Error messages</li>
                        <li>Validation failures</li>
                        <li>Destructive actions</li>
                        <li>Critical alerts</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
          </Grid>
        </TabsContent>
        
        <TabsContent value="neutral" className="mt-lg">
          <Grid cols={2} gap="lg">
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>Neutral Colors</CardTitle>
                  <CardDescription>Grayscale colors for text, borders, and backgrounds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-md">
                    {[
                      { name: '0', value: '#FFFFFF', usage: 'Pure white backgrounds' },
                      { name: '100', value: '#DDE3EE', usage: 'Light borders and dividers' },
                      { name: '200', value: '#C7D0E0', usage: 'Medium borders' },
                      { name: '300', value: '#A3B1C7', usage: 'Disabled text' },
                      { name: '400', value: '#7E8AAD', usage: 'Placeholder text' },
                      { name: '500', value: '#5A6B8A', usage: 'Secondary text' },
                      { name: '600', value: '#3F4A5C', usage: 'Body text' },
                      { name: '700', value: '#2B303A', usage: 'Primary text' },
                      { name: '800', value: '#1A202C', usage: 'Headings' },
                      { name: '900', value: '#111418', usage: 'Dark backgrounds' },
                    ].map((color) => (
                      <div key={color.name} className="flex items-center gap-md">
                        <div 
                          className="w-12 h-12 rounded-md border border-surface-border"
                          style={{ backgroundColor: color.value }}
                        ></div>
                        <div className="flex-1">
                          <Typography variant="label">Neutral {color.name}</Typography>
                          <Typography variant="caption" color="secondary">{color.value}</Typography>
                          <Typography variant="caption" color="secondary">{color.usage}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>Text Color Guidelines</CardTitle>
                  <CardDescription>When to use different text colors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-md">
                    <div>
                      <Typography variant="title" className="mb-sm">Primary Text</Typography>
                      <Typography variant="body" className="text-neutral-800">
                        This is primary text color used for main content, headings, and important information.
                      </Typography>
                    </div>
                    
                    <div>
                      <Typography variant="title" className="mb-sm">Secondary Text</Typography>
                      <Typography variant="body" className="text-neutral-600">
                        This is secondary text color used for supporting information and descriptions.
                      </Typography>
                    </div>
                    
                    <div>
                      <Typography variant="title" className="mb-sm">Placeholder Text</Typography>
                      <Typography variant="body" className="text-neutral-400">
                        This is placeholder text color used for input placeholders and disabled content.
                      </Typography>
                    </div>
                    
                    <div>
                      <Typography variant="title" className="mb-sm">Disabled Text</Typography>
                      <Typography variant="body" className="text-neutral-300">
                        This is disabled text color used for inactive or unavailable content.
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
          </Grid>
        </TabsContent>
        
        <TabsContent value="surface" className="mt-lg">
          <Grid cols={2} gap="lg">
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>Surface Colors</CardTitle>
                  <CardDescription>Background and surface colors for UI elements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-md">
                    <div>
                      <div className="flex items-center gap-md mb-sm">
                        <div className="w-16 h-16 rounded-lg bg-surface-bg border border-surface-border flex items-center justify-center">
                          <Typography variant="label">Background</Typography>
                        </div>
                        <div>
                          <Typography variant="label">Surface Background</Typography>
                          <Typography variant="caption" color="secondary">#FFFFFF</Typography>
                          <Typography variant="caption" color="secondary">CSS: var(--color-surface-bg)</Typography>
                        </div>
                      </div>
                      <Typography variant="body-small" color="secondary">
                        Primary background color for cards, modals, and content areas.
                      </Typography>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-md mb-sm">
                        <div className="w-16 h-16 rounded-lg bg-surface-bg-variant border border-surface-border flex items-center justify-center">
                          <Typography variant="label">Background Variant</Typography>
                        </div>
                        <div>
                          <Typography variant="label">Surface Background Variant</Typography>
                          <Typography variant="caption" color="secondary">#F6F7F9</Typography>
                          <Typography variant="caption" color="secondary">CSS: var(--color-surface-bg-variant)</Typography>
                        </div>
                      </div>
                      <Typography variant="body-small" color="secondary">
                        Secondary background for hover states and subtle variations.
                      </Typography>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-md mb-sm">
                        <div className="w-16 h-16 rounded-lg bg-surface-border flex items-center justify-center">
                          <Typography variant="label" className="text-white">Border</Typography>
                        </div>
                        <div>
                          <Typography variant="label">Surface Border</Typography>
                          <Typography variant="caption" color="secondary">#DDE3EE</Typography>
                          <Typography variant="caption" color="secondary">CSS: var(--color-surface-border)</Typography>
                        </div>
                      </div>
                      <Typography variant="body-small" color="secondary">
                        Standard border color for cards, inputs, and dividers.
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>State Colors</CardTitle>
                  <CardDescription>Colors for different states and feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-md">
                    <div>
                      <div className="flex items-center gap-md mb-sm">
                        <div className="w-16 h-16 rounded-lg bg-state-success flex items-center justify-center">
                          <Typography variant="label" className="text-white">Success</Typography>
                        </div>
                        <div>
                          <Typography variant="label">Success</Typography>
                          <Typography variant="caption" color="secondary">#17A34A</Typography>
                          <Typography variant="caption" color="secondary">CSS: var(--color-state-success)</Typography>
                        </div>
                      </div>
                      <Typography variant="body-small" color="secondary">
                        Used for success states, completed actions, and positive feedback.
                      </Typography>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-md mb-sm">
                        <div className="w-16 h-16 rounded-lg bg-state-warning flex items-center justify-center">
                          <Typography variant="label" className="text-white">Warning</Typography>
                        </div>
                        <div>
                          <Typography variant="label">Warning</Typography>
                          <Typography variant="caption" color="secondary">#D97706</Typography>
                          <Typography variant="caption" color="secondary">CSS: var(--color-state-warning)</Typography>
                        </div>
                      </div>
                      <Typography variant="body-small" color="secondary">
                        Used for warnings, caution states, and attention-grabbing elements.
                      </Typography>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-md mb-sm">
                        <div className="w-16 h-16 rounded-lg bg-state-info flex items-center justify-center">
                          <Typography variant="label" className="text-white">Info</Typography>
                        </div>
                        <div>
                          <Typography variant="label">Info</Typography>
                          <Typography variant="caption" color="secondary">#0284C7</Typography>
                          <Typography variant="caption" color="secondary">CSS: var(--color-state-info)</Typography>
                        </div>
                      </div>
                      <Typography variant="body-small" color="secondary">
                        Used for informational messages, tips, and neutral feedback.
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
          </Grid>
        </TabsContent>
        
        <TabsContent value="state" className="mt-lg">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Validation</CardTitle>
              <CardDescription>Color contrast validation for WCAG 2.1 AA compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-neutral-100 p-md rounded-lg">
                <pre className="text-sm overflow-auto">
                  {generateAccessibilityReport()}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  ),
};

// Typography System Documentation
export const TypographySystem: Story = {
  render: () => (
    <Container size="xl" padding="lg">
      <Typography variant="display" as="h1" className="mb-lg">
        Typography System
      </Typography>
      
      <Grid cols={2} gap="lg">
        <GridItem>
          <Card>
            <CardHeader>
              <CardTitle>Typography Scale</CardTitle>
              <CardDescription>Complete typography hierarchy with specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-lg">
                <div>
                  <Typography variant="display">Display</Typography>
                  <Typography variant="caption" color="secondary">
                    48px / 56px line-height / SF Pro Display / 600 weight
                  </Typography>
                  <Typography variant="body-small" color="secondary">
                    Used for hero headlines and page titles.
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="headline">Headline</Typography>
                  <Typography variant="caption" color="secondary">
                    32px / 40px line-height / SF Pro Display / 600 weight
                  </Typography>
                  <Typography variant="body-small" color="secondary">
                    Used for section headers and major headings.
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="title">Title</Typography>
                  <Typography variant="caption" color="secondary">
                    24px / 32px line-height / SF Pro Display / 600 weight
                  </Typography>
                  <Typography variant="body-small" color="secondary">
                    Used for card titles and subsection headers.
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="subtitle">Subtitle</Typography>
                  <Typography variant="caption" color="secondary">
                    20px / 28px line-height / SF Pro Display / 500 weight
                  </Typography>
                  <Typography variant="body-small" color="secondary">
                    Used for subtitles and secondary headings.
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="body-large">Body Large</Typography>
                  <Typography variant="caption" color="secondary">
                    18px / 26px line-height / SF Pro Text / 400 weight
                  </Typography>
                  <Typography variant="body-small" color="secondary">
                    Used for important body text and lead paragraphs.
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="body">Body</Typography>
                  <Typography variant="caption" color="secondary">
                    16px / 24px line-height / SF Pro Text / 400 weight
                  </Typography>
                  <Typography variant="body-small" color="secondary">
                    Used for standard body text and content.
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="body-small">Body Small</Typography>
                  <Typography variant="caption" color="secondary">
                    14px / 20px line-height / SF Pro Text / 400 weight
                  </Typography>
                  <Typography variant="body-small" color="secondary">
                    Used for secondary content and smaller text.
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="label">Label</Typography>
                  <Typography variant="caption" color="secondary">
                    14px / 20px line-height / SF Pro Text / 500 weight
                  </Typography>
                  <Typography variant="body-small" color="secondary">
                    Used for form labels and interactive elements.
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="label-small">Label Small</Typography>
                  <Typography variant="caption" color="secondary">
                    12px / 16px line-height / SF Pro Text / 500 weight
                  </Typography>
                  <Typography variant="body-small" color="secondary">
                    Used for small labels and captions.
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="caption">Caption</Typography>
                  <Typography variant="caption" color="secondary">
                    12px / 16px line-height / SF Pro Text / 400 weight
                  </Typography>
                  <Typography variant="body-small" color="secondary">
                    Used for metadata, timestamps, and fine print.
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card>
            <CardHeader>
              <CardTitle>Font Families</CardTitle>
              <CardDescription>Typography font stack and usage guidelines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-md">
                <div>
                  <Typography variant="title" className="mb-sm">SF Pro Display</Typography>
                  <Typography variant="body" className="font-display">
                    Used for headings and display text. This font provides excellent readability at larger sizes.
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="title" className="mb-sm">SF Pro Text</Typography>
                  <Typography variant="body" className="font-body">
                    Used for body text and smaller content. Optimized for readability at smaller sizes.
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="title" className="mb-sm">SF Mono</Typography>
                  <Typography variant="body" className="font-mono">
                    Used for code, technical content, and monospace requirements.
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="title" className="mb-sm">Fallback Stack</Typography>
                  <Typography variant="body-small" color="secondary">
                    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </GridItem>
      </Grid>
    </Container>
  ),
};
