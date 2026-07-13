"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteLabFile, useUpdateLabResponse, useUploadLabFile, } from "@/features/lab/api";
import { LabResponseFiles } from "./lab-response-files";
import type { LabResponse, LabResponseDetail, LabStatus, } from "@/types/lab";
import { LabStatusSelect } from "./lab-status-select";
type Feedback = {
    type: "success" | "error";
    message: string;
};
type LabResponseEditorProps = {
    response: LabResponseDetail;
    onUpdated: () => Promise<unknown>;
};
export function LabResponseEditor({
    response,
    onUpdated,
}: LabResponseEditorProps) {
    const [resultText, setResultText] =
        useState(response.resultText ?? "");
    const [note, setNote] =
        useState(response.note ?? "");
    const [status, setStatus] =
        useState<LabStatus>(response.status);
    const [files, setFiles] =
        useState(response.files);
    const [feedback, setFeedback] =
        useState<Feedback | null>(null);

    const updateMutation = useUpdateLabResponse();
    const uploadMutation = useUploadLabFile();
    const deleteMutation = useDeleteLabFile();

    const finalStatus =
        response.status === "COMPLETED" ||
        response.status === "CANCELLED";

    const editable = !finalStatus;

    const busy =
        updateMutation.isMutating ||
        uploadMutation.isMutating ||
        deleteMutation.isMutating;

    const canComplete =
        resultText.trim().length > 0 ||
        files.length > 0;

    async function execute<T>(
        action: () => Promise<T>,
        successMessage: string,
        applyResult?: (result: T) => void,
    ): Promise<string | null> {
        setFeedback(null);

        try {
            const result = await action();
            applyResult?.(result);

            setFeedback({
                type: "success",
                message: successMessage,
            });

            await onUpdated();
            return null;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Laboratory request could not be updated";

            setFeedback({
                type: "error",
                message,
            });

            return message;
        }
    }
    async function handleSave() {
        if (status === "COMPLETED" && !canComplete) {
            setFeedback({
                type: "error",
                message:
                    "Result text or an attached file is required",
            });
            return;
        }

        await execute(
            () =>
                updateMutation.trigger({
                    responseId: response.id,
                    data: {
                        resultText,
                        note,
                        status,
                    },
                }),
            "Laboratory response saved",
        );
    }
    async function handleUpload(file: File) {
        await execute(
            () =>
                uploadMutation.trigger({
                    responseId: response.id,
                    file,
                }),
            "File uploaded",
            (updated: LabResponse) =>
                setFiles(updated.files),
        );
    }

    async function handleDelete(publicId: string) {
        await execute(
            () =>
                deleteMutation.trigger({
                    responseId: response.id,
                    publicId,
                }),
            "File deleted",
            (updated: LabResponse) =>
                setFiles(updated.files),
        );
    }

    return (
        <section
            aria-labelledby="laboratory-result-title"
            className="flex flex-col gap-5 print:hidden"
        >
            <h2 id="laboratory-result-title"
                className="text-xs font-medium uppercase text-muted-foreground"
            >
                Laboratory result
            </h2>

            {feedback && (
                <p role={
                    feedback.type === "error"
                        ? "alert"
                        : "status"
                }
                    className={
                        feedback.type === "error"
                            ? "text-sm text-destructive"
                            : "text-sm text-emerald-700 dark:text-emerald-300"
                    }
                >
                    {feedback.message}
                </p>
            )}
            {(editable || finalStatus) && (
                <>
                    <LabStatusSelect
                        currentStatus={response.status}
                        value={status}
                        disabled={!editable || busy}
                        onValueChange={setStatus}
                    />
                    <Field>
                        <FieldLabel htmlFor="lab-result">
                            Result
                        </FieldLabel>
                        <Textarea
                            id="lab-result"
                            rows={5}
                            value={resultText}
                            readOnly={!editable}
                            placeholder="Enter laboratory result"
                            onChange={(event) =>
                                setResultText(
                                    event.target.value,
                                )
                            }
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="lab-note">
                            Note
                        </FieldLabel>
                        <Textarea
                            id="lab-note"
                            rows={3}
                            value={note}
                            readOnly={!editable}
                            placeholder="Add an optional note"
                            onChange={(event) =>
                                setNote(event.target.value)
                            }
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Attachments</FieldLabel>
                        <LabResponseFiles files={files} editable={editable} busy={busy} onUpload={handleUpload} onDelete={handleDelete} />
                    </Field>
                </>
            )}

            {editable && (
                <div>
                    <Button
                        type="button"
                        disabled={
                            busy ||
                            (status === "COMPLETED" && !canComplete)
                        }
                        onClick={() => void handleSave()}
                    >
                        {updateMutation.isMutating
                            ? "Saving..."
                            : "Save"}
                    </Button>
                </div>
            )}
        </section>
    );
}