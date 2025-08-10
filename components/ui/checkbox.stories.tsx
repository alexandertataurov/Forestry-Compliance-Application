import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = { component: Checkbox };
export default meta;
export const Primary: StoryObj<typeof Checkbox> = { args: {} };
