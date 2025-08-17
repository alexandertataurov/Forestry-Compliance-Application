import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  args: {
    children: (
      <>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>This is an alert message.</AlertDescription>
      </>
    ),
    variant: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Basic: Story = {};

