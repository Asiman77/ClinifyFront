import { Skeleton } from "@/components/ui/skeleton";

export function PatientDashboardSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading dashboard"
            className="flex flex-col gap-8"
        >
            <section aria-hidden="true">
                <Skeleton className="h-3 w-28 rounded-sm" />

                <div className="mt-3 flex items-center gap-3 border-y py-4">
                    <Skeleton className="size-8 rounded-full" />

                    <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="h-4 w-40 rounded-sm" />
                        <Skeleton className="h-3 w-56 rounded-sm" />
                    </div>

                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </section>

            <section aria-hidden="true">
                <Skeleton className="h-3 w-36 rounded-sm" />

                <div className="mt-3 flex flex-col gap-4">
                    {[0, 1].map((item) => (
                        <div
                            key={item}
                            className="flex items-center gap-3"
                        >
                            <Skeleton className="size-8 rounded-full" />

                            <div className="flex flex-1 flex-col gap-2">
                                <Skeleton className="h-4 w-36 rounded-sm" />
                                <Skeleton className="h-3 w-52 rounded-sm" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}