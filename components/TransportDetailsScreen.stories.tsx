import type { Meta, StoryObj } from "@storybook/react";
import { TransportDetailsScreen } from "./TransportDetailsScreen";

const meta: Meta<typeof TransportDetailsScreen> = { component: TransportDetailsScreen };
export default meta;
export const Primary: StoryObj<typeof TransportDetailsScreen> = { args: {} };
