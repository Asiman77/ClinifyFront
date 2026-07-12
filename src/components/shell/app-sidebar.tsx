"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/features/auth/api";
import { LogoutButton } from "@/features/auth/components/logout-button";
import {
    getNavigationForRole,
} from "@/features/auth/navigation";
import type { Role } from "@/types/auth";

const ROLE_LABELS: Record<Role, string> = {
    ADMIN: "Administrator",
    DOCTOR: "Doctor",
    PATIENT: "Patient",
    LAB_TECHNICIAN: "Lab technician",
    RECEPTION: "Reception",
};

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
    role: Role;
};

function AccountFooter({ role }: { role: Role }) {
    const {
        data: user,
        isLoading,
    } = useCurrentUser();

    const displayName = isLoading
        ? "Loading account..."
        : user
            ? `${user.firstName} ${user.lastName}`
            : "Account unavailable";

    const canSwitchRole =
        user !== undefined && user.roles.length > 1;

    return (
        <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
                <div
                    className="flex items-center gap-2"
                    aria-live="polite"
                >
                    {isLoading && (
                        <Spinner className="size-3.5 shrink-0" />
                    )}

                    <p className="truncate text-sm font-medium">
                        {displayName}
                    </p>
                </div>

                <p className="truncate text-xs text-muted-foreground">
                    {ROLE_LABELS[role]}
                </p>
            </div>

            <div className="flex shrink-0 items-center">
                {canSwitchRole && (
                    <Button
                        render={<Link href="/select-role" />}
                        nativeButton={false}
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Switch role"
                        title="Switch role"
                    >
                        <HugeiconsIcon
                            icon={ArrowDataTransferHorizontalIcon}
                            strokeWidth={2}
                        />
                    </Button>
                )}
                <LogoutButton />
            </div>
        </div>
    );
}

export function AppSidebar({
    role,
    ...props
}: AppSidebarProps) {
    const pathname = usePathname();
    const navigation = getNavigationForRole(role);

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div className="flex h-12 items-center px-2">
                    <span className="text-base font-semibold">
                        Clinify
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {navigation.map((item) => {
                            const isActive =
                                pathname === item.href ||
                                pathname.startsWith(`${item.href}/`);

                            return (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        isActive={isActive}
                                        tooltip={item.label}
                                        render={
                                            <Link
                                                href={item.href}
                                                aria-current={
                                                    isActive ? "page" : undefined
                                                }
                                            />
                                        }
                                    >
                                        <HugeiconsIcon
                                            icon={item.icon}
                                            strokeWidth={2}
                                        />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <AccountFooter role={role} />
            </SidebarFooter>
        </Sidebar>
    );
}