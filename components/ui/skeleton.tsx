import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse bg-[#1f1f1f]", className)}
      {...props}
    />
  )
}

export { Skeleton }
