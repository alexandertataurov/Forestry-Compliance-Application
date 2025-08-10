import type { Meta, StoryObj } from "@storybook/react";
import { ChartContainer } from "./chart";

const meta: Meta<typeof ChartContainer> = { component: ChartContainer };
export default meta;
export const Primary: StoryObj<typeof ChartContainer> = { args: {} };
