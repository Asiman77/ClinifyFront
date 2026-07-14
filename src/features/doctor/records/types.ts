export { LAB_STATUSES } from "@/types/lab";

export type {
    LabResponse,
    LabResponseFile as LabFileMetadata,
    LabStatus,
} from "@/types/lab";

export type {
    MedicalRecord,
} from "@/types/medical-record";

export type DoctorPatient = {
    id: number;
    firstName: string;
    lastName: string;
    email: string | null;
};

export type CreateLabTestRequest = {
    testName: string;
    note?: string;
};

export type CreateMedicalRecordRequest = {
    patientId: number;
    diagnosis: string;
    symptoms?: string;
    receipt?: string;
    labTests: CreateLabTestRequest[];
};