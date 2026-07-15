import {
    FileIcon,
    HandIcon,
    UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Stagger, StaggerItem } from "./motion/reveal";

const PROBLEMS = [
    {
        title: "Paper charts & spreadsheets",
        body: "Records that don't talk to each other or to the person who needs them next.",
        icon: FileIcon,
        iconClassName: "text-sky-600",
    },
    {
        title: "Results passed by hand",
        body: "Lab results are faxed, emailed, or carried over instead of landing in the patient chart automatically.",
        icon: HandIcon,
        iconClassName: "text-violet-600",
    },
    {
        title: "Re-entering the same patient",
        body: "Reception, doctors, and laboratories enter the same patient information into different tools.",
        icon: UserIcon,
        iconClassName: "text-emerald-600",
    },
] as const;

export function ProblemSection() {
    return (
        <section id="problem" className="scroll-mt-16 flex min-h-[344px] items-center bg-background" >
            <div className="mx-auto w-full max-w-[1440px] px-6 py-16">
                <h2 className="sr-only">Problems Clinify solves</h2>

                <Stagger className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
                    {PROBLEMS.map((problem) => (
                        <StaggerItem key={problem.title} className="sm:px-8">
                            <article className="flex h-full flex-col gap-3">
                                <HugeiconsIcon
                                    icon={problem.icon}
                                    className={`size-6 ${problem.iconClassName}`}
                                    aria-hidden
                                />

                                <h3 className="font-heading text-lg font-semibold text-foreground">
                                    {problem.title}
                                </h3>

                                <p className="text-sm text-pretty text-muted-foreground">
                                    {problem.body}
                                </p>
                            </article>
                        </StaggerItem>
                    ))}
                </Stagger>
            </div>
        </section>
    );
}