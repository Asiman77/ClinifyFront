import { CountBarLoader } from "@/features/charts/count-bar-loader";
import type {
    DistributionDonutDatum,
} from "@/features/charts/distribution-donut";
import {
    DoctorStatusDonutLoader,
} from "@/features/charts/doctor-status-donut-loader";
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
    const doctorsPerDepartment = departments
        .map((department) => ({
            label: department.name,
            count: doctors.filter(
                (doctor) =>
                    doctor.departmentId === department.id,
            ).length,
        }))
        .filter((item) => item.count > 0);

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
            count:
                doctors.length - activeDoctorCount,
            color: "grey",
        },
    ];

    return (
        <div className="grid gap-8 sm:grid-cols-2">
            <section className="flex flex-col gap-2">
                <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Doctors per department
                </h2>

                <CountBarLoader
                    data={doctorsPerDepartment}
                    countLabel="Doctors"
                />
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Doctor status
                </h2>

                <DoctorStatusDonutLoader
                    data={doctorStatusDistribution}
                    totalLabel="Doctors"
                />
            </section>
        </div>
    );
}