import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Checkbox } from '../../components/ui/checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  args: {
    checked: false,
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Basic: Story = {
  render: (args) => <Checkbox {...args} />,
};

