import type { ReactNode } from "react";

import { AppSidebar } from "@/components/shell/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import type { Role } from "@/types/auth";

const WORKSPACE_LABELS: Record<Role, string> = {
    ADMIN: "Administration",
    DOCTOR: "Doctor workspace",
    PATIENT: "Patient portal",
    LAB_TECHNICIAN: "Laboratory",
    RECEPTION: "Reception",
};

type AppShellProps = {
    role: Role;
    children: ReactNode;
};

export function AppShell({
    role,
    children,
}: AppShellProps) {
    return (
        <SidebarProvider>
            <AppSidebar role={role}
                className="print:hidden" />

            <SidebarInset className="min-w-0">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 print:hidden">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mx-3 data-vertical:h-4 data-vertical:self-center"
                    />
                    <p className="min-w-0 flex-1 truncate text-sm font-medium">
                        {WORKSPACE_LABELS[role]}
                    </p>
                    <ThemeSwitcher />
                </header>
                <div className="flex min-w-0 flex-1 flex-col p-4 print:p-0 md:p-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}