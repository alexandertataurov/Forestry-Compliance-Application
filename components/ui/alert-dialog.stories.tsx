import type { Meta, StoryObj } from "@storybook/react";
import { AlertDialog } from "./alert-dialog";

const meta: Meta<typeof AlertDialog> = { component: AlertDialog };
export default meta;
export const Primary: StoryObj<typeof AlertDialog> = { args: {} };
