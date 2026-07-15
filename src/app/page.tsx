import { cookies } from "next/headers";

import { Hero } from "@/features/landing/hero";
import { LandingNav } from "@/features/landing/landing-nav";
import {
  getDashboardForRole,
  isRole,
} from "@/features/auth/roles";
import { ProblemSection } from "@/features/landing/problem-section";
import { HowItWorks } from "@/features/landing/how-it-works";
import { CtaFooter } from "@/features/landing/cta-footer";

async function getDashboardHref(): Promise<string | null> {
  const cookieStore = await cookies();

  if (!cookieStore.has("token")) {
    return null;
  }

  const selectedRole = cookieStore.get("clinify_role")?.value;

  if (!selectedRole || !isRole(selectedRole)) {
    return "/select-role";
  }

  return getDashboardForRole(selectedRole);
}

export default async function HomePage() {
  const dashboardHref = await getDashboardHref();

  return (
    <>
      <LandingNav dashboardHref={dashboardHref} />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
      </main>
      <footer>
        <CtaFooter />
      </footer>
    </>
  );
}