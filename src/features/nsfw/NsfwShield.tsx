"use client";

import { EyeOff } from "lucide-react";

import { useNsfwConsent } from "@/features/nsfw/useNsfwConsent";
import { useI18n } from "@/i18n/I18nProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Cobre uma obra +18 até o visitante confirmar a idade.
 *
 * O children fica montado por baixo do desfoque, mas com `inert` para que
 * teclado e leitor de tela não alcancem o conteúdo antes do aceite.
 */
export function NsfwShield({ children }: { children: React.ReactNode }) {
  const { dict } = useI18n();
  const { confirmed, confirm } = useNsfwConsent();

  if (confirmed) return <>{children}</>;

  return (
    <div className="relative h-full w-full">
      <div className="h-full w-full scale-105 blur-2xl" inert>
        {children}
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/60 p-4 text-center">
        <Badge className="border-none bg-white/15 text-white">{dict.nsfw.badge}</Badge>
        <EyeOff className="h-6 w-6 text-white/80" aria-hidden />
        <p className="text-sm font-medium text-white">{dict.nsfw.gateTitle}</p>
        <p className="max-w-xs text-xs text-white/70">{dict.nsfw.gateBody}</p>
        <Button
          size="sm"
          onClick={(event) => {
            // O escudo costuma ficar dentro de um link para a obra.
            event.preventDefault();
            event.stopPropagation();
            confirm();
          }}
          className="mt-1 rounded-full"
        >
          {dict.nsfw.reveal}
        </Button>
      </div>
    </div>
  );
}
