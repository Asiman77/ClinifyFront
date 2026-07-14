import Image from "next/image";

import { LandingCta } from "./landing-cta";
import { ProductFrame } from "./product-frame";

export function Hero() {
    return (
        <section className="relative isolate -mt-16 overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <Image src="/landing/landscape.jpg" alt="" fill priority sizes="100vw" className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-background" />
            </div>

            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pt-28 pb-14 text-center sm:pt-36">
                <h1 className="text-4xl font-semibold text-balance text-white [text-shadow:0_2px_12px_rgb(0_0_0/0.3)] sm:text-5xl md:text-6xl">
                    One connected system for records, appointments &amp; lab results.
                </h1>

                <p className="max-w-2xl text-base text-pretty text-white/90 [text-shadow:0_1px_6px_rgb(0_0_0/0.3)] sm:text-lg">
                    Clinify brings scheduling, patient charts, doctor notes, and lab
                    results into a single record so your team stops re-entering the same
                    patient three times a day.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <LandingCta href="/auth" tone="solid" chevron>
                        Book a Demo
                    </LandingCta>

                    <LandingCta href="#how-it-works" tone="glass">
                        See How it Works
                    </LandingCta>
                </div>
            </div>

            <div className="mx-auto -mt-2 max-w-5xl px-6 pb-16 sm:-mt-4">
                <ProductFrame src="/landing/product-hero.png" alt="Clinify dashboard showing appointments, charts, and upcoming visits" priority />
            </div>
        </section>
    );
}