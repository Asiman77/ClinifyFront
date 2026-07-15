import { CountBar } from "@/features/charts/count-bar";
import {
    DoctorStatusDonutLoader,
} from "@/features/charts/doctor-status-donut-loader";
import type {
    DistributionDonutDatum,
} from "@/features/charts/distribution-donut";
import type { Department } from "@/types/department";
import type { DoctorProfile } from "@/types/doctor";

type AdminDoctorAnalyticsProps = {
    departments: Department[];
    doctors: DoctorProfile[];
};

export function AdminDoctorAnalytics({
    departments,
    doctors,
}: AdminDoctorAnalyticsProps) {
    const doctorsPerDepartment = departments.map(
        (department) => ({
            label: department.name,
            count: doctors.filter(
                (doctor) =>
                    doctor.departmentId === department.id,
            ).length,
        }),
    );

    const activeDoctorCount = doctors.filter(
        (doctor) => doctor.active,
    ).length;

    const doctorStatusDistribution: DistributionDonutDatum[] = [
        {
            key: "active",
            label: "Active",
            count: activeDoctorCount,
            color: "green",
        },
        {
            key: "inactive",
            label: "Inactive",
            count: doctors.length - activeDoctorCount,
            color: "grey",
        },
    ];

    return (
        <div className="grid gap-8 md:grid-cols-2">
            <section className="flex min-w-0 flex-col gap-4">
                <div>
                    <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Doctors per department
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Distribution of doctors across clinic departments.
                    </p>
                </div>

                <CountBar
                    data={doctorsPerDepartment}
                    countLabel="doctors"
                    emptyMessage="No doctors are assigned to departments."
                />
            </section>

            <section className="flex min-w-0 flex-col gap-4">
                <div>
                    <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Doctor status
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Active and inactive doctor profiles.
                    </p>
                </div>

                {doctors.length > 0 ? (
                    <DoctorStatusDonutLoader
                        data={doctorStatusDistribution}
                        totalLabel="doctors"
                    />
                ) : (
                    <p className="py-8 text-sm text-muted-foreground">
                        No doctor data available.
                    </p>
                )}
            </section>
        </div>
    );
}