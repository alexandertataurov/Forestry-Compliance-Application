import type { Meta, StoryObj } from "@storybook/react";
import { DiameterCalculation } from "./DiameterCalculation";

const meta: Meta<typeof DiameterCalculation> = { component: DiameterCalculation };
export default meta;
export const Primary: StoryObj<typeof DiameterCalculation> = { args: {} };
