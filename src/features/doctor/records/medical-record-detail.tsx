import { LabStatusBadge } from "@/features/doctor/records/lab-status-badge";
import type { MedicalRecord } from "@/features/doctor/records/types";

export function MedicalRecordDetail({
    record,
}: {
    record: MedicalRecord;
}) {
    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-xl font-semibold tracking-tight">
                    {record.diagnosis}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {record.patientFullName}
                    {" \u00B7 "}
                    {record.doctorFullName}
                    {" \u00B7 "}
                    {formatDate(record.recordDate)}
                </p>
            </header>

            <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Symptoms
                    </dt>
                    <dd className="mt-1">{record.symptoms || "Not provided"}</dd>
                </div>
                <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Prescription and recommendations
                    </dt>
                    <dd className="mt-1">{record.receipt || "Not provided"}</dd>
                </div>
            </dl>

            <section aria-labelledby="record-lab-tests-title">
                <h2 id="record-lab-tests-title" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Lab tests
                </h2>

                {record.labResponses.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                        No lab tests were ordered.
                    </p>
                ) : (
                    <ul className="mt-1 divide-y">
                        {record.labResponses.map((response) => (
                            <li
                                key={response.id}
                                className="flex items-start justify-between gap-4 py-3"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-medium">
                                        {response.testName}
                                    </p>
                                    {response.note && (
                                        <p className="mt-0.5 text-sm text-muted-foreground">
                                            {response.note}
                                        </p>
                                    )}
                                </div>
                                <LabStatusBadge status={response.status} />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

function formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}
