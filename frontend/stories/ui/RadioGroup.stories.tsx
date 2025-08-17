import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Basic: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <label className="flex items-center gap-2">
        <RadioGroupItem value="option-1" /> Option 1
      </label>
      <label className="flex items-center gap-2">
        <RadioGroupItem value="option-2" /> Option 2
      </label>
    </RadioGroup>
  ),
};

