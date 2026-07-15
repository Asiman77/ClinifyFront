"use client";

import { Building02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useAdminDepartments } from "@/features/admin/departments/api";
import { DepartmentFormDialog } from "@/features/admin/departments/department-form-dialog";

export default function AdminDepartmentsPage() {
    const {
        data,
        error,
        isLoading,
        mutate,
    } = useAdminDepartments();

    const departments = [...(data ?? [])].sort((first, second) =>
        first.name.localeCompare(second.name),
    );

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Departments
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage clinic departments and availability.
                    </p>
                </div>

                <DepartmentFormDialog
                    triggerLabel="New department"
                    triggerProps={{ size: "sm" }}
                />
            </header>

            {isLoading && !data && (
                <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Spinner className="size-5" />
                    Loading departments...
                </div>
            )}

            {!isLoading && error && (
                <div role="alert" className="rounded-md border p-4">
                    <p className="text-sm font-medium">
                        Departments could not be loaded
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {error.message}
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => void mutate()}
                    >
                        Retry
                    </Button>
                </div>
            )}

            {!isLoading && !error && departments.length === 0 && (
                <Empty className="min-h-64">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <HugeiconsIcon icon={Building02Icon} strokeWidth={2} />
                        </EmptyMedia>
                        <EmptyTitle>No departments found</EmptyTitle>
                        <EmptyDescription>
                            Create the first department to organize doctors.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <DepartmentFormDialog
                            triggerLabel="New department"
                            triggerProps={{ size: "sm" }}
                        />
                    </EmptyContent>
                </Empty>
            )}

            {!error && departments.length > 0 && (
                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full min-w-160 text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    Department
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {departments.map((department) => (
                                <tr key={department.id}>
                                    <td className="px-4 py-3">
                                        <p className="font-medium">
                                            {department.name}
                                        </p>
                                        <p className="mt-1 max-w-md text-muted-foreground">
                                            {department.description ||
                                                "No description provided."}
                                        </p>
                                    </td>

                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                department.active
                                                    ? "secondary"
                                                    : "outline"
                                            }
                                        >
                                            {department.active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <DepartmentFormDialog
                                            department={department}
                                            triggerLabel="Edit"
                                            triggerProps={{
                                                variant: "ghost",
                                                size: "sm",
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}