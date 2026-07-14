"use client";

import dynamic from "next/dynamic";

import type {
    DistributionDonutDatum,
} from "./distribution-donut";

const DistributionDonutImpl = dynamic(() =>
    import("./distribution-donut").then(
        (module) => module.DistributionDonut,
    ),
);

export function DoctorStatusDonutLoader(props: {
    data: DistributionDonutDatum[];
    totalLabel: string;
    className?: string;
}) {
    return <DistributionDonutImpl {...props} />;
}