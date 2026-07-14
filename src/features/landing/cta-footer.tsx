import Image from "next/image";

import { LandingCta } from "./landing-cta";

export function CtaFooter() {
    return (
        <section className="relative isolate overflow-hidden py-28 sm:py-36">
            <div className="absolute inset-0 -z-10">
                <Image src="/landing/landscape.jpg"  alt="" fill sizes="100vw" className="object-cover object-bottom" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/55" />
            </div>

            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 text-center">
                <h2 className="text-4xl font-semibold text-balance text-white [text-shadow:0_2px_12px_rgb(0_0_0/0.3)] sm:text-5xl">
                    Ready to connect your clinic?
                </h2>

                <p className="max-w-xl text-base text-pretty text-white/85 [text-shadow:0_1px_6px_rgb(0_0_0/0.3)] sm:text-lg">
                    See Clinify with your own workflow. Book a 15-minute demo with our
                    team.
                </p>

                <LandingCta href="/auth" tone="solid" chevron>
                    Book a Demo
                </LandingCta>
            </div>

            <p className="relative mt-16 text-center text-xs text-white/70">
                &copy; 2026 Clinify. All rights reserved.
            </p>
        </section>
    );
}