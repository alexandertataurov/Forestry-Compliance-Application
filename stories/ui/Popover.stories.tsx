import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../../components/ui/popover';
import { Button } from '../../components/ui/button';

const meta: Meta<typeof Popover> = {
  title: 'UI/Popover',
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Open</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div>Popover content</div>
      </PopoverContent>
    </Popover>
  ),
};

