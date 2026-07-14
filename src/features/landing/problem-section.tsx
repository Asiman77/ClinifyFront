import {
    FileIcon,
    HandIcon,
    UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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
        <section id="problem" className="scroll-mt-16 bg-background py-20"
        >
            <div className="mx-auto max-w-6xl px-6">
                <h2 className="sr-only">Problems Clinify solves</h2>

                <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
                    {PROBLEMS.map((problem) => (
                        <article key={problem.title} className="flex flex-col gap-3 sm:px-8" >
                            <HugeiconsIcon
                                icon={problem.icon}
                                className={`size-6 ${problem.iconClassName}`}
                                aria-hidden
                            />

                            <h3 className="text-lg font-semibold text-foreground">
                                {problem.title}
                            </h3>

                            <p className="text-sm text-pretty text-muted-foreground">
                                {problem.body}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}