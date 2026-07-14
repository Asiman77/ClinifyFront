import Link from "next/link";

import type { MedicalRecordSummary } from "@/types/medical-record";

export function PatientMedicalRecordRow({
    record,
}: {
    record: MedicalRecordSummary;
}) {
    const testLabel =
        record.labTestCount === 1
            ? "1 test"
            : `${record.labTestCount} tests`;

    return (
        <li>
            <Link
                href={`/patient/medical-records/${record.id}`}
                className="-mx-2 flex items-center justify-between gap-4 rounded-md px-2 py-3 outline-none transition-colors hover:bg-muted/50 focus-visible:bg-muted/50"
            >
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                        {record.diagnosis}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                        <time dateTime={record.recordDate}>
                            {formatDate(record.recordDate)}
                        </time>

                        {" \u00b7 "}

                        {record.doctorFullName}
                    </p>
                </div>

                <span className="shrink-0 whitespace-nowrap text-sm text-muted-foreground">
                    {testLabel}
                </span>
            </Link>
        </li>
    );
}

function formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    }).format(date);
}