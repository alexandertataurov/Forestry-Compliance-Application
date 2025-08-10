import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";

const meta: Meta<typeof Label> = { component: Label };
export default meta;
export const Primary: StoryObj<typeof Label> = { args: {} };
