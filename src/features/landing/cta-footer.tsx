import Image from "next/image";

import { LandingCta } from "./landing-cta";
import { Reveal } from "./motion/reveal";

export function CtaFooter() {
    return (
        <section className="relative isolate overflow-hidden py-28 sm:py-36">
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/landing/landscape.jpg"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover object-[center_60%]"
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_top,transparent_55%,var(--background)_100%)]" />
            </div>

            <Reveal className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col items-center justify-center gap-9 text-center">
                <h2 className="w-full max-w-[952px] font-heading text-[40px] font-semibold leading-[48px] tracking-normal text-balance text-white [font-optical-sizing:auto] [text-shadow:0_2px_12px_rgb(0_0_0/0.3)] sm:text-[56px] sm:leading-[64px]">
                    Ready to connect your clinic?
                </h2>

                <p className="w-full max-w-[952px] font-sans text-base font-normal leading-6 tracking-normal text-pretty text-white [text-shadow:0_1px_6px_rgb(0_0_0/0.3)]">
                    See Clinify with your own workflow. Book a 15-minute demo with our team.
                </p>

                <LandingCta href="/auth" tone="solid" chevron>
                    Book a Demo
                </LandingCta>
            </Reveal>

            <p className="relative mt-16 translate-y-8 text-center text-xs text-white/70">
                &copy; 2026 Clinify. All rights reserved.
            </p>
        </section>
    );
}