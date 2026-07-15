export const DAYS_OF_WEEK = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
] as const;

export type DayOfWeek =
    (typeof DAYS_OF_WEEK)[number];

export const AVAILABILITY_TYPES = [
    "ONLINE_ONLY",
    "WALK_IN_ONLY",
    "MIXED",
] as const;

export type AvailabilityType =
    (typeof AVAILABILITY_TYPES)[number];

export type DoctorAvailability = {
    id: number;
    doctorId: number;
    doctorFirstName: string;
    doctorLastName: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    availabilityType: AvailabilityType;
    active: boolean;
};

export type CreateDoctorAvailabilityRequest = {
    doctorId: number;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    availabilityType: AvailabilityType;
    active: boolean;
};

export type UpdateDoctorAvailabilityRequest = {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    availabilityType: AvailabilityType;
    active: boolean;
};