"use client";

import { StethoscopeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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
import { useAdminDoctors } from "@/features/admin/doctors/api";
import { DoctorFormDialog } from "@/features/admin/doctors/doctor-form-dialog";
import { cn } from "@/lib/utils";

export default function AdminDoctorsPage() {
    const {
        data: doctorsData,
        error: doctorsError,
        isLoading: doctorsLoading,
        mutate: mutateDoctors,
    } = useAdminDoctors();

    const {
        data: departmentsData,
        error: departmentsError,
        isLoading: departmentsLoading,
        mutate: mutateDepartments,
    } = useAdminDepartments();

    const doctors = [...(doctorsData?.content ?? [])].sort(
        (first, second) =>
            getDoctorName(first).localeCompare(
                getDoctorName(second),
            ),
    );

    const departments = departmentsData ?? [];
    const error = doctorsError ?? departmentsError;
    const isLoading =
        doctorsLoading || departmentsLoading;

    const hasActiveDepartment = departments.some(
        (department) => department.active,
    );

    function retry() {
        void Promise.all([
            mutateDoctors(),
            mutateDepartments(),
        ]);
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Doctors
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage doctor profiles and departments.
                    </p>
                </div>

                <DoctorFormDialog
                    departments={departments}
                    triggerLabel="New doctor"
                    triggerProps={{
                        size: "sm",
                        disabled: !hasActiveDepartment,
                    }}
                />
            </header>

            {isLoading && (
                <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Spinner className="size-5" />
                    Loading doctors...
                </div>
            )}

            {!isLoading && error && (
                <div
                    role="alert"
                    className="rounded-md border p-4"
                >
                    <p className="text-sm font-medium">
                        Doctors could not be loaded
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {error.message}
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={retry}
                    >
                        Retry
                    </Button>
                </div>
            )}

            {!isLoading &&
                !error &&
                doctors.length === 0 && (
                    <Empty className="min-h-64">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <HugeiconsIcon
                                    icon={StethoscopeIcon}
                                    strokeWidth={2}
                                />
                            </EmptyMedia>
                            <EmptyTitle>
                                No doctors found
                            </EmptyTitle>
                            <EmptyDescription>
                                Create the first doctor profile.
                            </EmptyDescription>
                        </EmptyHeader>

                        {hasActiveDepartment && (
                            <EmptyContent>
                                <DoctorFormDialog
                                    departments={departments}
                                    triggerLabel="New doctor"
                                    triggerProps={{ size: "sm" }}
                                />
                            </EmptyContent>
                        )}
                    </Empty>
                )}

            {!isLoading &&
                !error &&
                doctors.length > 0 && (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-180 text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="py-3 pr-4 font-medium">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Specialization
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Department
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="w-0 py-3 pl-4" />
                                </tr>
                            </thead>

                            <tbody>
                                {doctors.map((doctor) => (
                                    <tr
                                        key={doctor.id}
                                        className={cn(
                                            "border-b transition-colors hover:bg-muted/50",
                                            !doctor.active &&
                                            "opacity-60",
                                        )}
                                    >
                                        <td className="py-3 pr-4 font-medium">
                                            {getDoctorName(doctor)}
                                        </td>

                                        <td className="px-4 py-3 text-muted-foreground">
                                            {doctor.specialization}
                                        </td>

                                        <td className="px-4 py-3 text-muted-foreground">
                                            {doctor.departmentName}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={cn(
                                                    doctor.active
                                                        ? "text-green-700 dark:text-green-400"
                                                        : "text-muted-foreground",
                                                )}
                                            >
                                                {doctor.active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>

                                        <td className="py-2 pl-4 text-right">
                                            <DoctorFormDialog
                                                doctor={doctor}
                                                departments={
                                                    departments
                                                }
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

function getDoctorName(doctor: {
    doctorFirstName: string;
    doctorLastName: string;
}) {
    return `${doctor.doctorFirstName} ${doctor.doctorLastName}`.trim();
}