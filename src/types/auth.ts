export const ROLES = [
  "ADMIN",
  "DOCTOR",
  "PATIENT",
  "LAB_TECHNICIAN",
  "RECEPTION",
] as const;

export type Role = (typeof ROLES)[number];

export type CurrentUser = {
  id: number;
  fin: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
  email: string;
  hasAccount: boolean;
  roles: Role[];
};

export type CheckFinStatus = "LOGIN_REQUIRED" | "REGISTER_REQUIRED";

export type CheckFinResponse = {
  status: CheckFinStatus;
};

export type LoginResponse = {
  fin: string;
  roles: Role[];
};
export type VerifyIdentityResponse = {
  verified: boolean;
};