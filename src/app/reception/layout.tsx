import type { ReactNode } from "react";

import { AppShell } from "@/components/shell/app-shell";

export default function ReceptionLayout({
    children,
}: {
    children: ReactNode;
}) {
    return <AppShell role="RECEPTION">{children}</AppShell>;
}