import type { Meta, StoryObj } from "@storybook/react";
import { Analytics } from "./Analytics";

const meta: Meta<typeof Analytics> = { component: Analytics };
export default meta;
export const Primary: StoryObj<typeof Analytics> = { args: {} };
