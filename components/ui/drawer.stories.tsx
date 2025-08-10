import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "./drawer";

const meta: Meta<typeof Drawer> = { component: Drawer };
export default meta;
export const Primary: StoryObj<typeof Drawer> = { args: {} };
