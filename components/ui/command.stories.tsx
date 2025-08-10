import type { Meta, StoryObj } from "@storybook/react";
import { Command } from "./command";

const meta: Meta<typeof Command> = { component: Command };
export default meta;
export const Primary: StoryObj<typeof Command> = { args: {} };
