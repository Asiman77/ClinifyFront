import type { ComponentProps } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type LinkButtonProps = Omit<
    ComponentProps<typeof Button>,
    "render" | "nativeButton"
> & {
    href: string;
};

export function LinkButton({ href, ...props }: LinkButtonProps) {
    return (
        <Button
            {...props}
            nativeButton={false}
            render={<Link href={href} />}
        />
    );
}