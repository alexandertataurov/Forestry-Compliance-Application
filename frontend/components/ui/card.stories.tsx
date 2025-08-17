import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./card";

const meta: Meta<typeof Card> = { component: Card };
export default meta;
export const Primary: StoryObj<typeof Card> = { args: {} };
