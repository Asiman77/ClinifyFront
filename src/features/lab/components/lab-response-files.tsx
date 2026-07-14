"use client";

import {
    Attachment01Icon,
    Delete02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LabResponseFile } from "@/types/lab";

type LabResponseFilesProps = {
    files: LabResponseFile[];
    editable: boolean;
    busy: boolean;
    onUpload: (file: File) => Promise<void>;
    onDelete: (publicId: string) => Promise<void>;
};

export function LabResponseFiles({
    files,
    editable,
    busy,
    onUpload,
    onDelete,
}: LabResponseFilesProps) {
    async function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.currentTarget.files?.[0];
        event.currentTarget.value = "";

        if (file) {
            await onUpload(file);
        }
    }

    return (
        <div className="flex flex-col gap-3">
            {files.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No files attached.
                </p>
            ) : (
                <ul className="divide-y border-y">
                    {files.map((file) => (
                        <li key={file.publicId} className="flex items-center justify-between gap-3 py-3">
                            <a href={file.secureUrl} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-3 text-sm hover:underline">
                                <HugeiconsIcon
                                    icon={Attachment01Icon}
                                    className="size-4 shrink-0 text-muted-foreground"
                                    strokeWidth={2}
                                />
                                <span className="min-w-0">
                                    <span className="block truncate font-medium">
                                        {file.originalFileName}
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                        {formatFileSize(file.fileSize)}
                                    </span>
                                </span>
                            </a>

                            {editable && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    disabled={busy}
                                    aria-label={`Delete ${file.originalFileName}`}
                                    title="Delete file"
                                    onClick={() =>
                                        void onDelete(file.publicId)
                                    }
                                >
                                    <HugeiconsIcon
                                        icon={Delete02Icon}
                                        className="size-4"
                                        strokeWidth={2}
                                    />
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {editable && (
                <Input
                    type="file"
                    accept="application/pdf,image/png,image/jpeg"
                    disabled={busy}
                    aria-label="Attach laboratory result file"
                    onChange={(event) =>
                        void handleFileChange(event)
                    }
                />
            )}
        </div>
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