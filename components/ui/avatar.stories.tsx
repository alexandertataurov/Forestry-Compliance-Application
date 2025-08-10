import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./avatar";

const meta: Meta<typeof Avatar> = { component: Avatar };
export default meta;
export const Primary: StoryObj<typeof Avatar> = { args: {} };
