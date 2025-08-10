import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../../components/ui/resizable';

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'UI/Resizable',
  component: ResizablePanelGroup,
};

export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;

export const Basic: Story = {
  render: () => (
    <div className="h-48 border">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <div className="h-full p-2">Left</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="h-full p-2">Right</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

