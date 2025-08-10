import type { Meta, StoryObj } from "@storybook/react";
import { DataManagement } from "./DataManagement";

const meta: Meta<typeof DataManagement> = { component: DataManagement };
export default meta;
export const Primary: StoryObj<typeof DataManagement> = { args: {} };
