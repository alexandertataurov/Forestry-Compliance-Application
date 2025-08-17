import type { Meta, StoryObj } from "@storybook/react";
import { VolumeCalculator } from "./VolumeCalculator";

const meta: Meta<typeof VolumeCalculator> = { component: VolumeCalculator };
export default meta;
export const Primary: StoryObj<typeof VolumeCalculator> = { args: {} };
