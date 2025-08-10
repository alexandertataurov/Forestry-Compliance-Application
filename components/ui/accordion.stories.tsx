import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./accordion";

const meta: Meta<typeof Accordion> = { component: Accordion };
export default meta;
export const Primary: StoryObj<typeof Accordion> = { args: {} };
