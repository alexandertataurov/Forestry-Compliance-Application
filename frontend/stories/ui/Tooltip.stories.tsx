import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../components/ui/tooltip';
import { Button } from '../../components/ui/button';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Basic: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Tooltip content</TooltipContent>
    </Tooltip>
  ),
};

