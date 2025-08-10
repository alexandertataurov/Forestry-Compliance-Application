import type { Meta, StoryObj } from "@storybook/react";
import { ContextMenu } from "./context-menu";

const meta: Meta<typeof ContextMenu> = { component: ContextMenu };
export default meta;
export const Primary: StoryObj<typeof ContextMenu> = { args: {} };
