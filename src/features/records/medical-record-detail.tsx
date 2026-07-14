import { LabStatusBadge } from "@/features/lab/components/lab-status-badge";
import { MedicalRecordFiles } from "@/features/records/medical-record-files";
import type { MedicalRecord } from "@/types/medical-record";

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
                    {" \u00b7 "}
                    {record.doctorFullName}
                    {" \u00b7 "}
                    {formatDate(record.recordDate)}
                </p>
            </header>

            <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                    <dt className="text-xs font-medium uppercase text-muted-foreground">
                        Symptoms
                    </dt>

                    <dd className="mt-1">
                        {record.symptoms || "Not provided"}
                    </dd>
                </div>

                <div>
                    <dt className="text-xs font-medium uppercase text-muted-foreground">
                        Prescription and recommendations
                    </dt>

                    <dd className="mt-1">
                        {record.receipt || "Not provided"}
                    </dd>
                </div>
            </dl>

            <section aria-labelledby="medical-record-lab-results">
                <h2
                    id="medical-record-lab-results"
                    className="text-xs font-medium uppercase text-muted-foreground"
                >
                    Lab results
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
                                className="flex flex-col gap-3 py-4"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-sm font-medium">
                                        {response.testName}
                                    </p>

                                    <LabStatusBadge
                                        status={response.status}
                                    />
                                </div>

                                {response.note && (
                                    <div>
                                        <p className="text-xs font-medium uppercase text-muted-foreground">
                                            Note
                                        </p>

                                        <p className="mt-1 whitespace-pre-line text-sm">
                                            {response.note}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-xs font-medium uppercase text-muted-foreground">
                                        Result
                                    </p>

                                    <p className="mt-1 whitespace-pre-line text-sm">
                                        {response.resultText ||
                                            "No result has been added yet."}
                                    </p>
                                </div>

                                {response.files.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-xs font-medium uppercase text-muted-foreground">
                                            Attachments
                                        </p>

                                        <MedicalRecordFiles
                                            files={response.files}
                                        />
                                    </div>
                                )}
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
        dateStyle: "medium",
    }).format(date);
}