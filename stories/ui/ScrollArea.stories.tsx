import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ScrollArea } from '../../components/ui/scroll-area';

const meta: Meta<typeof ScrollArea> = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Basic: Story = {
  render: () => (
    <ScrollArea className="h-40 w-64 rounded-md border p-4">
      <div className="space-y-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i}>Item {i + 1}</div>
        ))}
      </div>
    </ScrollArea>
  ),
};

