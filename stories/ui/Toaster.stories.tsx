import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Toaster } from '../../components/ui/sonner';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const meta: Meta<typeof Toaster> = {
  title: 'UI/Toaster',
  component: Toaster,
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Basic: Story = {
  render: () => (
    <div className="space-y-4">
      <Button onClick={() => toast('Hello from Sonner!')}>Show toast</Button>
      <Toaster richColors position="top-right" />
    </div>
  ),
};

