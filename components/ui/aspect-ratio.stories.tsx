import type { Meta, StoryObj } from "@storybook/react";
import { AspectRatio } from "./aspect-ratio";

const meta: Meta<typeof AspectRatio> = { component: AspectRatio };
export default meta;
export const Primary: StoryObj<typeof AspectRatio> = { args: {} };
