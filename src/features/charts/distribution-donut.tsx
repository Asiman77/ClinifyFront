"use client"

import { useMemo } from "react"

import {
  type ChartConfig,
  type DitherColor,
  Pie,
  PieChart,
} from "@/components/dither-kit"
import { PALETTE, rgb } from "@/components/dither-kit/palette"

// The legend swatch reuses the exact fill hue the canvas paints each slice
// with, so the dot beside a label matches its wedge.
const ditherSwatch = (color: DitherColor) => rgb(PALETTE[color].fill)

// A `type` (not `interface`) so it's structurally assignable to dither-kit's
// `Record<string, unknown>` data-row constraint without a leaky index signature.
export type DistributionDonutDatum = {
  key: string
  label: string
  count: number
  /** A slot in dither-kit's fixed 7-color palette (no arbitrary hex). */
  color: DitherColor
}

// Generic part-of-whole donut (spec 008 R4, rebuilt on dither-kit): a dithered
// canvas ring + legend with counts. `StatusDonut` wraps this for the
// appointment/lab status palette; other distributions (e.g. active/inactive
// doctors, which aren't a clinical status) render straight against this base
// with their own dither colors.
//
// Note: the previous Recharts version drew the running total in the ring's
// center. dither-kit's pie canvas paints slices only (no center-label slot), so
// the total now rides in the legend caption rather than the hole — the number
// isn't lost, just relocated.
export function DistributionDonut({
  data,
  totalLabel,
  className,
}: {
  data: DistributionDonutDatum[]
  /** Caption for the running total shown beside the legend, e.g. "total". */
  totalLabel: string
  className?: string
}) {
  const parts = useMemo(() => data.filter((d) => d.count > 0), [data])
  const total = useMemo(
    () => parts.reduce((sum, d) => sum + d.count, 0),
    [parts]
  )

  const config = useMemo<ChartConfig>(() => {
    const entries: ChartConfig = {}
    for (const part of parts) {
      entries[part.key] = { label: part.label, color: part.color }
    }
    return entries
  }, [parts])

  if (total === 0) return null

  return (
    <div className={className}>
      {/* Explicit height so the canvas measures a non-zero box (it sizes to
          its container via ResizeObserver). */}
      <div className="mx-auto h-56 w-full max-w-56">
        <PieChart
          data={parts}
          config={config}
          dataKey="count"
          nameKey="key"
          innerRadius={0.6}
        >
          <Pie />
        </PieChart>
      </div>
      <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        {parts.map((part) => (
          <li
            key={part.key}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: ditherSwatch(part.color) }}
            />
            <span>{part.label}</span>
            <span className="font-mono tabular-nums text-foreground">
              {part.count}
            </span>
          </li>
        ))}
        <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{totalLabel}</span>
          <span className="font-mono tabular-nums text-foreground">
            {total}
          </span>
        </li>
      </ul>
    </div>
  )
}
