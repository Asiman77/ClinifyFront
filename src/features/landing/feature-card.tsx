import { ProductFrame } from "./product-frame";

type FeatureCardProps = {
    title: string;
    body: string;
    alt: string;
    src: string;
};

export function FeatureCard({
    title,
    body,
    alt,
    src,
}: FeatureCardProps) {
    return (
        <article className="flex flex-col gap-4">
            <ProductFrame  src={src} alt={alt} sizes="(min-width: 640px) 50vw, 100vw" /> 
            <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-semibold text-foreground">
                    {title}
                </h3> 
                <p className="text-sm text-pretty text-muted-foreground">
                    {body}
                </p>
            </div>
        </article>
    );
}