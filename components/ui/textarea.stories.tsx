import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = { component: Textarea };
export default meta;
export const Primary: StoryObj<typeof Textarea> = { args: {} };
