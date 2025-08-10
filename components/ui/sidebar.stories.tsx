import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./sidebar";

const meta: Meta<typeof Sidebar> = { component: Sidebar };
export default meta;
export const Primary: StoryObj<typeof Sidebar> = { args: {} };
