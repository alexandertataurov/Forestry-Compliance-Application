import type { Meta, StoryObj } from "@storybook/react";
import { StandardSpeciesSelection } from "./StandardSpeciesSelection";

const meta: Meta<typeof StandardSpeciesSelection> = { component: StandardSpeciesSelection };
export default meta;
export const Primary: StoryObj<typeof StandardSpeciesSelection> = { args: {} };
