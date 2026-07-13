"use client";

import { useState } from "react";

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
import type { DoctorAppointmentAction } from "@/features/doctor/appointments/api";
import type { AppointmentStatus } from "@/types/appointment";

const ACTION_CONTENT: Record<
    DoctorAppointmentAction,
    {
        label: string;
        title: string;
        description: string;
        triggerVariant: "default" | "destructive" | "outline";
    }
> = {
    approve: {
        label: "Approve",
        title: "Approve appointment?",
        description: "The patient will see this appointment as approved.",
        triggerVariant: "default",
    },
    reject: {
        label: "Reject",
        title: "Reject appointment?",
        description: "The appointment request will be closed as rejected.",
        triggerVariant: "destructive",
    },
    complete: {
        label: "Complete",
        title: "Complete appointment?",
        description: "Mark this appointment as completed after the visit.",
        triggerVariant: "outline",
    },
};

type DoctorAppointmentActionsProps = {
    appointmentId: number;
    status: AppointmentStatus;
    isMutating: boolean;
    onAction: (
        appointmentId: number,
        action: DoctorAppointmentAction,
    ) => Promise<string | null>;
};

function ActionDialog({
    appointmentId,
    action,
    isMutating,
    onAction,
}: Omit<DoctorAppointmentActionsProps, "status"> & {
    action: DoctorAppointmentAction;
}) {
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const content = ACTION_CONTENT[action];

    async function handleConfirmation(
        event: React.MouseEvent<HTMLButtonElement>,
    ) {
        event.preventDefault();
        setErrorMessage(null);

        const error = await onAction(appointmentId, action);
        if (error) {
            setErrorMessage(error);
            return;
        }

        setOpen(false);
    }

    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!isMutating) {
                    setOpen(nextOpen);
                    if (!nextOpen) {
                        setErrorMessage(null);
                    }
                }
            }}
        >
            <AlertDialogTrigger
                render={
                    <Button
                        type="button"
                        variant={content.triggerVariant}
                        size="xs"
                    >
                        {content.label}
                    </Button>
                }
            />

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{content.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {content.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {errorMessage && (
                    <p role="alert" className="text-sm text-destructive">
                        {errorMessage}
                    </p>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isMutating}>
                        Keep current status
                    </AlertDialogCancel>
                    <AlertDialogAction
                        type="button"
                        variant={
                            action === "reject" ? "destructive" : "default"
                        }
                        disabled={isMutating}
                        onClick={handleConfirmation}
                    >
                        {isMutating && (
                            <Spinner data-icon="inline-start" />
                        )}
                        Confirm {content.label.toLowerCase()}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function DoctorAppointmentActions(
    props: DoctorAppointmentActionsProps,
) {
    if (props.status === "REQUESTED") {
        return (
            <>
                <ActionDialog {...props} action="approve" />
                <ActionDialog {...props} action="reject" />
            </>
        );
    }

    if (props.status === "APPROVED") {
        return <ActionDialog {...props} action="complete" />;
    }

    return null;
}
