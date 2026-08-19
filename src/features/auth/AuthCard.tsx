"use client";

import { useActionState } from "react";
import { Sparkles } from "lucide-react";

import { useI18n } from "@/i18n/I18nProvider";
import { SITE_NAME } from "@/lib/constants";
import { signInAction } from "@/server/authActions";
import type { SignInState } from "@/server/authActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const INITIAL: SignInState = { error: null };

/**
 * Login único da artista. Não existe cadastro público — favoritos do
 * visitante vivem no localStorage e não precisam de conta.
 */
export function AuthCard() {
  const { dict } = useI18n();
  const [state, formAction, pending] = useActionState(signInAction, INITIAL);

  return (
    <div className="aurora-bg noise-overlay relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
      <div className="glass glow-violet relative z-10 w-full max-w-md rounded-3xl p-8 sm:p-10">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--neon-cyan)]" />
          <span className="text-sm font-medium text-muted-foreground">{SITE_NAME}</span>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">{dict.auth.title}</h1>
        <p className="mt-2 text-muted-foreground">{dict.auth.subtitle}</p>

        <form action={formAction} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">{dict.auth.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={dict.auth.emailPlaceholder}
              required
              className="border-white/10 bg-white/5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{dict.auth.password}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder={dict.auth.passwordPlaceholder}
              required
              className="border-white/10 bg-white/5"
            />
          </div>

          {state.error && (
            <p
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {dict.auth.errors[state.error]}
            </p>
          )}

          <Button type="submit" disabled={pending} className="glow-violet w-full rounded-full">
            {pending ? dict.auth.submitting : dict.auth.submit}
          </Button>
        </form>
      </div>
    </div>
  );
}
