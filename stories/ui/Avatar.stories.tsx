import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Basic: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/100?img=3" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

