import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./breadcrumb";

const meta: Meta<typeof Breadcrumb> = { component: Breadcrumb };
export default meta;
export const Primary: StoryObj<typeof Breadcrumb> = { args: {} };
