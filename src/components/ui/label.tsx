import * as React from "react"
import { type VariantProps, cva } from "class-variance-authority" // Assuming cva is available or I should mock it. Wait, I should stick to simple tailwind if cva is not there.
// Actually standard shadcn uses cva. I'll check if cva is installed. 
// Just in case, I will make a simple Label without cva dependency to avoid errors if checking is too slow, 
// but shadcn usually needs Radix.
// Let's implement a simple version first.

import { cn } from "@/lib/utils"

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            className
        )}
        {...props}
    />
))
Label.displayName = "Label"

export { Label }
