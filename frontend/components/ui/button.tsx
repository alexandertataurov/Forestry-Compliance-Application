import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-label font-label transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:ring-offset-2 aria-invalid:ring-brand-error/20 aria-invalid:border-brand-error min-touch-target",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary text-brand-on-primary hover:bg-brand-primary/90 active:bg-brand-primary/95 shadow-1",
        secondary: "bg-brand-secondary text-brand-on-secondary hover:bg-brand-secondary/90 active:bg-brand-secondary/95 shadow-1",
        tertiary: "bg-brand-tertiary text-brand-on-tertiary hover:bg-brand-tertiary/90 active:bg-brand-tertiary/95 shadow-1",
        destructive: "bg-brand-error text-brand-on-error hover:bg-brand-error/90 active:bg-brand-error/95 shadow-1",
        outline: "border border-surface-border bg-surface-bg text-surface-on-surface hover:bg-surface-bg-variant hover:border-surface-border-variant",
        ghost: "text-surface-on-surface hover:bg-surface-bg-variant hover:text-surface-on-variant",
        link: "text-brand-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-sm py-xs gap-xs rounded-sm text-label-small",
        default: "h-10 px-md py-sm gap-sm rounded-md text-label",
        lg: "h-12 px-lg py-md gap-md rounded-lg text-body-small",
        icon: "size-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
