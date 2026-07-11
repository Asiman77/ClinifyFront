import type { Role } from "@/types/auth";

export const ROLE_DASHBOARDS = {
  ADMIN: "/admin/dashboard",
  DOCTOR: "/doctor/dashboard",
  PATIENT: "/patient/dashboard",
  LAB_TECHNICIAN: "/lab/dashboard",
  RECEPTION: "/reception/dashboard",
} satisfies Record<Role, string>;

export function getDashboardForRole(
  role: Role,
): string {
  return ROLE_DASHBOARDS[role];
}