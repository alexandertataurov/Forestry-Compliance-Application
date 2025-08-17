import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Input } from '../../components/ui/input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  args: {
    placeholder: 'Type here...',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Basic: Story = {
  render: (args) => <Input {...args} />,
};

