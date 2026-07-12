"use client";

import Link from "next/link";
import {
  Calendar03Icon,
  CalendarAdd01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePatientDashboardAppointments } from "@/features/appointments/api";
import { getUpcomingAppointments } from "@/features/appointments/upcoming";
import { useCurrentUser } from "@/features/auth/api";
import { NextAppointmentSummary } from "@/features/dashboard/components/next-appointment-summary";
import { UpcomingAppointmentsPreview } from "@/features/dashboard/components/upcoming-appointments-preview";

export default function PatientDashboardPage() {
  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useCurrentUser();

  const {
    data: appointmentsData,
    error: appointmentsError,
    isLoading: appointmentsLoading,
  } = usePatientDashboardAppointments();

  const upcomingAppointments = appointmentsData
    ? getUpcomingAppointments(
      appointmentsData.appointments,
      appointmentsData.currentDateTime,
      4,
    )
    : [];

  const nextAppointment = upcomingAppointments[0] ?? null;
  const remainingAppointments = upcomingAppointments.slice(1);
  const error = userError ?? appointmentsError;

  const isInitialLoading =
    (userLoading && !user) ||
    (appointmentsLoading && !appointmentsData);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">
          Patient dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          {user
            ? `Welcome back, ${user.firstName}.`
            : "Review your upcoming care schedule."}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button
          render={
            <Link href="/patient/book-appointment" />
          }
          nativeButton={false}
        >
          <HugeiconsIcon
            icon={CalendarAdd01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Book appointment
        </Button>

        <Button
          render={
            <Link href="/patient/appointments" />
          }
          nativeButton={false}
          variant="outline"
        >
          <HugeiconsIcon
            icon={Calendar03Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          View appointments
        </Button>
      </div>

      {isInitialLoading && (
        <div
          role="status"
          className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Spinner className="size-5" />
          Loading dashboard...
        </div>
      )}

      {!isInitialLoading && error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3"
        >
          <p className="text-sm font-medium text-destructive">
            Dashboard could not be loaded
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {error.message}
          </p>
        </div>
      )}

      {!isInitialLoading && !error && (
        <>
          <NextAppointmentSummary
            appointment={nextAppointment}
          />
          <UpcomingAppointmentsPreview
            appointments={remainingAppointments}
          />
        </>
      )}
    </div>
  );
}