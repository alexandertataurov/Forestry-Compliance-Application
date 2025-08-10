import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./alert";

const meta: Meta<typeof Alert> = { component: Alert };
export default meta;
export const Primary: StoryObj<typeof Alert> = { args: {} };
