import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "./sonner";

const meta: Meta<typeof Toaster> = { component: Toaster };
export default meta;
export const Primary: StoryObj<typeof Toaster> = { args: {} };
