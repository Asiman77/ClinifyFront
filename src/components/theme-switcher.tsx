"use client";

import { useSyncExternalStore } from "react";
import { Moon02Icon, Sun03Icon, } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

function subscribe() {
    return () => { };
}

export function ThemeSwitcher() {
    const { resolvedTheme, setTheme } = useTheme();

    const mounted = useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );

    const isDark = mounted && resolvedTheme === "dark";

    const label = isDark
        ? "Switch to light theme"
        : "Switch to dark theme";

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={label}
            title={label}
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            <HugeiconsIcon
                icon={isDark ? Sun03Icon : Moon02Icon}
                strokeWidth={2}
            />
        </Button>
    );
}