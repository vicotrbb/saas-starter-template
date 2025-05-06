import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Textarea component with accessibility features
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Textarea id="comments" aria-describedby="comments-description" />
 * <p id="comments-description">Enter your feedback</p>
 * 
 * // With error message
 * <Textarea id="bio" aria-invalid={Boolean(error)} aria-describedby="bio-error" />
 * {error && <p id="bio-error" className="text-red-500">{error}</p>}
 * ```
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      id={id}
      aria-describedby={ariaDescribedby}
      aria-invalid={ariaInvalid}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
