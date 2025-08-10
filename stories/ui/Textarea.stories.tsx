import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Textarea } from '../../components/ui/textarea';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  args: {
    placeholder: 'Write your message...'
  }
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Basic: Story = {};

