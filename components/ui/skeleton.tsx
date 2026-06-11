import { cn } from "@/lib/utils"

function Skeleton({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse", className)}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: "4px",
        ...style,
      }}
      {...props}
    />
  )
}

export { Skeleton }
