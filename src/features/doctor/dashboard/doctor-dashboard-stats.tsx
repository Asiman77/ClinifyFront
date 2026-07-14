import {
    KpiRow,
    KpiTile,
} from "@/features/charts/kpi-tile";

type DoctorDashboardStatsProps = {
    upcoming: number;
    patients: number;
    records: number;
};

export function DoctorDashboardStats({
    upcoming,
    patients,
    records,
}: DoctorDashboardStatsProps) {
    return (
        <KpiRow columns={3}>
            <KpiTile label="Upcoming" value={String(upcoming)} />
            <KpiTile label="Patients" value={String(patients)} />
            <KpiTile
                label="Records authored"
                value={String(records)}
            />
        </KpiRow>
    );
}