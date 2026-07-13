"use client";

import Link from "next/link";
import {
    Calendar03Icon,
    FileAttachmentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getUpcomingAppointments } from "@/features/appointments/upcoming";
import { useCurrentUser } from "@/features/auth/api";
import { useDoctorAppointments } from "@/features/doctor/appointments/api";
import { DoctorDashboardStats } from "@/features/doctor/dashboard/doctor-dashboard-stats";
import { DoctorUpcomingPreview } from "@/features/doctor/dashboard/doctor-upcoming-preview";
import {
    useDoctorPatients,
    useDoctorRecords,
} from "@/features/doctor/records/api";
import { CreateMedicalRecordSheet } from "@/features/doctor/records/create-medical-record-sheet";

export default function DoctorDashboardPage() {
    const { data: user } = useCurrentUser();
    const { data, error, isLoading } = useDoctorAppointments({
        page: 0,
        size: 100,
        sort: "startTime,desc",
    });
    const {
        data: records,
        error: recordsError,
        isLoading: recordsLoading,
    } = useDoctorRecords({ page: 0, size: 1 });
    const {
        data: doctorPatients,
        error: patientsError,
        isLoading: patientsLoading,
    } = useDoctorPatients();

    const appointments = data?.page.content ?? [];
    const upcoming = data
        ? getUpcomingAppointments(
              appointments,
              data.currentDateTime,
              100,
          )
        : [];
    const dashboardError = error ?? recordsError ?? patientsError;
    const dashboardLoading =
        (isLoading && !data) ||
        (recordsLoading && !records) ||
        (patientsLoading && !doctorPatients);

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
            <header className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold">
                    {user
                        ? `Welcome back, Dr. ${user.lastName}.`
                        : "Doctor dashboard"}
                </h1>
                <p className="text-sm text-muted-foreground">
                    Review appointments and patient care activity.
                </p>
            </header>

            <div className="flex flex-wrap gap-2">
                <Button
                    render={<Link href="/doctor/appointments" />}
                    nativeButton={false}
                >
                    <HugeiconsIcon
                        icon={Calendar03Icon}
                        data-icon="inline-start"
                    />
                    View appointments
                </Button>
                <Button
                    render={<Link href="/doctor/medical-records" />}
                    nativeButton={false}
                    variant="outline"
                >
                    <HugeiconsIcon
                        icon={FileAttachmentIcon}
                        data-icon="inline-start"
                    />
                    Medical records
                </Button>
                {doctorPatients && (
                    <CreateMedicalRecordSheet
                        patients={doctorPatients}
                        triggerLabel="Create medical record"
                    />
                )}
            </div>

            {dashboardLoading && (
                <div
                    role="status"
                    className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                    <Spinner className="size-5" />
                    Loading dashboard...
                </div>
            )}

            {dashboardError && (
                <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3"
                >
                    <p className="text-sm font-medium text-destructive">
                        Dashboard could not be loaded
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {dashboardError.message}
                    </p>
                </div>
            )}

            {data && records && doctorPatients && !dashboardError && (
                <>
                    <DoctorDashboardStats
                        upcoming={upcoming.length}
                        patients={doctorPatients.length}
                        records={records.totalElements}
                    />
                    <DoctorUpcomingPreview
                        appointments={upcoming.slice(0, 5)}
                    />
                </>
            )}
        </div>
    );
}
