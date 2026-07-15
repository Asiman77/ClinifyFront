import { LinkButton } from "@/components/link-button";
import {
    KpiRow,
    KpiTile,
} from "@/features/charts/kpi-tile";

type AdminDashboardSummaryProps = {
    departmentCount: number;
    doctorCount: number;
    activeDoctorCount: number;
    availabilityCount: number;
    activeAvailabilityCount: number;
};

export function AdminDashboardSummary({
    departmentCount,
    doctorCount,
    activeDoctorCount,
    availabilityCount,
    activeAvailabilityCount,
}: AdminDashboardSummaryProps) {
    const inactiveDoctorCount =
        doctorCount - activeDoctorCount;

    const items = [
        {
            label: "Departments",
            value: departmentCount,
            detail: `${departmentCount} clinic departments`,
            href: "/admin/departments",
        },
        {
            label: "Doctors",
            value: doctorCount,
            detail: `${activeDoctorCount} active, ${inactiveDoctorCount} inactive`,
            href: "/admin/doctors",
        },
        {
            label: "Availability windows",
            value: availabilityCount,
            detail: `${activeAvailabilityCount} currently active`,
            href: "/admin/availabilities",
        },
    ];

    return (
        <KpiRow columns={3}>
            {items.map((item) => (
                <div
                    key={item.href}
                    className="flex flex-col items-start"
                >
                    <KpiTile
                        label={item.label}
                        value={String(item.value)}
                        detail={item.detail}
                    />

                    <LinkButton
                        href={item.href}
                        variant="link"
                        size="xs"
                        className="mt-1 px-0"
                    >
                        Manage
                    </LinkButton>
                </div>
            ))}
        </KpiRow>
    );
}