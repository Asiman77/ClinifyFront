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

            <div className="mx-auto flex min-h-[560px] w-full max-w-[1000px] flex-col items-center gap-9 px-6 pt-[168px] pb-[168px] text-center">
                <h1 className="flex h-auto w-full max-w-[952px] items-center justify-center text-center font-heading text-[40px] font-semibold leading-[48px] tracking-normal text-balance text-white [font-optical-sizing:auto] [text-shadow:0_2px_12px_rgb(0_0_0/0.3)] sm:h-[128px] sm:text-[56px] sm:leading-[64px]">
                    One connected system for records appointments &amp; lab results.
                </h1>

                <p className="flex h-auto w-full max-w-[952px] items-center justify-center text-center font-sans text-base font-normal leading-6 tracking-normal text-white lg:h-[48px]">
                    Clinify brings scheduling, patient charts, doctor notes, and lab results into a single <br /> record so your team stops re-entering the same patient three times a day.
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

            <div className="-mt-2 w-full px-6 pb-16 sm:-mt-4">
                <div className="mx-auto w-full max-w-[1200px]">
                    <ProductFrame src="/landing/product-hero.png" alt="Clinify dashboard showing appointments, charts, and upcoming visits" priority
                    />
                </div>
            </div>
        </section>
    );
}