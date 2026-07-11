import type { AppointmentType } from "@/types/slot";

export const APPOINTMENT_STATUSES = [
    "REQUESTED",
    "APPROVED",
    "REJECTED",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
] as const;

export type AppointmentStatus =
    (typeof APPOINTMENT_STATUSES)[number];

export type PatientAppointmentRequest = {
    doctorId: number;
    startTime: string;
    reason?: string;
};

export type WalkInAppointmentRequest = {
    patientId: number;
    doctorId: number;
    startTime: string;
    reason?: string;
};

export type AppointmentResponse = {
    id: number;

    patientId: number;
    patientFullName: string;

    doctorId: number;
    doctorFullName: string;

    createdById: number | null;
    createdByFullName: string | null;

    type: AppointmentType;
    status: AppointmentStatus;

    startTime: string;
    endTime: string;

    reason: string | null;

    createdAt: string;
    updatedAt: string;
};