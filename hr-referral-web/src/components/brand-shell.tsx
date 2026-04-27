import type { ReactNode } from "react"

import { SurelyPlacedLogo } from "@/components/surely-placed-logo"

/**
 * Page chrome: SurelyPlaced brand palette (#F2F2F2 / #2857C4 / #38BDB1),
 * brochure-inspired hero strip and footer (Corporate Brochure.pdf).
 */
export function BrandShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#F2F2F2] text-slate-900">
      {/* Soft brand glow — primary + teal */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(40,87,196,0.14),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-5%] top-[8%] h-[min(420px,50vw)] w-[min(420px,50vw)] rounded-full bg-[#38BDB1]/[0.14] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[5%] left-[-8%] h-72 w-72 rounded-full bg-[#2857C4]/[0.08] blur-3xl"
      />

      <div className="relative z-[1] flex min-h-screen flex-col">
        <header className="border-b border-[#2857C4]/10 bg-white/75 px-4 py-6 backdrop-blur-md sm:px-6">
          <div className="mx-auto flex max-w-[1100px] flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <SurelyPlacedLogo />
              <p className="max-w-md font-sans text-sm font-medium leading-snug text-slate-600">
                Move from rejections to offers — structured, end-to-end support
                for full-time roles at leading companies.
              </p>
            </div>
            <p className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#38BDB1] uppercase">
              HR referral
            </p>
          </div>
        </header>

        <main className="flex flex-1 flex-col px-4 py-10 sm:px-6">{children}</main>

        <footer className="border-t border-slate-200/80 bg-white/60 px-4 py-6 backdrop-blur-sm sm:px-6">
          <div className="mx-auto flex max-w-[1100px] flex-col gap-3 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <span>
              {/* <a
                href="https://www.surelyplaced.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#2857C4] underline-offset-4 hover:underline"
              >
                surelyplaced.com
              </a> */}
              <span className="mx-2 text-slate-300">·</span>
              <a
                href="mailto:contact@surelyplaced.com"
                className="text-slate-600 underline-offset-4 hover:underline"
              >
                contact@surelyplaced.com
              </a>
            </span>
            <span className="text-slate-400">
              Salt Lake City, Utah, USA
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}
