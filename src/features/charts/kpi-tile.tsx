import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

// Flush stat tile (spec 009 B1) — the exact visual language of the admin
// dashboard's original stat blocks (uppercase-muted label, large tabular-nums
// value, muted detail line), extracted so every dashboard's new analytics
// share it. No card/border (owner removed those — see spec 008 R history).
export function KpiTile({
  label,
  value,
  detail,
  className,
}: {
  label: string
  value: string
  /** Muted secondary line, e.g. "N/M completed" — omitted if not given. */
  detail?: ReactNode
  className?: string
}) {
  return (
    <section className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <span className="text-3xl font-semibold tabular-nums">{value}</span>
      <span data-slot="kpi-detail" className="text-sm text-muted-foreground">
        {detail}
      </span>
    </section>
  )
}

// Grid wrapper mirroring the admin dashboard's original stat-row layout.
// `columns` picks the responsive column count so a 2-tile row (patient) and a
// 3-tile row (doctor) both read as evenly spaced, not stretched.
//
// `reserveDetail`: when a row mixes tiles that sometimes render a detail line
// with tiles that never do (e.g. a turnaround KPI whose "no data yet" caption
// is conditional, beside a plain count that has none), pass this so every
// tile reserves the detail line's height — otherwise tiles in the same row
// baseline-misalign depending on which ones happen to have a detail this
// render. Off by default: most rows are uniform (all-detail or no-detail)
// and don't need the reserved space.
export function KpiRow({
  children,
  columns = 3,
  reserveDetail = false,
  className,
}: {
  children: ReactNode
  columns?: 2 | 3 | 4
  reserveDetail?: boolean
  className?: string
}) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
  } as const
  return (
    <div
      className={cn(
        "grid gap-x-8 gap-y-6",
        cols[columns],
        reserveDetail && "[&_[data-slot=kpi-detail]]:min-h-5",
        className
      )}
    >
      {children}
    </div>
  )
}
