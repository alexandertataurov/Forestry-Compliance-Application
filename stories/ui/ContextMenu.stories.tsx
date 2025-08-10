import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from '../../components/ui/button';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel } from '../../components/ui/context-menu';

const meta: Meta<typeof ContextMenu> = {
  title: 'UI/ContextMenu',
  component: ContextMenu,
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Basic: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button>Right click me</Button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Options</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

