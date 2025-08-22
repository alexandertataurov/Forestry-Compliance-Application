import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      display: "text-display font-display",
      headline: "text-headline font-headline",
      title: "text-title font-title",
      subtitle: "text-subtitle font-subtitle",
      "body-large": "text-body-large font-body-large",
      body: "text-body font-body",
      "body-small": "text-body-small font-body-small",
      label: "text-label font-label",
      "label-small": "text-label-small font-label-small",
      caption: "text-caption font-caption",
    },
    color: {
      primary: "text-surface-on-surface",
      secondary: "text-surface-on-variant",
      brand: "text-brand-primary",
      error: "text-brand-error",
      success: "text-state-success",
      warning: "text-state-warning",
      info: "text-state-info",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "primary",
    align: "left",
  },
});

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

const Typography = React.forwardRef<HTMLDivElement, TypographyProps>(
  ({ className, variant, color, align, as, ...props }, ref) => {
    const Comp = as || getDefaultElement(variant);
    
    return (
      <Comp
        ref={ref}
        className={cn(typographyVariants({ variant, color, align, className }))}
        {...props}
      />
    );
  }
);

Typography.displayName = "Typography";

// Helper function to determine default element based on variant
function getDefaultElement(variant?: string): keyof JSX.IntrinsicElements {
  switch (variant) {
    case "display":
    case "headline":
      return "h1";
    case "title":
      return "h2";
    case "subtitle":
      return "h3";
    case "body-large":
    case "body":
    case "body-small":
      return "p";
    case "label":
    case "label-small":
    case "caption":
      return "span";
    default:
      return "div";
  }
}

// Convenience components for common use cases
export const Display = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant" | "as">
>((props, ref) => <Typography ref={ref} variant="display" as="h1" {...props} />);
Display.displayName = "Display";

export const Headline = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant" | "as">
>((props, ref) => <Typography ref={ref} variant="headline" as="h1" {...props} />);
Headline.displayName = "Headline";

export const Title = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant" | "as">
>((props, ref) => <Typography ref={ref} variant="title" as="h2" {...props} />);
Title.displayName = "Title";

export const Subtitle = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant" | "as">
>((props, ref) => <Typography ref={ref} variant="subtitle" as="h3" {...props} />);
Subtitle.displayName = "Subtitle";

export const BodyLarge = React.forwardRef<
  HTMLParagraphElement,
  Omit<TypographyProps, "variant" | "as">
>((props, ref) => <Typography ref={ref} variant="body-large" as="p" {...props} />);
BodyLarge.displayName = "BodyLarge";

export const Body = React.forwardRef<
  HTMLParagraphElement,
  Omit<TypographyProps, "variant" | "as">
>((props, ref) => <Typography ref={ref} variant="body" as="p" {...props} />);
Body.displayName = "Body";

export const BodySmall = React.forwardRef<
  HTMLParagraphElement,
  Omit<TypographyProps, "variant" | "as">
>((props, ref) => <Typography ref={ref} variant="body-small" as="p" {...props} />);
BodySmall.displayName = "BodySmall";

export const Label = React.forwardRef<
  HTMLSpanElement,
  Omit<TypographyProps, "variant" | "as">
>((props, ref) => <Typography ref={ref} variant="label" as="span" {...props} />);
Label.displayName = "Label";

export const Caption = React.forwardRef<
  HTMLSpanElement,
  Omit<TypographyProps, "variant" | "as">
>((props, ref) => <Typography ref={ref} variant="caption" as="span" {...props} />);
Caption.displayName = "Caption";

export { Typography, typographyVariants };
