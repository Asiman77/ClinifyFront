"use client";

import { useRef } from "react";
import Link from "next/link";

import { PrintButton } from "@/components/print-button";
import { LabStatusBadge } from "@/features/lab/components/lab-status-badge";
import { MedicalRecordFiles } from "@/features/records/medical-record-files";
import type { PatientLabResultSummary } from "@/types/lab";

export function PatientLabResultRow({
    result,
}: {
    result: PatientLabResultSummary;
}) {
    const files = result.files ?? [];
    const printRef = useRef<HTMLLIElement>(null);

    function handlePrint() {
        const target = printRef.current;

        if (!target) {
            return;
        }

        function cleanup() {
            document.body.classList.remove(
                "printing-lab-result",
            );
            target?.removeAttribute("data-print-target");
        }

        document.body.classList.add("printing-lab-result");
        target.setAttribute("data-print-target", "true");

        window.addEventListener("afterprint", cleanup, {
            once: true,
        });

        window.print();
    }
    return (
        <li ref={printRef} className="py-5 first:pt-0 last:pb-0">
            <div className="mb-6 hidden items-center justify-between border-b pb-3 print:flex">
                <p className="font-semibold">Clinify</p>
                <p className="text-xs text-muted-foreground">
                    Laboratory report
                </p>
            </div>
            <div className="flex items-start justify-between gap-4">
                <Link
                    href={`/patient/medical-records/${result.medicalRecordId}`}
                    className="min-w-0 rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <h2 className="truncate text-sm font-medium">
                        {result.testName}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {result.diagnosis}
                        {" \u00b7 "}

                        <time dateTime={result.recordDate}>
                            {formatDate(result.recordDate)}
                        </time>
                    </p>
                </Link>

                <div className="flex shrink-0 items-center gap-2">
                    <LabStatusBadge status={result.status} />
                    <PrintButton onPrint={handlePrint} />
                </div>
            </div>

            <div className="mt-4 grid gap-4 rounded-md border bg-muted/20 p-4">
                <section>
                    <h3 className="text-xs font-medium uppercase text-muted-foreground">
                        Result
                    </h3>

                    <p className="mt-1 whitespace-pre-wrap text-sm">
                        {result.resultText?.trim() ||
                            "Result details are not available yet."}
                    </p>
                </section>

                {result.note?.trim() && (
                    <section>
                        <h3 className="text-xs font-medium uppercase text-muted-foreground">
                            Technician note
                        </h3>

                        <p className="mt-1 whitespace-pre-wrap text-sm">
                            {result.note}
                        </p>
                    </section>
                )}

                <section>
                    <h3 className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                        Attachments
                    </h3>

                    <MedicalRecordFiles files={files} />
                </section>
            </div>
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