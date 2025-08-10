import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./tooltip";

const meta: Meta<typeof Tooltip> = { component: Tooltip };
export default meta;
export const Primary: StoryObj<typeof Tooltip> = { args: {} };
