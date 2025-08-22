import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    },
    gap: {
      none: "gap-0",
      xs: "gap-xs",
      sm: "gap-sm",
      md: "gap-md",
      lg: "gap-lg",
      xl: "gap-xl",
      "2xl": "gap-2xl",
    },
    gapX: {
      none: "gap-x-0",
      xs: "gap-x-xs",
      sm: "gap-x-sm",
      md: "gap-x-md",
      lg: "gap-x-lg",
      xl: "gap-x-xl",
      "2xl": "gap-x-2xl",
    },
    gapY: {
      none: "gap-y-0",
      xs: "gap-y-xs",
      sm: "gap-y-sm",
      md: "gap-y-md",
      lg: "gap-y-lg",
      xl: "gap-y-xl",
      "2xl": "gap-y-2xl",
    },
  },
  defaultVariants: {
    cols: 1,
    gap: "md",
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, gapX, gapY, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(gridVariants({ cols, gap, gapX, gapY, className }))}
        {...props}
      />
    );
  }
);

Grid.displayName = "Grid";

// Grid Item component
const gridItemVariants = cva("", {
  variants: {
    colSpan: {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      5: "col-span-5",
      6: "col-span-6",
      12: "col-span-12",
      full: "col-span-full",
    },
    rowSpan: {
      1: "row-span-1",
      2: "row-span-2",
      3: "row-span-3",
      4: "row-span-4",
      5: "row-span-5",
      6: "row-span-6",
      full: "row-span-full",
    },
  },
  defaultVariants: {
    colSpan: 1,
    rowSpan: 1,
  },
});

export interface GridItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, colSpan, rowSpan, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(gridItemVariants({ colSpan, rowSpan, className }))}
        {...props}
      />
    );
  }
);

GridItem.displayName = "GridItem";

export { Grid, GridItem, gridVariants, gridItemVariants };
