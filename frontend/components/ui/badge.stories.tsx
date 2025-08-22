import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = { component: Badge };
export default meta;
export const Primary: StoryObj<typeof Badge> = { args: {} };
