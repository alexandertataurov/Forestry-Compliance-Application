import type { Meta, StoryObj } from "@storybook/react";
import { ResizablePanelGroup } from "./resizable";

const meta: Meta<typeof ResizablePanelGroup> = { component: ResizablePanelGroup };
export default meta;
export const Primary: StoryObj<typeof ResizablePanelGroup> = { args: {} };
