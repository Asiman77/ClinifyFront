"use client";

import { PrinterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";

export function PrintButton({
    onPrint,
}: {
    onPrint?: () => void;
}) {
    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            className="print:hidden"
            onClick={onPrint ?? (() => window.print())}
        >
            <HugeiconsIcon
                icon={PrinterIcon}
                strokeWidth={2}
            />
            Print
        </Button>
    );
}