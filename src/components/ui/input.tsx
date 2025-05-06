import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Input component with accessibility features
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Input id="email" aria-describedby="email-description" />
 * <p id="email-description">Enter your email address</p>
 * 
 * // With error message
 * <Input id="username" aria-invalid={Boolean(error)} aria-describedby="username-error" />
 * {error && <p id="username-error" className="text-red-500">{error}</p>}
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        id={id}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
