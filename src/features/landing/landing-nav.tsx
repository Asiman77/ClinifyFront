"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { LinkButton } from "@/components/link-button";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { LandingCta } from "./landing-cta";
import { BrandLockup } from "./brand-lockup";

const NAV_LINKS = [
    { href: "#how-it-works", label: "Product" },
    { href: "#problem", label: "Solutions" },
];

type LandingNavProps = {
    dashboardHref: string | null;
};

export function LandingNav({ dashboardHref }: LandingNavProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const updateNavigation = () => {
            setScrolled(window.scrollY > 16);
        };

        const frame = window.requestAnimationFrame(updateNavigation);
        window.addEventListener("scroll", updateNavigation, { passive: true });

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("scroll", updateNavigation);
        };
    }, []);

    const navigationColor = scrolled
        ? "text-muted-foreground hover:text-foreground"
        : "text-white/90 hover:text-white";

    return (
        <header
            className={cn("sticky top-0 z-50 h-16 w-full border-b transition-colors duration-300", scrolled ? "border-border bg-background/85 backdrop-blur-md" : "border-transparent",
            )}
        >
            <div className="mx-auto flex h-full w-full max-w-[1000px] items-center justify-between gap-6 px-6">
                <Link href="/" aria-label="Clinify home">
                    <BrandLockup tone={scrolled ? "default" : "light"} />
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                navigationColor,
                            )}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    {dashboardHref ? (
                        <LandingCta
                            href={dashboardHref}
                            tone={scrolled ? "primary" : "solid"}
                            chevron
                        >
                            Dashboard
                        </LandingCta>
                    ) : (
                        <>
                            <LinkButton
                                href="/auth"
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    !scrolled &&
                                    "text-white hover:bg-white/10 hover:text-white",
                                )}
                            >
                                Sign in
                            </LinkButton>

                            <LandingCta
                                href="/auth"
                                tone={scrolled ? "primary" : "solid"}
                                chevron
                            >
                                Book a Demo
                            </LandingCta>
                        </>
                    )}
                </div>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label="Open menu"
                                    className={cn(
                                        !scrolled &&
                                        "text-white hover:bg-white/10 hover:text-white",
                                    )}
                                />
                            }
                        >
                            <HugeiconsIcon icon={Menu01Icon} />
                        </SheetTrigger>

                        <SheetContent side="right" className="w-72 gap-0">
                            <SheetTitle className="sr-only">Clinify menu</SheetTitle>

                            <div className="p-6">
                                <BrandLockup />
                            </div>

                            <nav className="flex flex-col gap-1 px-4">
                                {NAV_LINKS.map((link) => (
                                    <SheetClose
                                        key={link.href}
                                        render={<a href={link.href} />}
                                        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                                    >
                                        {link.label}
                                    </SheetClose>
                                ))}
                            </nav>

                            <div className="mt-auto flex flex-col gap-2 p-6">
                                <LinkButton
                                    href={dashboardHref ?? "/auth"}
                                    className="w-full"
                                >
                                    {dashboardHref ? "Dashboard" : "Sign in"}
                                </LinkButton>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}