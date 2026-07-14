import type { LabResponse } from "@/types/lab";

export type MedicalRecordSummary = {
    id: number;
    diagnosis: string;
    recordDate: string;
    doctorFullName: string;
    labTestCount: number;
};

export type MedicalRecord = {
    id: number;
    patientId: number;
    patientFullName: string;
    doctorId: number;
    doctorFullName: string;
    diagnosis: string;
    symptoms: string | null;
    receipt: string | null;
    recordDate: string;
    labResponses: LabResponse[];
    createdAt: string;
    updatedAt: string;
};