import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./calendar";

const meta: Meta<typeof Calendar> = { component: Calendar };
export default meta;
export const Primary: StoryObj<typeof Calendar> = { args: {} };
