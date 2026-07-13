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
        <dl className="grid border-y sm:grid-cols-3 sm:divide-x">
            <Stat label="Upcoming" value={upcoming} />
            <Stat label="Patients" value={patients} />
            <Stat label="Records authored" value={records} />
        </dl>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-baseline justify-between py-3 sm:block sm:px-4 sm:first:pl-0 sm:last:pr-0">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums">
                {value}
            </dd>
        </div>
    );
}
