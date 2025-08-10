import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./pagination";

const meta: Meta<typeof Pagination> = { component: Pagination };
export default meta;
export const Primary: StoryObj<typeof Pagination> = { args: {} };
