"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Clock01Icon } from "@hugeicons/core-free-icons";
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
import { useAdminAvailabilities } from "@/features/admin/availabilities/api";
import { AvailabilityFilter } from "@/features/admin/availabilities/availability-filter";
import { AvailabilityFormDialog } from "@/features/admin/availabilities/availability-form-dialog";
import { AvailabilityWeekGrid } from "@/features/admin/availabilities/availability-week-grid";
import { useAdminDoctors } from "@/features/admin/doctors/api";
import { DAY_LABELS, formatTime, parseTime } from "@/lib/availability-grid";
import { cn } from "@/lib/utils";
import {
    DAYS_OF_WEEK,
    type AvailabilityType,
    type DoctorAvailability,
} from "@/types/availability";
import type { DoctorProfile } from "@/types/doctor";

const TYPE_LABELS: Record<AvailabilityType, string> = {
    ONLINE_ONLY: "Online only",
    WALK_IN_ONLY: "Walk-in only",
    MIXED: "Mixed",
};

export default function AdminAvailabilitiesPage() {
    return (
        <Suspense fallback={<PageLoading />}>
            <AdminAvailabilitiesContent />
        </Suspense>
    );
}

function AdminAvailabilitiesContent() {
    const searchParams = useSearchParams();

    const {
        data: availabilitiesData,
        error: availabilitiesError,
        isLoading: availabilitiesLoading,
        mutate: mutateAvailabilities,
    } = useAdminAvailabilities();

    const {
        data: doctorsData,
        error: doctorsError,
        isLoading: doctorsLoading,
        mutate: mutateDoctors,
    } = useAdminDoctors();

    const doctors = [...(doctorsData?.content ?? [])].sort((first, second) =>
        getDoctorName(first).localeCompare(getDoctorName(second)),
    );

    const allAvailabilities = [...(availabilitiesData ?? [])].sort(
        compareAvailabilities,
    );

    const selectedDoctorId = parseDoctorId(searchParams.get("doctor"));

    const visibleAvailabilities =
        selectedDoctorId === undefined
            ? allAvailabilities
            : allAvailabilities.filter(
                (availability) => availability.doctorId === selectedDoctorId,
            );

    const error = availabilitiesError ?? doctorsError;

    const isLoading = availabilitiesLoading || doctorsLoading;

    const hasActiveDoctor = doctors.some((doctor) => doctor.active);

    function retry() {
        void Promise.all([mutateAvailabilities(), mutateDoctors()]);
    }

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-xl font-semibold tracking-tight">Availabilities</h1>

                <div className="flex flex-wrap items-center gap-2">
                    <AvailabilityFilter doctors={doctors} />

                    <AvailabilityFormDialog
                        doctors={doctors}
                        triggerLabel="New availability"
                        triggerProps={{
                            size: "sm",
                            disabled: !hasActiveDoctor,
                        }}
                    />
                </div>
            </header>

            {isLoading && <PageLoading />}

            {!isLoading && error && (
                <div role="alert" className="rounded-md border p-4">
                    <p className="text-sm font-medium">
                        Availabilities could not be loaded
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>

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

            {!isLoading && !error && visibleAvailabilities.length === 0 && (
                <Empty className="min-h-64">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />
                        </EmptyMedia>

                        <EmptyTitle>No availabilities found</EmptyTitle>

                        <EmptyDescription>
                            Add a working window for a doctor.
                        </EmptyDescription>
                    </EmptyHeader>

                    {hasActiveDoctor && (
                        <EmptyContent>
                            <AvailabilityFormDialog
                                doctors={doctors}
                                triggerLabel="New availability"
                                triggerProps={{
                                    size: "sm",
                                }}
                            />
                        </EmptyContent>
                    )}
                </Empty>
            )}

            {!isLoading && !error && visibleAvailabilities.length > 0 && (
                <>
                    <div className="hidden md:block">
                        <AvailabilityWeekGrid
                            availabilities={visibleAvailabilities}
                            doctors={doctors}
                            selectedDoctorId={selectedDoctorId}
                        />
                    </div>

                    <MobileAvailabilityTable
                        availabilities={visibleAvailabilities}
                        doctors={doctors}
                    />
                </>
            )}
        </div>
    );
}

type MobileAvailabilityTableProps = {
    availabilities: DoctorAvailability[];
    doctors: DoctorProfile[];
};

function MobileAvailabilityTable({
    availabilities,
    doctors,
}: MobileAvailabilityTableProps) {
    const doctorNames = new Map(
        doctors.map((doctor) => [doctor.id, getDoctorName(doctor)]),
    );

    return (
        <div className="overflow-x-auto md:hidden">
            <table className="w-full min-w-200 text-sm">
                <thead>
                    <tr className="border-b text-left">
                        <th className="py-3 pr-4 font-medium">Doctor</th>
                        <th className="px-4 py-3 font-medium">Day</th>
                        <th className="px-4 py-3 font-medium">Time</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="w-0 py-3 pl-4" />
                    </tr>
                </thead>

                <tbody>
                    {availabilities.map((availability) => (
                        <tr
                            key={availability.id}
                            className={cn("border-b", !availability.active && "opacity-60")}
                        >
                            <td className="py-3 pr-4 font-medium">
                                {doctorNames.get(availability.doctorId) ??
                                    `#${availability.doctorId}`}
                            </td>

                            <td className="px-4 py-3 text-muted-foreground">
                                {DAY_LABELS[availability.dayOfWeek]}
                            </td>

                            <td className="px-4 py-3 text-muted-foreground tabular-nums">
                                {formatTime(availability.startTime)}-
                                {formatTime(availability.endTime)}
                            </td>

                            <td className="px-4 py-3 text-muted-foreground">
                                {TYPE_LABELS[availability.availabilityType]}
                            </td>

                            <td className="px-4 py-3 text-muted-foreground">
                                {availability.active ? "Active" : "Inactive"}
                            </td>

                            <td className="py-2 pl-4 text-right">
                                <AvailabilityFormDialog
                                    availability={availability}
                                    doctors={doctors}
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
    );
}

function PageLoading() {
    return (
        <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
            <Spinner className="size-5" />
            Loading availabilities...
        </div>
    );
}

function parseDoctorId(value: string | null): number | undefined {
    if (!value) {
        return undefined;
    }

    const doctorId = Number(value);

    return Number.isInteger(doctorId) && doctorId > 0 ? doctorId : undefined;
}

function compareAvailabilities(
    first: DoctorAvailability,
    second: DoctorAvailability,
): number {
    const doctorDifference = first.doctorId - second.doctorId;

    if (doctorDifference !== 0) {
        return doctorDifference;
    }

    const dayDifference =
        DAYS_OF_WEEK.indexOf(first.dayOfWeek) -
        DAYS_OF_WEEK.indexOf(second.dayOfWeek);

    if (dayDifference !== 0) {
        return dayDifference;
    }

    return parseTime(first.startTime) - parseTime(second.startTime);
}

function getDoctorName(doctor: DoctorProfile): string {
    return `${doctor.doctorFirstName} ${doctor.doctorLastName}`.trim();
}
