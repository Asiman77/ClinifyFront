import type { Metadata } from "next";

import { AuthForm } from "@/features/auth/auth-form";

export const metadata: Metadata = {
  title: "Giriş | Clinify",
  description: "Clinify hesabınıza FIN vasitəsilə daxil olun.",
};

export default function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-sm" aria-labelledby="auth-title">
        <header className="mb-8">
          <h1 id="auth-title" className="text-2xl font-semibold tracking-tight">
            Sign in to your Clinify account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your FIN code to continue.
          </p>
        </header>

        <AuthForm />
      </section>
    </main>
  );
}
