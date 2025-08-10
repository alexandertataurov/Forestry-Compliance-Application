import type { Meta, StoryObj } from "@storybook/react";
import { Collapsible } from "./collapsible";

const meta: Meta<typeof Collapsible> = { component: Collapsible };
export default meta;
export const Primary: StoryObj<typeof Collapsible> = { args: {} };
