export const LAB_STATUSES = [
    "NOT_REQUIRED",
    "REQUESTED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "PENDING",
] as const;

export type LabStatus = (typeof LAB_STATUSES)[number];

export type LabFileMetadata = {
    publicId: string;
    secureUrl: string;
    originalFileName: string;
    contentType: string;
    fileSize: number;
    resourceType: string;
};

export type LabResponse = {
    id: number;
    medicalRecordId: number;
    labTechnicianId: number | null;
    labTechnicianFullName: string | null;
    testName: string;
    status: LabStatus;
    resultText: string | null;
    note: string | null;
    files: LabFileMetadata[];
    createdAt: string;
    updatedAt: string;
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
