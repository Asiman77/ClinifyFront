import type { LabResponseDetail } from "@/types/lab";

export function LabResultPrintView({
    response,
}: {
    response: LabResponseDetail;
}) {
    return (
        <section className="hidden print:block">
            <div className="mb-5 flex items-baseline justify-between border-b pb-2">
                <p className="font-semibold">
                    Clinify
                </p>
                <p className="text-xs text-muted-foreground">
                    Laboratory report
                </p>
            </div>

            <h2 className="text-xs font-medium uppercase text-muted-foreground">
                Laboratory result
            </h2>

            <dl className="mt-3 grid gap-5 text-sm">
                <div>
                    <dt className="text-xs font-medium uppercase text-muted-foreground">
                        Result
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap">
                        {response.resultText || "Not provided"}
                    </dd>
                </div>

                <div>
                    <dt className="text-xs font-medium uppercase text-muted-foreground">
                        Note
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap">
                        {response.note || "Not provided"}
                    </dd>
                </div>
            </dl>

            {response.files.length > 0 && (
                <div className="mt-5">
                    <h3 className="text-xs font-medium uppercase text-muted-foreground">
                        Attachments
                    </h3>

                    <ul className="mt-2 list-inside list-disc text-sm">
                        {response.files.map((file) => (
                            <li key={file.publicId}>
                                {file.originalFileName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}