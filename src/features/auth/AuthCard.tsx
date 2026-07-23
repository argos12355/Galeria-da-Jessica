"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Field {
  id: string;
  label: string;
  type: string;
  placeholder: string;
}

interface AuthCardProps {
  title: string;
  subtitle: string;
  fields: Field[];
  submitLabel: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
}

export function AuthCard({
  title,
  subtitle,
  fields,
  submitLabel,
  footerText,
  footerLinkLabel,
  footerLinkHref,
}: AuthCardProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="aurora-bg noise-overlay relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
      <div className="glass glow-violet relative z-10 w-full max-w-md rounded-3xl p-8 sm:p-10">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--neon-cyan)]" />
          <span className="text-sm font-medium text-muted-foreground">Galeria da Jessica</span>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                required
                className="border-white/10 bg-white/5"
              />
            </div>
          ))}

          {submitted ? (
            <p className="rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10 px-4 py-3 text-sm text-[var(--neon-cyan)]">
              Autenticação real chega na próxima fase (NextAuth). Por enquanto, esta é uma demonstração de interface.
            </p>
          ) : (
            <Button type="submit" className="glow-violet w-full rounded-full">
              {submitLabel}
            </Button>
          )}
        </form>

        <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-white/10" />
          ou
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <Button variant="outline" className="mt-6 w-full rounded-full border-white/15 bg-white/5">
          Continuar com Google
        </Button>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {footerText}{" "}
          <Link href={footerLinkHref} className="text-foreground underline underline-offset-4">
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
