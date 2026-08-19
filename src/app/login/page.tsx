import type { Metadata } from "next";

import { AuthCard } from "@/features/auth/AuthCard";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <AuthCard />;
}
