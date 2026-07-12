"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import type { DoctorProfile } from "@/types/doctor";

type DoctorOptionProps = {
    doctor: DoctorProfile;
    selected: boolean;
    onSelect: (doctor: DoctorProfile) => void;
};

export function DoctorOption({
    doctor,
    selected,
    onSelect,
}: DoctorOptionProps) {
    const initials = (
        doctor.doctorFirstName.charAt(0) +
        doctor.doctorLastName.charAt(0)
    ).toUpperCase();

    return (
        <button
            type="button"
            disabled={!doctor.active}
            aria-pressed={selected}
            onClick={() => onSelect(doctor)}
            className={cn("relative flex min-h-24 w-full items-center gap-4 rounded-lg border bg-background p-3 text-left outline-none transition-colors",
                "hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/30",
                "disabled:cursor-not-allowed disabled:opacity-50",
                selected &&
                "border-primary bg-primary/5 hover:bg-primary/10",
            )}
        >
            <span
                aria-hidden="true"
                className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground"
            >
                {initials}
            </span>

            <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                    Dr. {doctor.doctorFirstName}{" "}
                    {doctor.doctorLastName}
                </span>

                <span className="block truncate text-sm text-muted-foreground">
                    {doctor.specialization}
                </span>

                <span className="block truncate text-xs text-muted-foreground">
                    {doctor.departmentName}
                </span>

                {doctor.experienceYears !== null && (
                    <span className="mt-1 block text-xs text-muted-foreground">
                        {doctor.experienceYears}{" "}
                        {doctor.experienceYears === 1 ? "year" : "years"} of
                        experience
                    </span>
                )}
            </span>

            {selected && (
                <HugeiconsIcon
                    icon={Tick02Icon}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="size-5 shrink-0 text-primary"
                />
            )}

            <span className="sr-only">
                {!doctor.active
                    ? "Unavailable"
                    : selected
                        ? "Selected"
                        : "Select doctor"}
            </span>
        </button>
    );
}