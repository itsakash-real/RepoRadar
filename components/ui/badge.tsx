import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent px-2 py-0.5 text-xs font-normal whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-white/30 aria-invalid:border-[#d4a017] [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-white/10 text-white/80 border-white/10",
        secondary:
          "bg-[#141414] text-[#999999] border-[#262626]",
        destructive:
          "bg-[#d4a017]/10 text-[#d4a017] border-[#d4a017]/30",
        outline:
          "border-[#262626] text-white",
        ghost:
          "border-transparent text-[#999999] hover:bg-white/5",
        link: "text-[#c3d9f3] underline-offset-4 hover:underline border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
