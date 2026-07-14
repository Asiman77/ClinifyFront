export const LAB_STATUSES = [
    "NOT_REQUIRED",
    "REQUESTED",
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
] as const;

export type LabStatus =
    (typeof LAB_STATUSES)[number];

export type LabResponseFile = {
    publicId: string;
    secureUrl: string;
    originalFileName: string;
    contentType: string;
    fileSize: number;
    resourceType: string;
};

export type LabResponseSummary = {
    id: number;
    medicalRecordId: number;
    patientId: number;
    patientFullName: string;
    doctorId: number;
    doctorFullName: string;
    testName: string;
    status: LabStatus;
    createdAt: string;
    updatedAt: string;
};

export type LabResponseDetail = {
    id: number;
    medicalRecordId: number;
    patientId: number;
    patientFullName: string;
    doctorId: number;
    doctorFullName: string;
    labTechnicianId: number | null;
    labTechnicianFullName: string | null;
    diagnosis: string;
    symptoms: string | null;
    testName: string;
    status: LabStatus;
    resultText: string | null;
    note: string | null;
    files: LabResponseFile[];
    createdAt: string;
    updatedAt: string;
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
    files: LabResponseFile[];
    createdAt: string;
    updatedAt: string;
};

export type UpdateLabResponseRequest = {
    resultText?: string;
    note?: string;
    status?: LabStatus;
};

export type DeleteLabResponseFileRequest = {
    publicId: string;
};