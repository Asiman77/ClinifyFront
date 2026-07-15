import type { ComponentProps, ReactNode } from "react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { LinkButton } from "@/components/link-button";
import { cn } from "@/lib/utils";

type LandingCtaTone = "solid" | "glass" | "primary";

const CTA_STYLES: Record<LandingCtaTone, string> = {
    solid: "bg-white text-neutral-950 shadow-sm hover:bg-white/90",
    glass: "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
};

type LandingCtaProps = Omit<
    ComponentProps<typeof LinkButton>,
    "variant"
> & {
    tone?: LandingCtaTone;
    chevron?: boolean;
    children: ReactNode;
};

export function LandingCta({
    tone = "solid",
    chevron = false,
    className,
    children,
    ...props
}: LandingCtaProps) {
    return (
        <LinkButton
            className={cn("rounded-[10px]", CTA_STYLES[tone], className)}
            {...props}
        >
            {children}
            {chevron && (
                <HugeiconsIcon icon={ArrowRight01Icon} aria-hidden />
            )}
        </LinkButton>
    );
}