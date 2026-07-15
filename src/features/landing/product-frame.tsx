import Image from "next/image";

import { cn } from "@/lib/utils";

type ProductFrameProps = {
    src: string;
    alt: string;
    priority?: boolean;
    className?: string;
    sizes?: string;
};

export function ProductFrame({
    src,
    alt,
    priority = false,
    className,
    sizes = "(min-width: 1024px) 1000px, 100vw",
}: ProductFrameProps) {
    return (
        <div
            className={cn(
                "relative aspect-[16/10] overflow-hidden rounded-md",
                "border-4 border-black/10 bg-muted shadow-2xl",
                className,
            )}
        >
            <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                sizes={sizes}
                className="object-cover object-left-top"
            />
        </div>
    );
}