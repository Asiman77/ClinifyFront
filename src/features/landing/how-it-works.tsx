import { WorkflowSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { FeatureCard } from "./feature-card";

const FEATURES = [
    {
        title: "Booking that fits how your front desk works.",
        body: "Reception books, reschedules, and confirms appointments from one place. Patients see real-time doctor availability.",
        alt: "Clinify appointment booking with doctor availability",
        src: "/landing/feature-scheduling.png",
    },
    {
        title: "One patient chart the whole team writes to.",
        body: "Doctor notes, diagnoses, and patient history live in a single record, ready for the next clinician.",
        alt: "Clinify patient medical record with diagnosis and history",
        src: "/landing/feature-records.png",
    },
    {
        title: "Lab results that land in the chart automatically.",
        body: "Technicians upload results once, and they become connected to the laboratory request and patient record.",
        alt: "Clinify laboratory result connected to a medical record",
        src: "/landing/feature-labs.png",
    },
    {
        title: "Every role sees exactly what it needs.",
        body: "Patients, doctors, laboratory staff, reception, and administrators each receive a dashboard focused on their work.",
        alt: "Clinify role-based healthcare dashboard",
        src: "/landing/feature-dashboards.png",
    },
] as const;

export function HowItWorks() {
    return (
        <section id="how-it-works" className="scroll-mt-16 bg-background py-20"
        >
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-primary uppercase">
                        <HugeiconsIcon
                            icon={WorkflowSquareIcon}
                            className="size-4"
                            aria-hidden
                        />
                        How Clinify Works
                    </span>

                    <h2 className="text-3xl font-semibold text-balance text-foreground sm:text-4xl">
                        Appointments, records, and lab results in one system, always in
                        sync.
                    </h2>

                    <p className="text-base text-pretty text-muted-foreground">
                        Book an appointment and it is linked to the patient chart. Doctor
                        notes and laboratory results stay connected to the same record.
                    </p>
                </div>

                <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12">
                    {FEATURES.map((feature) => (
                        <FeatureCard key={feature.title} title={feature.title} body={feature.body} alt={feature.alt} src={feature.src} />
                    ))}
                </div>
            </div>
        </section>
    );
}