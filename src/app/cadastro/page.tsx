import type { Metadata } from "next";

import { AuthCard } from "@/features/auth/AuthCard";

export const metadata: Metadata = {
  title: "Cadastro",
};

export default function CadastroPage() {
  return (
    <AuthCard
      title="Crie sua conta"
      subtitle="Cadastre-se para favoritar obras e acompanhar novidades da galeria."
      fields={[
        { id: "nome", label: "Nome completo", type: "text", placeholder: "Seu nome" },
        { id: "email", label: "E-mail", type: "email", placeholder: "voce@email.com" },
        { id: "senha", label: "Senha", type: "password", placeholder: "••••••••" },
      ]}
      submitLabel="Criar conta"
      footerText="Já tem uma conta?"
      footerLinkLabel="Entrar"
      footerLinkHref="/login"
    />
  );
}
