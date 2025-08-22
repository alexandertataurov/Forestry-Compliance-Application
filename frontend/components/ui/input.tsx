import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-surface-on-surface placeholder:text-surface-on-variant selection:bg-brand-primary selection:text-brand-on-primary bg-surface-bg border-surface-border flex h-10 w-full min-w-0 rounded-md border px-md py-sm text-body bg-surface-bg transition-all outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-label file:font-label disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:ring-offset-2",
        "aria-invalid:ring-brand-error/20 aria-invalid:border-brand-error",
        "min-touch-target",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
