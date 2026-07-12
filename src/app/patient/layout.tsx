import type { ReactNode } from "react";

import { AppShell } from "@/components/shell/app-shell";

type PatientLayoutProps = {
    children: ReactNode;
};

export default function PatientLayout({
    children,
}: PatientLayoutProps) {
    return (
        <AppShell role="PATIENT">
            {children}
        </AppShell>
    );
}