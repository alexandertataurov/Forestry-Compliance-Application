import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Separator } from '../../components/ui/separator';

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Basic: Story = {
  render: () => (
    <div>
      <div>Above</div>
      <Separator className="my-4" />
      <div>Below</div>
    </div>
  ),
};

