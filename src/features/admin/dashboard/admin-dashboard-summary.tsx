import { LinkButton } from "@/components/link-button";

type AdminDashboardSummaryProps = {
    departmentCount: number;
    doctorCount: number;
    activeDoctorCount: number;
    availabilityCount: number;
};

export function AdminDashboardSummary({
    departmentCount,
    doctorCount,
    activeDoctorCount,
    availabilityCount,
}: AdminDashboardSummaryProps) {
    const inactiveDoctorCount =
        doctorCount - activeDoctorCount;

    const stats = [
        {
            label: "Departments",
            value: String(departmentCount),
            detail: null,
            href: "/admin/departments",
        },
        {
            label: "Doctors",
            value: String(doctorCount),
            detail: `${activeDoctorCount} active, ${inactiveDoctorCount} inactive`,
            href: "/admin/doctors",
        },
        {
            label: "Availability windows",
            value: String(availabilityCount),
            detail: null,
            href: "/admin/availabilities",
        },
    ];

    return (
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
            {stats.map((stat) => (
                <section
                    key={stat.href}
                    className="flex flex-col gap-0.5"
                >
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {stat.label}
                    </span>

                    <span className="text-3xl font-semibold tabular-nums">
                        {stat.value}
                    </span>

                    <span className="min-h-5 text-sm text-muted-foreground">
                        {stat.detail}
                    </span>

                    <LinkButton
                        href={stat.href}
                        variant="link"
                        size="xs"
                        className="mt-1 self-start px-0"
                    >
                        Manage
                    </LinkButton>
                </section>
            ))}
        </div>
    );
}