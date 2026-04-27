import { cn } from "@/lib/utils"

type Props = {
  className?: string
}

/** SurelyPlaced logo image (brand asset — no text wordmark). */
export function SurelyPlacedLogo({ className }: Props) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}surely-placed-712.webp`}
      alt="SurelyPlaced"
      className={cn(
        "h-14 w-auto max-w-[min(100%,420px)] object-contain object-left sm:h-16 md:h-[4.75rem]",
        className,
      )}
      width={420}
      height={132}
      decoding="async"
      loading="eager"
    />
  )
}
