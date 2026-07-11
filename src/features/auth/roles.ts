import { ROLES, type Role } from "@/types/auth";

export const ROLE_DASHBOARDS = {
  ADMIN: "/admin/dashboard",
  DOCTOR: "/doctor/dashboard",
  PATIENT: "/patient/dashboard",
  LAB_TECHNICIAN: "/lab/dashboard",
  RECEPTION: "/reception/dashboard",
} satisfies Record<Role, string>;

export const ROLE_PATH_PREFIXES = {
  ADMIN: "/admin",
  DOCTOR: "/doctor",
  PATIENT: "/patient",
  LAB_TECHNICIAN: "/lab",
  RECEPTION: "/reception",
} satisfies Record<Role, string>;

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export function getDashboardForRole(role: Role): string {
  return ROLE_DASHBOARDS[role];
}

export function getPathPrefixForRole(role: Role): string {
  return ROLE_PATH_PREFIXES[role];
}
