import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Slider } from '../../components/ui/slider';

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  args: {
    defaultValue: [50],
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Basic: Story = {};

