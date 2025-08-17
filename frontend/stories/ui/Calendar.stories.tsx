import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Calendar } from '../../components/ui/calendar';

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  args: {
    mode: 'single',
    selected: new Date(),
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Basic: Story = {};

