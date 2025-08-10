import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = { component: Slider };
export default meta;
export const Primary: StoryObj<typeof Slider> = { args: {} };
