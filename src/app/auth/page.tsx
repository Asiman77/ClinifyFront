import type { Metadata } from "next";
import Link from "next/link";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthForm } from "@/features/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Clinify with your FIN code.",
};

export default function AuthPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Clinify
        </Link>

        <ThemeSwitcher />
      </header>

      <main className="flex flex-1 justify-center px-6 pt-[16svh] pb-12">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-semibold tracking-tight">
            Sign in to Clinify
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Continue with your FIN code.
          </p>

          <div className="mt-8">
            <AuthForm />
          </div>
        </div>
      </main>
    </div>
  );
}