import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Switch } from '../../components/ui/switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  args: {
    checked: true,
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Basic: Story = {
  render: (args) => <Switch {...args} />,
};

