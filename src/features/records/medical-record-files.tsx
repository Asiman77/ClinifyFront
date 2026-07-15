import {
    ArrowUpRight01Icon,
    Download04Icon,
    Pdf01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import type { LabResponseFile } from "@/types/lab";

export function MedicalRecordFiles({
    files,
}: {
    files: LabResponseFile[];
}) {
    if (files.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No files attached.
            </p>
        );
    }

    return (
        <ul className="divide-y rounded-md border">
            {files.map((file) => {
                const isImage =
                    file.contentType.startsWith("image/");

                return (
                    <li
                        key={file.publicId}
                        className="flex items-center gap-3 p-3"
                    >
                        {isImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={file.secureUrl}
                                alt={file.originalFileName}
                                className="size-10 shrink-0 rounded object-cover"
                            />
                        ) : (
                            <span className="flex size-10 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                                <HugeiconsIcon
                                    icon={Pdf01Icon}
                                    className="size-5"
                                    strokeWidth={2}
                                />
                            </span>
                        )}

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {file.originalFileName}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.fileSize)}
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1 print:hidden">
                            <Button
                                render={
                                    <a
                                        href={file.secureUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    />
                                }
                                nativeButton={false}
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Open ${file.originalFileName}`}
                                title="Open file"
                            >
                                <HugeiconsIcon
                                    icon={ArrowUpRight01Icon}
                                    className="size-4"
                                    strokeWidth={2}
                                />
                            </Button>

                            <Button
                                render={
                                    <a
                                        href={createDownloadUrl(
                                            file.secureUrl,
                                        )}
                                        download={
                                            file.originalFileName
                                        }
                                    />
                                }
                                nativeButton={false}
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Download ${file.originalFileName}`}
                                title="Download file"
                            >
                                <HugeiconsIcon
                                    icon={Download04Icon}
                                    className="size-4"
                                    strokeWidth={2}
                                />
                            </Button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

function createDownloadUrl(secureUrl: string): string {
    const uploadSegment = "/upload/";

    if (!secureUrl.includes(uploadSegment)) {
        return secureUrl;
    }

    return secureUrl.replace(
        uploadSegment,
        `${uploadSegment}fl_attachment/`,
    );
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}