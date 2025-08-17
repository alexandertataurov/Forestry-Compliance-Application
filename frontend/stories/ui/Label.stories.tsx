import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Basic: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

