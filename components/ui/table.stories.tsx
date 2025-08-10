import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./table";

const meta: Meta<typeof Table> = { component: Table };
export default meta;
export const Primary: StoryObj<typeof Table> = { args: {} };
