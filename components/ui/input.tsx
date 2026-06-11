import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 bg-transparent px-0 py-3 text-base text-white transition-colors outline-none border-0 border-b border-[#3a3a3a] font-mono text-sm placeholder:text-[#666666] focus-visible:border-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
