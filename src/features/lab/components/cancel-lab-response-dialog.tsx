"use client";

import { useState } from "react";
import { CancelCircleIcon } from "@hugeicons/core-free-icons";
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

type CancelLabResponseDialogProps = {
    isCancelling: boolean;
    onConfirm: () => Promise<string | null>;
};

export function CancelLabResponseDialog({
    isCancelling,
    onConfirm,
}: CancelLabResponseDialogProps) {
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

        const error = await onConfirm();

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
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isCancelling}
                        className="text-destructive hover:text-destructive"
                    >
                        <HugeiconsIcon
                            icon={CancelCircleIcon}
                            strokeWidth={2}
                            data-icon="inline-start"
                        />
                        Cancel request
                    </Button>
                }
            />

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Cancel laboratory request?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This laboratory request will be closed and
                        cannot be modified afterwards.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {errorMessage && (
                    <p
                        role="alert"
                        className="text-sm text-destructive"
                    >
                        {errorMessage}
                    </p>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isCancelling}>
                        Keep request
                    </AlertDialogCancel>

                    <AlertDialogAction
                        type="button"
                        variant="destructive"
                        disabled={isCancelling}
                        onClick={handleConfirmation}
                    >
                        {isCancelling && (
                            <Spinner data-icon="inline-start" />
                        )}
                        {isCancelling
                            ? "Cancelling..."
                            : "Confirm cancellation"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}