import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./select";

const meta: Meta<typeof Select> = { component: Select };
export default meta;
export const Primary: StoryObj<typeof Select> = { args: {} };
