import type { Meta, StoryObj } from "@storybook/react";
import { Dashboard } from "./Dashboard";

const meta: Meta<typeof Dashboard> = { component: Dashboard };
export default meta;
export const Primary: StoryObj<typeof Dashboard> = { args: {} };
