import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CommandDialog, CommandGroup, CommandItem, CommandList, CommandInput } from '../../components/ui/command';

const meta: Meta<typeof CommandDialog> = {
  title: 'UI/Command',
  component: CommandDialog,
};

export default meta;
type Story = StoryObj<typeof CommandDialog>;

export const Basic: Story = {
  render: () => (
    <CommandDialog open onOpenChange={() => {}}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandGroup heading="Suggestions">
          <CommandItem>Profile</CommandItem>
          <CommandItem>Billing</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  ),
};

