import PhoneInputWithCountry from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { cn } from "@/lib/utils"

type PhoneFieldProps = {
  id?: string
  value: string | undefined
  onChange: (value: string | undefined) => void
  disabled?: boolean
  "aria-invalid"?: boolean
}

/** International phone with country dial code (E.164 when valid). Default country India. */
export function PhoneField({
  id,
  value,
  onChange,
  disabled,
  "aria-invalid": ariaInvalid,
}: PhoneFieldProps) {
  return (
    <PhoneInputWithCountry
      id={id}
      international
      defaultCountry="IN"
      value={value || undefined}
      onChange={onChange}
      disabled={disabled}
      placeholder="Phone number"
      aria-invalid={ariaInvalid}
      numberInputProps={{
        className: cn(
          "!h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-sans outline-none transition-colors",
          "placeholder:text-slate-400 focus-visible:border-[#2857C4] focus-visible:ring-2 focus-visible:ring-[#2857C4]/25",
          "disabled:cursor-not-allowed disabled:opacity-50",
          ariaInvalid && "border-destructive ring-2 ring-destructive/25",
        ),
      }}
      countrySelectProps={{
        className: cn(
          "!h-10 shrink-0 rounded-xl border border-slate-200 bg-white px-2 font-sans text-sm outline-none",
          "focus-visible:border-[#2857C4] focus-visible:ring-2 focus-visible:ring-[#2857C4]/25",
        ),
      }}
      className={cn(
        "flex w-full items-stretch gap-2 [&_.PhoneInputCountryIcon]:opacity-80",
      )}
    />
  )
}
