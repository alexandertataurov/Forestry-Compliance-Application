import type { Meta, StoryObj } from "@storybook/react";
import { NavigationMenu } from "./navigation-menu";

const meta: Meta<typeof NavigationMenu> = { component: NavigationMenu };
export default meta;
export const Primary: StoryObj<typeof NavigationMenu> = { args: {} };
