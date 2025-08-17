import type { Meta, StoryObj } from "@storybook/react";
import { Settings } from "./Settings";

const meta: Meta<typeof Settings> = { component: Settings };
export default meta;
export const Primary: StoryObj<typeof Settings> = { args: {} };
