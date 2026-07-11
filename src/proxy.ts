import { NextResponse, type NextRequest } from "next/server";

import {
  getDashboardForRole,
  getPathPrefixForRole,
  isRole,
} from "@/features/auth/roles";

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

function matchesRolePath(pathname: string, rolePrefix: string): boolean {
  return pathname === rolePrefix || pathname.startsWith(`${rolePrefix}/`);
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const selectedRole = request.cookies.get("clinify_role")?.value;

  if (!token) {
    const response = redirectTo(request, "/auth");

    response.cookies.delete("clinify_role");
    response.cookies.delete("clinify_roles");

    return response;
  }

  if (!selectedRole || !isRole(selectedRole)) {
    const response = redirectTo(request, "/select-role");

    response.cookies.delete("clinify_role");

    return response;
  }

  const allowedPrefix = getPathPrefixForRole(selectedRole);

  if (!matchesRolePath(request.nextUrl.pathname, allowedPrefix)) {
    return redirectTo(request, getDashboardForRole(selectedRole));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/doctor/:path*",
    "/patient/:path*",
    "/lab/:path*",
    "/reception/:path*",
  ],
};
