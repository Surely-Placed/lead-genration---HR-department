import { cn } from "@/lib/utils"

type Props = {
  className?: string
  size?: "default" | "lg"
}

/** Wordmark aligned with SurelyPlaced brand colors (#2857C4 primary, #38BDB1 accent). */
export function SurelyPlacedWordmark({ className, size = "default" }: Props) {
  return (
    <span
      className={cn(
        "font-heading inline-block tracking-tight text-[#2857C4]",
        size === "lg"
          ? "text-[1.75rem] font-extrabold leading-[1.15] sm:text-[2rem]"
          : "text-xl font-extrabold leading-tight sm:text-2xl",
        className,
      )}
    >
      Surely
      <span className="text-[#38BDB1]">Placed</span>
    </span>
  )
}
