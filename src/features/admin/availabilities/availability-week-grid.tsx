"use client";

import { AvailabilityFormDialog } from "@/features/admin/availabilities/availability-form-dialog";
import {  createDoctorLanes, createHourLabels, formatTime, getGridBounds, parseTime,  placeAvailabilities, } from "@/lib/availability-grid";
import { cn } from "@/lib/utils";
import {  DAYS_OF_WEEK, type AvailabilityType, type DayOfWeek, type DoctorAvailability, } from "@/types/availability";
import type { DoctorProfile } from "@/types/doctor";

const TYPE_TINT: Record<AvailabilityType, string> = {
    ONLINE_ONLY: "border-sky-500/25 bg-sky-500/12 text-sky-700 dark:text-sky-300",
    WALK_IN_ONLY:
        "border-emerald-500/25 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    MIXED:
        "border-violet-500/25 bg-violet-500/12 text-violet-700 dark:text-violet-300",
};

const TYPE_LABELS: Record<AvailabilityType, string> = {
    ONLINE_ONLY: "Online only",
    WALK_IN_ONLY: "Walk-in only",
    MIXED: "Mixed",
};

const DAY_LABELS: Record<DayOfWeek, string> = {
    MONDAY: "Mon",
    TUESDAY: "Tue",
    WEDNESDAY: "Wed",
    THURSDAY: "Thu",
    FRIDAY: "Fri",
    SATURDAY: "Sat",
    SUNDAY: "Sun",
};

const HOUR_HEIGHT = 44;

type AvailabilityWeekGridProps = {
    availabilities: DoctorAvailability[];
    doctors: DoctorProfile[];
    selectedDoctorId?: number;
};

export function AvailabilityWeekGrid({
    availabilities,
    doctors,
    selectedDoctorId,
}: AvailabilityWeekGridProps) {
    const doctorNames = new Map(
        doctors.map((doctor) => [doctor.id, getDoctorName(doctor)]),
    );

    if (selectedDoctorId !== undefined) {
        return (
            <SingleDoctorWeek
                availabilities={availabilities.filter(
                    (availability) => availability.doctorId === selectedDoctorId,
                )}
                doctors={doctors}
                doctorNames={doctorNames}
            />
        );
    }

    return (
        <AllDoctorsWeek
            availabilities={availabilities}
            doctors={doctors}
            doctorNames={doctorNames}
        />
    );
}

type WeekProps = {
    availabilities: DoctorAvailability[];
    doctors: DoctorProfile[];
    doctorNames: Map<number, string>;
};

function AllDoctorsWeek({ availabilities, doctors, doctorNames }: WeekProps) {
    const doctorIds = [
        ...new Set(availabilities.map((availability) => availability.doctorId)),
    ].sort((first, second) => first - second);

    const lanes = createDoctorLanes(availabilities, doctorIds);

    return (
        <div className="overflow-x-auto">
            <div className="min-w-190">
                <DayHeader labelColumn="10rem" />

                <div className="divide-y border-t">
                    {lanes.map((lane) => (
                        <div
                            key={lane.doctorId}
                            className="grid"
                            style={{
                                gridTemplateColumns: "10rem repeat(7, 1fr)",
                            }}
                        >
                            <div className="flex items-center py-3 pr-3 text-sm font-medium">
                                {doctorNames.get(lane.doctorId) ?? `#${lane.doctorId}`}
                            </div>

                            {lane.byDay.map((dayAvailabilities, index) => (
                                <div
                                    key={DAYS_OF_WEEK[index]}
                                    className="flex min-h-12 flex-col gap-1 border-l p-1"
                                >
                                    {dayAvailabilities.map((availability) => (
                                        <AvailabilityFormDialog
                                            key={availability.id}
                                            availability={availability}
                                            doctors={doctors}
                                            trigger={createAvailabilityBlock(
                                                availability,
                                                doctorNames,
                                            )}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SingleDoctorWeek({ availabilities, doctors, doctorNames }: WeekProps) {
    const bounds = getGridBounds(availabilities);
    const hourLabels = createHourLabels(bounds);
    const placedAvailabilities = placeAvailabilities(availabilities);

    const totalMinutes = bounds.endMinutes - bounds.startMinutes;

    const gridHeight = (totalMinutes / 60) * HOUR_HEIGHT;

    return (
        <div className="overflow-x-auto">
            <div className="min-w-190">
                <DayHeader labelColumn="4rem" />

                <div
                    className="grid border-t"
                    style={{
                        gridTemplateColumns: "4rem repeat(7, 1fr)",
                    }}
                >
                    <div
                        className="relative"
                        style={{
                            height: gridHeight,
                        }}
                    >
                        {hourLabels.map((label) => (
                            <div
                                key={label}
                                className="absolute right-2 -translate-y-1/2 text-xs text-muted-foreground tabular-nums"
                                style={{
                                    top: getVerticalPosition(
                                        parseTime(label),
                                        bounds.startMinutes,
                                        totalMinutes,
                                    ),
                                }}
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    {DAYS_OF_WEEK.map((day) => (
                        <div
                            key={day}
                            className="relative border-l"
                            style={{
                                height: gridHeight,
                            }}
                        >
                            {hourLabels.map((label) => (
                                <div
                                    key={label}
                                    className="absolute inset-x-0 border-t border-border/50"
                                    style={{
                                        top: getVerticalPosition(
                                            parseTime(label),
                                            bounds.startMinutes,
                                            totalMinutes,
                                        ),
                                    }}
                                />
                            ))}

                            {placedAvailabilities
                                .filter((placed) => placed.day === day)
                                .map((placed) => {
                                    const startMinutes = Math.max(
                                        parseTime(placed.availability.startTime),
                                        bounds.startMinutes,
                                    );

                                    const endMinutes = Math.min(
                                        parseTime(placed.availability.endTime),
                                        bounds.endMinutes,
                                    );

                                    return (
                                        <div
                                            key={placed.availability.id}
                                            className="absolute p-0.5"
                                            style={{
                                                top: getVerticalPosition(
                                                    startMinutes,
                                                    bounds.startMinutes,
                                                    totalMinutes,
                                                ),
                                                height: `${((endMinutes - startMinutes) / totalMinutes) * 100}%`,
                                                left: `${(placed.column * 100) / placed.columnCount}%`,
                                                width: `${100 / placed.columnCount}%`,
                                            }}
                                        >
                                            <AvailabilityFormDialog
                                                availability={placed.availability}
                                                doctors={doctors}
                                                trigger={createAvailabilityBlock(
                                                    placed.availability,
                                                    doctorNames,
                                                    true,
                                                )}
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DayHeader({ labelColumn }: { labelColumn: string }) {
    return (
        <div
            className="grid pb-2"
            style={{
                gridTemplateColumns: `${labelColumn} repeat(7, 1fr)`,
            }}
        >
            <div />

            {DAYS_OF_WEEK.map((day, index) => (
                <div
                    key={day}
                    className={cn(
                        "border-l pl-2 text-xs font-medium text-muted-foreground",
                        index >= 5 && "text-muted-foreground/60",
                    )}
                >
                    {DAY_LABELS[day]}
                </div>
            ))}
        </div>
    );
}

function createAvailabilityBlock(
    availability: DoctorAvailability,
    doctorNames: Map<number, string>,
    fill = false,
) {
    const startTime = formatTime(availability.startTime);

    const endTime = formatTime(availability.endTime);

    const label = [
        doctorNames.get(availability.doctorId) ?? `Doctor ${availability.doctorId}`,
        DAY_LABELS[availability.dayOfWeek],
        `${startTime}-${endTime}`,
        TYPE_LABELS[availability.availabilityType],
        availability.active ? "Active" : "Inactive",
        "Edit",
    ].join(", ");

    return (
        <button
            type="button"
            aria-label={label}
            className={cn(
                "flex w-full flex-col items-start gap-0.5 rounded-md border px-2 py-1 text-left text-xs leading-tight transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                fill && "h-full overflow-hidden",
                TYPE_TINT[availability.availabilityType],
                !availability.active && "opacity-60",
            )}
        >
            <span className="font-medium">
                {TYPE_LABELS[availability.availabilityType]}
            </span>

            <span className="tabular-nums">
                {startTime}-{endTime}
            </span>

            <span className="text-[10px] tabular-nums opacity-80">
                {availability.slotDurationMinutes}m
            </span>
        </button>
    );
}

function getVerticalPosition(
    minutes: number,
    startMinutes: number,
    totalMinutes: number,
): string {
    return `${((minutes - startMinutes) / totalMinutes) * 100}%`;
}

function getDoctorName(doctor: DoctorProfile): string {
    return `${doctor.doctorFirstName} ${doctor.doctorLastName}`.trim();
}
