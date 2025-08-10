import type { Meta, StoryObj } from "@storybook/react";
import { useFormField } from "./form";

const meta: Meta<typeof useFormField> = { component: useFormField };
export default meta;
export const Primary: StoryObj<typeof useFormField> = { args: {} };
