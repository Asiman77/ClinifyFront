"use client";

import { useState, type ComponentProps } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
    useCreateDepartment,
    useUpdateDepartment,
} from "@/features/admin/departments/api";
import {
    departmentFormSchema,
    type DepartmentFormValues,
} from "@/features/admin/departments/schemas";
import type {
    Department,
    DepartmentRequest,
} from "@/types/department";

type DepartmentFormDialogProps = {
    department?: Department;
    triggerLabel: string;
    triggerProps?: ComponentProps<typeof Button>;
};

export function DepartmentFormDialog({
    department,
    triggerLabel,
    triggerProps,
}: DepartmentFormDialogProps) {
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] =
        useState<string | null>(null);

    const createDepartment = useCreateDepartment();
    const updateDepartment = useUpdateDepartment();
    const isEdit = department !== undefined;
    const isBusy =
        createDepartment.isMutating ||
        updateDepartment.isMutating;

    const form = useForm<DepartmentFormValues>({
        resolver: zodResolver(departmentFormSchema),
        defaultValues: getDefaultValues(department),
    });

    const submit = form.handleSubmit(async (values) => {
        setServerError(null);

        const request: DepartmentRequest = {
            name: values.name,
            description: values.description || null,
            active: values.active,
        };

        try {
            if (department) {
                await updateDepartment.trigger({
                    departmentId: department.id,
                    request,
                });
            } else {
                await createDepartment.trigger(request);
            }

            setOpen(false);
            form.reset(getDefaultValues(department));
        } catch (error) {
            setServerError(
                error instanceof Error
                    ? error.message
                    : "Department could not be saved",
            );
        }
    });

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                setServerError(null);

                if (nextOpen) {
                    form.reset(getDefaultValues(department));
                }
            }}
        >
            <DialogTrigger
                render={
                    <Button type="button" {...triggerProps}>
                        {triggerLabel}
                    </Button>
                }
            />

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit
                            ? "Edit department"
                            : "Create department"}
                    </DialogTitle>
                    <DialogDescription>
                        Manage the department details and availability.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} noValidate>
                    <FieldGroup>
                        <Field data-invalid={Boolean(form.formState.errors.name)}>
                            <FieldLabel htmlFor="department-name">
                                Name
                            </FieldLabel>
                            <Input
                                id="department-name"
                                {...form.register("name")}
                            />
                            <FieldError
                                errors={
                                    form.formState.errors.name
                                        ? [form.formState.errors.name]
                                        : undefined
                                }
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="department-description">
                                Description
                            </FieldLabel>
                            <Textarea
                                id="department-description"
                                rows={4}
                                {...form.register("description")}
                            />
                        </Field>

                        <Field orientation="horizontal">
                            <input
                                id="department-active"
                                type="checkbox"
                                className="size-4 accent-primary"
                                {...form.register("active")}
                            />
                            <FieldLabel htmlFor="department-active">
                                Active department
                            </FieldLabel>
                        </Field>

                        {serverError && (
                            <FieldError>{serverError}</FieldError>
                        )}

                        <DialogFooter showCloseButton>
                            <Button type="submit" disabled={isBusy}>
                                {isBusy && <Spinner data-icon="inline-start" />}
                                {isEdit ? "Save changes" : "Create department"}
                            </Button>
                        </DialogFooter>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function getDefaultValues(
    department?: Department,
): DepartmentFormValues {
    return {
        name: department?.name ?? "",
        description: department?.description ?? "",
        active: department?.active ?? true,
    };
}