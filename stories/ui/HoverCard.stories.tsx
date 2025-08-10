import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../../components/ui/hover-card';
import { Button } from '../../components/ui/button';

const meta: Meta<typeof HoverCard> = {
  title: 'UI/HoverCard',
  component: HoverCard,
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Basic: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button>Hover me</Button>
      </HoverCardTrigger>
      <HoverCardContent>Details on hover</HoverCardContent>
    </HoverCard>
  ),
};

