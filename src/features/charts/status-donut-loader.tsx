"use client";

import dynamic from "next/dynamic";

import type { StatusDonutDatum } from "./status-donut";

const StatusDonutImpl = dynamic(() =>
  import("./status-donut").then(
    (module) => module.StatusDonut,
  ),
);

export function StatusDonutLoader(props: {
  data: StatusDonutDatum[];
  totalLabel: string;
  className?: string;
}) {
  return <StatusDonutImpl {...props} />;
}