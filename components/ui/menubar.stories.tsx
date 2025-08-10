import type { Meta, StoryObj } from "@storybook/react";
import { Menubar } from "./menubar";

const meta: Meta<typeof Menubar> = { component: Menubar };
export default meta;
export const Primary: StoryObj<typeof Menubar> = { args: {} };
