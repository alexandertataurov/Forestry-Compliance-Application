import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta: Meta<typeof Input> = { component: Input };
export default meta;
export const Primary: StoryObj<typeof Input> = { args: {} };
