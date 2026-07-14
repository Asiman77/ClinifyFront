import Link from "next/link";

import { LabStatusBadge } from "@/features/lab/components/lab-status-badge";
import type { PatientLabResultSummary } from "@/types/medical-record";

export function PatientLabResultRow({
    result,
}: {
    result: PatientLabResultSummary;
}) {
    return (
        <li>
            <Link
                href={`/patient/medical-records/${result.medicalRecordId}`}
                className="-mx-2 flex flex-col gap-2 rounded-md px-2 py-3 outline-none transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                        {result.testName}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                        {result.diagnosis}
                        {" \u00b7 "}

                        <time dateTime={result.recordDate}>
                            {formatDate(result.recordDate)}
                        </time>
                    </p>
                </div>

                <LabStatusBadge status={result.status} />
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