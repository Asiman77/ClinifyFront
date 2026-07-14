"use client"

import dynamic from "next/dynamic"

import type { StatusDonutDatum } from "./status-donut"

// Code-split but SSR'd (owner feedback: no loading flash). dither-kit is
// SSR-safe — all canvas/ResizeObserver access lives in effects — so the chart
// structure + legend render on the server and the canvas paints on hydrate.
const StatusDonutImpl = dynamic(() =>
  import("./status-donut").then((m) => m.StatusDonut)
)

export function StatusDonutLoader(props: {
  data: StatusDonutDatum[]
  totalLabel: string
  className?: string
}) {
  return <StatusDonutImpl {...props} />
}
