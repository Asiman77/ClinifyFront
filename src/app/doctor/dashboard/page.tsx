"use client";

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
import { CreateMedicalRecordDialog } from "@/features/doctor/records/create-medical-record-dialog";
import { DoctorDashboardAnalytics } from "@/features/doctor/dashboard/doctor-dashboard-analytics";

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
        <h1 className="text-xl font-semibold tracking-tight">
          {user
            ? `Welcome back, Dr. ${user.lastName}.`
            : "Doctor dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Review appointments and patient care activity.
        </p>

      </header>

      {data && records && doctorPatients && !dashboardError && (
        <>
          <DoctorDashboardStats
            upcoming={upcoming.length}
            patients={doctorPatients.length}
            records={records.totalElements}
          />

          <DoctorDashboardAnalytics
            appointments={appointments}
          />

          <DoctorUpcomingPreview
            appointments={upcoming.slice(0, 5)}
            footer={
              <CreateMedicalRecordDialog
                patients={doctorPatients}
                triggerLabel="New medical record"
              />
            }
          />
        </>
      )}

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
    </div>
  );
}
