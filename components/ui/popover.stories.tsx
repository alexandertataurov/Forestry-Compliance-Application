import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "./popover";

const meta: Meta<typeof Popover> = { component: Popover };
export default meta;
export const Primary: StoryObj<typeof Popover> = { args: {} };
