import type { Meta, StoryObj } from "@storybook/react";
import { Carousel } from "./carousel";

const meta: Meta<typeof Carousel> = { component: Carousel };
export default meta;
export const Primary: StoryObj<typeof Carousel> = { args: {} };
