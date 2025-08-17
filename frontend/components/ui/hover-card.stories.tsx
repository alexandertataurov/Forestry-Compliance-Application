import type { Meta, StoryObj } from "@storybook/react";
import { HoverCard } from "./hover-card";

const meta: Meta<typeof HoverCard> = { component: HoverCard };
export default meta;
export const Primary: StoryObj<typeof HoverCard> = { args: {} };
