"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AdminDashboardSummary } from "@/features/admin/dashboard/admin-dashboard-summary";
import { AdminDoctorAnalytics } from "@/features/admin/dashboard/admin-doctor-analytics";
import { useAdminDashboard } from "@/features/admin/dashboard/use-admin-dashboard";

export default function AdminDashboardPage() {
  const {
    departments,
    doctors,
    availabilities,
    isLoading,
    error,
    retry,
  } = useAdminDashboard();

  const activeDoctorCount = doctors.filter(
    (doctor) => doctor.active,
  ).length;

  const activeAvailabilityCount = availabilities.filter(
    (availability) => availability.active,
  ).length;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Admin dashboard
        </h1>

        <p className="text-sm text-muted-foreground">
          Monitor clinic departments, doctors, and availability.
        </p>
      </header>

      {isLoading && (
        <div
          className="flex min-h-64 items-center justify-center gap-2 text-sm text-muted-foreground"
          aria-live="polite"
        >
          <Spinner className="size-5" />
          Loading dashboard...
        </div>
      )}

      {!isLoading && error && (
        <div
          role="alert"
          className="rounded-md border p-4"
        >
          <p className="text-sm font-medium">
            Dashboard could not be loaded
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

      {!isLoading && !error && (
        <>
          <AdminDashboardSummary
            departmentCount={departments.length}
            doctorCount={doctors.length}
            activeDoctorCount={activeDoctorCount}
            availabilityCount={availabilities.length}
            activeAvailabilityCount={
              activeAvailabilityCount
            }
          />

          <AdminDoctorAnalytics
            departments={departments}
            doctors={doctors}
          />
        </>
      )}
    </div>
  );
}