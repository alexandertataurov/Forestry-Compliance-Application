import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu } from "./dropdown-menu";

const meta: Meta<typeof DropdownMenu> = { component: DropdownMenu };
export default meta;
export const Primary: StoryObj<typeof DropdownMenu> = { args: {} };
