"use client";

import { useState } from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type CancelAppointmentDialogProps = {
    appointmentId: number;
    doctorName: string;
    isCancelling: boolean;
    onConfirm: (
        appointmentId: number,
    ) => Promise<string | null>;
};

export function CancelAppointmentDialog({
    appointmentId,
    doctorName,
    isCancelling,
    onConfirm,
}: CancelAppointmentDialogProps) {
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    function handleOpenChange(nextOpen: boolean) {
        if (isCancelling) {
            return;
        }

        setOpen(nextOpen);

        if (!nextOpen) {
            setErrorMessage(null);
        }
    }

    async function handleConfirmation() {
        if (isCancelling) {
            return;
        }

        setErrorMessage(null);

        const error = await onConfirm(appointmentId);

        if (error) {
            setErrorMessage(error);
            return;
        }

        setOpen(false);
    }

    return (
        <AlertDialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <AlertDialogTrigger
                render={
                    <Button type="button" variant="ghost"  size="xs">
                        <HugeiconsIcon
                            icon={Cancel01Icon}
                            strokeWidth={2}
                            data-icon="inline-start"
                        />
                        Cancel
                    </Button>
                }
            />

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Cancel appointment?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Your appointment with {doctorName} will be
                        cancelled. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {errorMessage && (
                    <p role="alert" className="text-sm text-destructive">
                        {errorMessage}
                    </p>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isCancelling}>
                        Keep appointment
                    </AlertDialogCancel>

                    <AlertDialogAction
                        type="button"
                        variant="destructive"
                        disabled={isCancelling}
                        onClick={handleConfirmation}
                    >
                        {isCancelling && (<Spinner data-icon="inline-start" />)}
                        {isCancelling
                            ? "Cancelling..."
                            : "Confirm cancellation"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}