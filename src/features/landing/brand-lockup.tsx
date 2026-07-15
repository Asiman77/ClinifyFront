import { HealthIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

type BrandLockupProps = {
    tone?: "default" | "light";
    className?: string;
};

export function BrandLockup({
    tone = "default",
    className,
}: BrandLockupProps) {
    const isLight = tone === "light";

    return (
        <span className={cn("inline-flex items-center gap-2", className)}>
            <HugeiconsIcon
                icon={HealthIcon}
                className={cn("size-6 shrink-0", isLight ? "text-white" : "text-primary",)}
                aria-hidden
            />

            <span className={cn("text-lg font-semibold", isLight ? "text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.25)]" : "text-foreground",)}>
                Clinify
            </span>
        </span>
    );
}