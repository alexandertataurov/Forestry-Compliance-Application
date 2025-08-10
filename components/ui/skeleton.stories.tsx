import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";

const meta: Meta<typeof Skeleton> = { component: Skeleton };
export default meta;
export const Primary: StoryObj<typeof Skeleton> = { args: {} };
