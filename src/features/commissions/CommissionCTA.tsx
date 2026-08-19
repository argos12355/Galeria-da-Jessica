"use client";

import { useState } from "react";
import { AtSign, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/i18n/I18nProvider";
import { localizedList } from "@/i18n/localized";
import { cn } from "@/lib/utils";
import type { CommissionSettings, SlotState } from "@/types/commission";

export function CommissionCTA({
  slots,
  settings,
  className,
}: {
  slots: SlotState;
  settings: CommissionSettings;
  className?: string;
}) {
  const { dict, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const rules = localizedList(settings.rules, locale);

  return (
    <>
      <Button
        size="lg"
        disabled={!slots.canRequest}
        onClick={() => setOpen(true)}
        data-cursor="interactive"
        className={cn("glow-violet rounded-full px-6", className)}
      >
        {slots.canRequest ? dict.commissions.cta.request : dict.commissions.cta.unavailable}
      </Button>

      {!slots.canRequest && (
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          {dict.commissions.closedNotice}
        </p>
      )}

      {/*
        `&& slots.canRequest` fecha o pop-up sozinho se a última vaga sumir
        enquanto ele está aberto — sem isso o cliente ainda veria os links.
      */}
      <Dialog open={open && slots.canRequest} onOpenChange={setOpen}>
        <DialogContent className="glass sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">{dict.commissions.dialog.title}</DialogTitle>
          </DialogHeader>

          {rules.length > 0 && (
            <section>
              <h3 className="text-sm font-medium">{dict.commissions.dialog.rulesTitle}</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {rules.map((rule) => (
                  <li key={rule} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--neon-cyan)]" />
                    {rule}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h3 className="text-sm font-medium">{dict.commissions.dialog.contactTitle}</h3>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              {settings.discordUrl && (
                <ContactLink
                  href={settings.discordUrl}
                  label={dict.commissions.dialog.discord}
                  handle={settings.discordHandle}
                  icon={<MessageCircle className="h-4 w-4" />}
                />
              )}
              {settings.twitterUrl && (
                <ContactLink
                  href={settings.twitterUrl}
                  label={dict.commissions.dialog.twitter}
                  handle={settings.twitterHandle}
                  icon={<AtSign className="h-4 w-4" />}
                />
              )}
            </div>
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ContactLink({
  href,
  label,
  handle,
  icon,
}: {
  href: string;
  label: string;
  handle: string | null;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor="interactive"
      className="glass flex flex-1 items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
    >
      <span className="text-[var(--neon-cyan)]">{icon}</span>
      <span className="flex flex-col">
        <span className="text-sm font-medium">{label}</span>
        {handle && <span className="text-xs text-muted-foreground">{handle}</span>}
      </span>
    </a>
  );
}
