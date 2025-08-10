import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./toggle";

const meta: Meta<typeof Toggle> = { component: Toggle };
export default meta;
export const Primary: StoryObj<typeof Toggle> = { args: {} };
