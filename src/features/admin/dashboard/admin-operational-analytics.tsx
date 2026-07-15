import { CountBarLoader } from "@/features/charts/count-bar-loader";
import { KpiTile } from "@/features/charts/kpi-tile";
import { StatusDonutLoader } from "@/features/charts/status-donut-loader";
import {
    APPOINTMENT_STATUSES,
    type AppointmentResponse,
} from "@/types/appointment";
import type { DoctorProfile } from "@/types/doctor";
import type { LabResponseSummary } from "@/types/lab";

const MILLISECONDS_PER_DAY =
    24 * 60 * 60 * 1000;

type AdminOperationalAnalyticsProps = {
    doctors: DoctorProfile[];
    appointments: AppointmentResponse[];
    labResponses: LabResponseSummary[];
};

export function AdminOperationalAnalytics({
    doctors,
    appointments,
    labResponses,
}: AdminOperationalAnalyticsProps) {
    const appointmentsByStatus =
        APPOINTMENT_STATUSES.map((status) => ({
            status,
            count: appointments.filter(
                (appointment) =>
                    appointment.status === status,
            ).length,
        }));

    const departmentNameByDoctorId = new Map(
        doctors.map((doctor) => [
            doctor.id,
            doctor.departmentName,
        ]),
    );

    const departmentAppointmentCounts =
        new Map<string, number>();

    for (const appointment of appointments) {
        const departmentName =
            departmentNameByDoctorId.get(
                appointment.doctorId,
            ) ?? "Unassigned";

        departmentAppointmentCounts.set(
            departmentName,
            (
                departmentAppointmentCounts.get(
                    departmentName,
                ) ?? 0
            ) + 1,
        );
    }

    const appointmentsByDepartment = Array.from(
        departmentAppointmentCounts,
        ([label, count]) => ({
            label,
            count,
        }),
    );

    const turnaroundDays = labResponses
        .filter(
            (response) =>
                response.status === "COMPLETED",
        )
        .map((response) => {
            const createdAt = new Date(
                response.createdAt,
            ).getTime();

            const completedAt = new Date(
                response.updatedAt,
            ).getTime();

            return Math.max(
                0,
                (completedAt - createdAt) /
                MILLISECONDS_PER_DAY,
            );
        })
        .filter((days) => Number.isFinite(days));

    const averageTurnaround =
        turnaroundDays.length === 0
            ? null
            : Math.round(
                (turnaroundDays.reduce(
                    (total, days) => total + days,
                    0,
                ) /
                    turnaroundDays.length) *
                10,
            ) / 10;

    return (
        <>
            <KpiTile
                label="Average lab turnaround"
                value={
                    averageTurnaround === null
                        ? "—"
                        : `${averageTurnaround} days`
                }
                detail={
                    averageTurnaround === null
                        ? "No completed lab response data"
                        : null
                }
            />

            <div className="grid gap-8 sm:grid-cols-2">
                <section className="flex flex-col gap-2">
                    <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Appointments by status
                    </h2>

                    <StatusDonutLoader
                        data={appointmentsByStatus}
                        totalLabel="Total"
                    />
                </section>

                <section className="flex flex-col gap-2">
                    <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Appointments by department
                    </h2>

                    <CountBarLoader
                        data={appointmentsByDepartment}
                        countLabel="Appointments"
                    />
                </section>
            </div>
        </>
    );
}