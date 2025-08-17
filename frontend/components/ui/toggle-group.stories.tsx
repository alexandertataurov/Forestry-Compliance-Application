import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup } from "./toggle-group";

const meta: Meta<typeof ToggleGroup> = { component: ToggleGroup };
export default meta;
export const Primary: StoryObj<typeof ToggleGroup> = { args: {} };
