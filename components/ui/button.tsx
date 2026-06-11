import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border font-mono text-sm font-normal uppercase tracking-[2.5px] whitespace-nowrap transition-all outline-none select-none bg-transparent focus-visible:ring-2 focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-white/20 text-white hover:border-white/50 hover:text-white active:border-white/70",
        outline:
          "border-white/20 text-white hover:border-white/50 aria-expanded:border-white/50",
        secondary:
          "border-white/10 text-white/60 hover:text-white hover:border-white/20",
        ghost:
          "border-transparent text-white/60 hover:text-white hover:border-white/10",
        destructive:
          "border-[#d4a017]/30 text-[#d4a017] hover:border-[#d4a017]/60",
        link: "border-transparent text-[#c3d9f3] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 gap-2 px-8",
        xs: "h-7 px-3 text-[11px] tracking-[2px]",
        sm: "h-8 gap-1.5 px-5 text-xs tracking-[2px]",
        lg: "h-12 gap-2 px-10",
        icon: "size-10 px-0",
        "icon-xs": "size-7 rounded-full",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
