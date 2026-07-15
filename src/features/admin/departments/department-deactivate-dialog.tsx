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
import { useDeactivateDepartment } from "./api";
import type { Department } from "@/types/department";

export function DepartmentDeactivateDialog({
    department,
    onDeactivated,
}: {
    department: Department;
    onDeactivated: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const deactivateDepartment = useDeactivateDepartment();

    async function deactivate() {
        setError(null);

        try {
            await deactivateDepartment.trigger({
                departmentId: department.id,
            });
            setOpen(false);
            onDeactivated();
        } catch (caught) {
            setError(
                caught instanceof Error
                    ? caught.message
                    : "Department could not be deactivated",
            );
        }
    }

    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                setError(null);
            }}
        >
            <AlertDialogTrigger
                render={
                    <Button type="button" variant="ghost" className="text-destructive">
                        Deactivate
                    </Button>
                }
            />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Deactivate department?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {department.name} will no longer be available for new scheduling.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deactivateDepartment.isMutating}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={deactivateDepartment.isMutating}
                        onClick={deactivate}
                    >
                        {deactivateDepartment.isMutating && <Spinner />}
                        Deactivate
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}