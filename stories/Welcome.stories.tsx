import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Welcome/Intro',
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Forestry Compliance UI</h1>
      <p>Storybook is set up and building successfully.</p>
    </div>
  ),
};

