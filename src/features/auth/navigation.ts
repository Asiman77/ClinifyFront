import {
    Calendar03Icon,
    CalendarAdd01Icon,
    FileAttachmentIcon,
    Home01Icon,
    TestTube01Icon,
} from "@hugeicons/core-free-icons";

import type { Role } from "@/types/auth";

type NavigationIcon = typeof Home01Icon;

export type NavigationItem = {
    href: string;
    label: string;
    icon: NavigationIcon;
};

const NAVIGATION_BY_ROLE = {
    ADMIN: [
        {
            href: "/admin/dashboard",
            label: "Dashboard",
            icon: Home01Icon,
        },
    ],

    DOCTOR: [
        {
            href: "/doctor/dashboard",
            label: "Dashboard",
            icon: Home01Icon,
        },
        {
            href: "/doctor/appointments",
            label: "Appointments",
            icon: Calendar03Icon,
        },
        {
            href: "/doctor/medical-records",
            label: "Medical records",
            icon: FileAttachmentIcon,
        },
    ],

    PATIENT: [
        {
            href: "/patient/dashboard",
            label: "Dashboard",
            icon: Home01Icon,
        },
        {
            href: "/patient/book-appointment",
            label: "Book appointment",
            icon: CalendarAdd01Icon,
        },
        {
            href: "/patient/appointments",
            label: "Appointments",
            icon: Calendar03Icon,
        },
        {
            href: "/patient/medical-records",
            label: "Medical records",
            icon: FileAttachmentIcon,
        },
    ],

    LAB_TECHNICIAN: [
        {
            href: "/lab/dashboard",
            label: "Dashboard",
            icon: Home01Icon,
        },
        {
            href: "/lab/responses",
            label: "Lab responses",
            icon: TestTube01Icon,
        },
    ],

    RECEPTION: [
        {
            href: "/reception/dashboard",
            label: "Dashboard",
            icon: Home01Icon,
        },
    ],
} satisfies Record<Role, NavigationItem[]>;

export function getNavigationForRole(
    role: Role,
): NavigationItem[] {
    return NAVIGATION_BY_ROLE[role];
}