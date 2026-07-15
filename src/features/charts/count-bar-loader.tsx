"use client";

import dynamic from "next/dynamic";

import type { CountBarDatum } from "./count-bar";

const CountBarImpl = dynamic(() =>
    import("./count-bar").then(
        (module) => module.CountBar,
    ),
);

type CountBarLoaderProps = {
    data: CountBarDatum[];
    countLabel: string;
    className?: string;
};

export function CountBarLoader(
    props: CountBarLoaderProps,
) {
    return <CountBarImpl {...props} />;
}