import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChartContainer } from '../../components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Jan', uv: 400, pv: 240 },
  { name: 'Feb', uv: 300, pv: 139 },
  { name: 'Mar', uv: 200, pv: 980 },
  { name: 'Apr', uv: 278, pv: 390 },
  { name: 'May', uv: 189, pv: 480 },
];

const meta: Meta<typeof ChartContainer> = {
  title: 'UI/Chart',
  component: ChartContainer,
};

export default meta;
type Story = StoryObj<typeof ChartContainer>;

export const Basic: Story = {
  render: () => (
    <ChartContainer config={{ uv: { label: 'UV', color: 'hsl(var(--primary))' }, pv: { label: 'PV', color: 'hsl(var(--secondary))' } }}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="uv" stroke="var(--color-uv)" />
        <Line type="monotone" dataKey="pv" stroke="var(--color-pv)" />
      </LineChart>
    </ChartContainer>
  ),
};

