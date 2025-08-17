import type { Meta, StoryObj } from "@storybook/react";
import { ImageWithFallback } from "./ImageWithFallback";

const meta: Meta<typeof ImageWithFallback> = { component: ImageWithFallback };
export default meta;
export const Primary: StoryObj<typeof ImageWithFallback> = { args: {} };
