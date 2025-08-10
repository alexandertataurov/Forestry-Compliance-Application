import type { Meta, StoryObj } from "@storybook/react";
import { Navigation } from "./Navigation";

const meta: Meta<typeof Navigation> = { component: Navigation };
export default meta;
export const Primary: StoryObj<typeof Navigation> = { args: {} };
