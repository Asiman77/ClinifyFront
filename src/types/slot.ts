export const APPOINTMENT_TYPES = [
    "ONLINE",
    "WALK_IN",
] as const;

export type AppointmentType =
    (typeof APPOINTMENT_TYPES)[number];

export type AvailableSlot = {
    startTime: string;
    endTime: string;
    available: boolean;
};