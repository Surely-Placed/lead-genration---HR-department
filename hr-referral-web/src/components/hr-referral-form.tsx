import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { isValidPhoneNumber } from "react-phone-number-input"
import { useMemo, useState } from "react"

import { PhoneField } from "@/components/phone-field"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { hrDisplayNameForUtmId } from "@/lib/hr-utm-map"
import { submitLeadToAppsScript } from "@/lib/submit-lead"
import { readUtmFromSearch, type UtmPayload } from "@/lib/utm-from-url"

const ctaValues = ["google_meet", "direct_call", "no_call"] as const

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  marketerName: z.string().trim().min(2, "Enter marketer name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().refine((val) => isValidPhoneNumber(val), {
    message: "Enter a valid number with country code.",
  }),
  cta: z
    .string()
    .transform((s) => (s === "" ? undefined : s))
    .pipe(
      z.enum(ctaValues, {
        message: "Choose how we should reach you.",
      }),
    ),
})

type FormInput = z.input<typeof schema>
type FormOutput = z.output<typeof schema>

function utmBanner(utm: UtmPayload) {
  const label = hrDisplayNameForUtmId(utm.utm_id)
  if (label) {
    return (
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#38BDB1]/35 bg-[#38BDB1]/12 px-4 py-2 font-sans text-sm font-semibold text-[#0f766e] shadow-sm">
        <span
          aria-hidden
          className="inline-block size-2 shrink-0 rounded-full bg-[#38BDB1]"
        />
        Shared by {label}
      </div>
    )
  }
  if (utm.utm_id) {
    return (
      <div className="mb-5 rounded-xl border border-amber-400/40 bg-amber-50 px-4 py-3 font-sans text-sm font-medium text-amber-950">
        Unknown utm_id — open the link your HR shared (with ?utm_id=…).
      </div>
    )
  }
  // return (
  //   <div className="mb-5 rounded-xl border border-amber-400/40 bg-amber-50 px-4 py-3 font-sans text-sm font-medium text-amber-950">
  //     {/* Open your HR&apos;s personal link so we can attribute this correctly. */}
  //   </div>
  // )
}

export function HrReferralForm() {
  const utm = useMemo(() => readUtmFromSearch(window.location.search), [])
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const execUrl =
    import.meta.env.GOOGLE_APPS_SCRIPT_URL ??
    import.meta.env.VITE_APPS_SCRIPT_WEB_APP_URL ??
    ""
  const webhookSecret =
    import.meta.env.GOOGLE_APPS_SCRIPT_SECRET ??
    import.meta.env.VITE_WEBHOOK_SECRET

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    reset,
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      marketerName: "",
      email: "",
      phone: "",
      cta: "",
    },
  })

  async function onSubmit(values: FormOutput) {
    setSuccessMsg(null)
    clearErrors("root")

    if (!utm.utm_id.trim()) {
      setError("root", {
        message:
          "This page must be opened using your HR’s shared link (with utm_id).",
      })
      return
    }
    if (!execUrl.trim()) {
      setError("root", {
        message:
          "Form endpoint is not configured (set GOOGLE_APPS_SCRIPT_URL in .env).",
      })
      return
    }

    const result = await submitLeadToAppsScript(
      execUrl.trim(),
      {
        name: values.name,
        email: values.email,
        phone: values.phone,
        cta: values.cta,
        utm_id: utm.utm_id,
        utm_source: utm.utm_source,
        marketer_name: values.marketerName,
      },
      webhookSecret,
    )

    if (result.ok) {
      reset({
        name: "",
        marketerName: "",
        email: "",
        phone: "",
        cta: "",
      })
      clearErrors()
      setSuccessMsg("Thanks — we received your details.")
      return
    }

    if (result.error === "DUPLICATE_EMAIL") {
      setError("root", {
        message: result.message ?? "You already submitted with this email.",
      })
      return
    }
    setError("root", {
      message: result.error || "Something went wrong.",
    })
  }

  return (
    <div className="mx-auto w-full max-w-[520px]">
      {utmBanner(utm)}

      <Card
        className={cn(
          "overflow-hidden rounded-2xl border-0 bg-white/95 shadow-[0_24px_60px_-12px_rgba(40,87,196,0.18)] ring-1 ring-[#2857C4]/10 backdrop-blur-sm",
          "before:pointer-events-none before:absolute before:inset-y-4 before:left-0 before:w-1 before:rounded-r before:bg-[#38BDB1]",
          "relative pl-1",
        )}
      >
        <CardHeader className="space-y-2 pb-2 pt-8 sm:px-8">
          <CardTitle className="font-heading text-[1.35rem] font-extrabold tracking-tight text-[#0f172a] sm:text-2xl">
            Share your details
          </CardTitle>
          <CardDescription className="font-sans text-base leading-relaxed text-slate-600">
            We&apos;ll follow up using the option you choose below. Same
            precision and consistency we bring to resumes and applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-8 sm:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-sans text-slate-700">
                Name *
              </Label>
              <Input
                id="name"
                autoComplete="name"
                placeholder="Full name"
                aria-invalid={!!errors.name}
                className="h-10 rounded-xl border-slate-200 bg-white font-sans"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketerName" className="font-sans text-slate-700">
                Marketer name *
              </Label>
              <Input
                id="marketerName"
                autoComplete="off"
                placeholder="Marketer name"
                aria-invalid={!!errors.marketerName}
                className="h-10 rounded-xl border-slate-200 bg-white font-sans"
                {...register("marketerName")}
              />
              {errors.marketerName && (
                <p className="text-xs text-destructive">
                  {errors.marketerName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-sans text-slate-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                className="h-10 rounded-xl border-slate-200 bg-white font-sans"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-sans text-slate-700">
                Phone *
              </Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneField
                    id="phone"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.phone}
                  />
                )}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
              <p className="font-sans text-[11px] leading-snug text-slate-500">
                Include country code (select country or type +code).
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta" className="font-sans text-slate-700">
                How should we reach you? *
              </Label>
              <select
                id="cta"
                aria-invalid={!!errors.cta}
                className={cn(
                  "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-sans text-sm transition-colors outline-none",
                  "focus-visible:border-[#2857C4] focus-visible:ring-2 focus-visible:ring-[#2857C4]/25",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  errors.cta &&
                    "border-destructive ring-2 ring-destructive/20",
                )}
                {...register("cta")}
              >
                <option value="" disabled>
                  Select one
                </option>
                <option value="google_meet">Google Meet</option>
                <option value="direct_call">Direct call</option>
                <option value="no_call">No call</option>
              </select>
              {errors.cta && (
                <p className="text-xs text-destructive">{errors.cta.message}</p>
              )}
            </div>

            {successMsg && (
              <div
                className="rounded-xl border border-[#38BDB1]/40 bg-[#38BDB1]/10 px-4 py-3 font-sans text-sm font-medium text-[#0f766e]"
                role="status"
              >
                {successMsg}
              </div>
            )}

            {errors.root && (
              <div
                className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 font-sans text-sm text-destructive"
                role="alert"
              >
                {errors.root.message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="font-heading mt-2 h-12 w-full rounded-full bg-[#2857C4] text-[15px] font-bold tracking-wide text-white shadow-[0_12px_28px_-4px_rgba(40,87,196,0.45)] transition-colors hover:bg-[#1f4aa3]"
            >
              {isSubmitting ? "Submitting…" : "Submit"}
            </Button>

            <p className="font-sans text-[11px] leading-relaxed text-slate-400">
              We only use this information to respond to your request.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
