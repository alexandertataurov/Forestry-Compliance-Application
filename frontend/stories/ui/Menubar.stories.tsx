import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel } from '../../components/ui/menubar';

const meta: Meta<typeof Menubar> = {
  title: 'UI/Menubar',
  component: Menubar,
};

export default meta;
type Story = StoryObj<typeof Menubar>;

export const Basic: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Options</MenubarLabel>
          <MenubarSeparator />
          <MenubarItem>New</MenubarItem>
          <MenubarItem>Open</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

