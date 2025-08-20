import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./dialog";

const meta: Meta<typeof Dialog> = { component: Dialog };
export default meta;
export const Primary: StoryObj<typeof Dialog> = { args: {} };
