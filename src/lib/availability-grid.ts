import {
    DAYS_OF_WEEK,
    type DayOfWeek,
    type DoctorAvailability,
} from "@/types/availability";

const GRID_STEP_MINUTES = 30;
const DEFAULT_START_MINUTES = 9 * 60;
const DEFAULT_END_MINUTES = 17 * 60;
const CLAMP_START_MINUTES = 7 * 60;
const CLAMP_END_MINUTES = 21 * 60;

export const DAY_LABELS: Record<
    DayOfWeek,
    string
> = {
    MONDAY: "Mon",
    TUESDAY: "Tue",
    WEDNESDAY: "Wed",
    THURSDAY: "Thu",
    FRIDAY: "Fri",
    SATURDAY: "Sat",
    SUNDAY: "Sun",
};

export type DoctorAvailabilityLane = {
    doctorId: number;
    byDay: DoctorAvailability[][];
};

export type AvailabilityGridBounds = {
    startMinutes: number;
    endMinutes: number;
};

export type PlacedAvailability = {
    availability: DoctorAvailability;
    day: DayOfWeek;
    column: number;
    columnCount: number;
};

export function parseTime(time: string): number {
    const [hours, minutes] = time
        .split(":")
        .map(Number);

    return hours * 60 + minutes;
}

export function formatTime(time: string): string {
    return time.slice(0, 5);
}

export function createDoctorLanes(
    availabilities: DoctorAvailability[],
    doctorIds: number[],
): DoctorAvailabilityLane[] {
    return doctorIds.map((doctorId) => {
        const byDay: DoctorAvailability[][] =
            DAYS_OF_WEEK.map(() => []);

        for (const availability of availabilities) {
            if (availability.doctorId !== doctorId) {
                continue;
            }

            const dayIndex = DAYS_OF_WEEK.indexOf(
                availability.dayOfWeek,
            );

            if (dayIndex >= 0) {
                byDay[dayIndex].push(availability);
            }
        }

        for (const dayAvailabilities of byDay) {
            dayAvailabilities.sort(
                (first, second) =>
                    parseTime(first.startTime) -
                    parseTime(second.startTime),
            );
        }

        return {
            doctorId,
            byDay,
        };
    });
}

export function getGridBounds(
    availabilities: DoctorAvailability[],
): AvailabilityGridBounds {
    if (availabilities.length === 0) {
        return {
            startMinutes: DEFAULT_START_MINUTES,
            endMinutes: DEFAULT_END_MINUTES,
        };
    }

    let earliest = Number.POSITIVE_INFINITY;
    let latest = Number.NEGATIVE_INFINITY;

    for (const availability of availabilities) {
        earliest = Math.min(
            earliest,
            parseTime(availability.startTime),
        );
        latest = Math.max(
            latest,
            parseTime(availability.endTime),
        );
    }

    let startMinutes = Math.max(
        CLAMP_START_MINUTES,
        Math.floor(
            earliest / GRID_STEP_MINUTES,
        ) * GRID_STEP_MINUTES,
    );

    let endMinutes = Math.min(
        CLAMP_END_MINUTES,
        Math.ceil(
            latest / GRID_STEP_MINUTES,
        ) * GRID_STEP_MINUTES,
    );

    if (endMinutes <= startMinutes) {
        startMinutes =
            Math.floor(
                earliest / GRID_STEP_MINUTES,
            ) * GRID_STEP_MINUTES;

        endMinutes =
            Math.ceil(
                latest / GRID_STEP_MINUTES,
            ) * GRID_STEP_MINUTES;
    }

    return {
        startMinutes,
        endMinutes: Math.max(
            endMinutes,
            startMinutes + GRID_STEP_MINUTES,
        ),
    };
}

export function placeAvailabilities(
    availabilities: DoctorAvailability[],
): PlacedAvailability[] {
    const placed: PlacedAvailability[] = [];

    for (const day of DAYS_OF_WEEK) {
        const dayAvailabilities = availabilities
            .filter(
                (availability) =>
                    availability.dayOfWeek === day,
            )
            .sort(
                (first, second) =>
                    parseTime(first.startTime) -
                    parseTime(second.startTime),
            );

        const columnEndTimes: number[] = [];
        const assignments: Array<{
            availability: DoctorAvailability;
            column: number;
        }> = [];

        for (const availability of dayAvailabilities) {
            const startMinutes = parseTime(
                availability.startTime,
            );

            let column = columnEndTimes.findIndex(
                (endMinutes) =>
                    endMinutes <= startMinutes,
            );

            if (column === -1) {
                column = columnEndTimes.length;
                columnEndTimes.push(0);
            }

            columnEndTimes[column] = parseTime(
                availability.endTime,
            );

            assignments.push({
                availability,
                column,
            });
        }

        const columnCount = Math.max(
            1,
            columnEndTimes.length,
        );

        for (const assignment of assignments) {
            placed.push({
                availability:
                    assignment.availability,
                day,
                column: assignment.column,
                columnCount,
            });
        }
    }

    return placed;
}

export function createHourLabels(
    bounds: AvailabilityGridBounds,
): string[] {
    const labels: string[] = [];
    const firstHour = Math.ceil(
        bounds.startMinutes / 60,
    );

    for (
        let hour = firstHour;
        hour * 60 < bounds.endMinutes;
        hour += 1
    ) {
        labels.push(
            `${String(hour).padStart(2, "0")}:00`,
        );
    }

    return labels;
}