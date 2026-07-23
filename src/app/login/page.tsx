import type { Metadata } from "next";

import { AuthCard } from "@/features/auth/AuthCard";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Bem-vinda de volta"
      subtitle="Entre para favoritar obras e acompanhar a galeria."
      fields={[
        { id: "login", label: "Usuário ou e-mail", type: "text", placeholder: "seu usuário" },
        { id: "senha", label: "Senha", type: "password", placeholder: "••••••••" },
      ]}
      submitLabel="Entrar"
      footerText="Ainda não tem conta?"
      footerLinkLabel="Cadastre-se"
      footerLinkHref="/cadastro"
    />
  );
}
