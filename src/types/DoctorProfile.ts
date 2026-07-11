export type DoctorProfile = {
    id: number;
    userId: number;
    doctorFirstName: string;
    doctorLastName: string;
    email: string;
    departmentId: number;
    departmentName: string;
    specialization: string;
    bio: string | null;
    experienceYears: number | null;
    active: boolean;
};