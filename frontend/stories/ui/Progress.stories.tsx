import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Progress } from '../../components/ui/progress';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  args: { value: 33 },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Basic: Story = {};

