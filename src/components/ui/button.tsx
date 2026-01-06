import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
  " hover-elevate active-elevate-2",
  {
    variants: {
      variant: {
        default:
          "btn-swipe btn-swipe-to-white border shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive-border",
        outline:
          "btn-swipe btn-swipe-to-teal border shadow-xs active:shadow-none",
        secondary: "btn-swipe btn-swipe-to-teal border shadow-sm",
        // Add a transparent border so that when someone toggles a border on later, it doesn't shift layout/size.
        ghost: "border border-transparent",
        cyanGlow:
          "bg-[#48c5db] text-black border border-gray-400 transition-all duration-300 " +
          "hover:border-[#48c5db] hover:bg-[#48c5db]/10 hover:text-white " +
          "focus-visible:ring-2 focus-visible:ring-[#48c5db] " +
          "disabled:opacity-50 disabled:cursor-not-allowed " +
          "[box-shadow:0_0_8px_rgba(0,0,0,0.5),0_4px_8px_rgba(0,0,0,0.3)] " +
          "hover:[box-shadow:0_0_20px_rgba(72,197,219,0.8),0_0_40px_rgba(72,197,219,0.4),0_4px_12px_rgba(72,197,219,0.3)] " +
          "no-default-hover-elevate no-default-active-elevate",
      },
      // Heights are set as "min" heights, because sometimes Ai will place large amount of content
      // inside buttons. With a min-height they will look appropriate with small amounts of content,
      // but will expand to fit large amounts of content.
      size: {
        default: "min-h-9 px-4 py-2",
        sm: "min-h-8 rounded-md px-3 text-xs",
        lg: "min-h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
