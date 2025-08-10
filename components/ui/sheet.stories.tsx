import type { Meta, StoryObj } from "@storybook/react";
import { Sheet } from "./sheet";

const meta: Meta<typeof Sheet> = { component: Sheet };
export default meta;
export const Primary: StoryObj<typeof Sheet> = { args: {} };
