"use client";

import { useActionState, useState } from "react";

import { errorText } from "@/features/admin/errorText";
import { useI18n } from "@/i18n/I18nProvider";
import { localizedText } from "@/i18n/localized";
import { IDLE } from "@/server/actionState";
import { updateAppearanceAction } from "@/server/settingsActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSettings } from "@/server/settings";

const FIELD =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground";

export function AppearanceForm({ settings }: { settings: SiteSettings }) {
  const { dict, locale } = useI18n();
  const [state, formAction, pending] = useActionState(updateAppearanceAction, IDLE);
  const message = errorText(state.error, dict);

  // Prévia local: mostra a cor antes de salvar, sem ida ao servidor.
  const [colors, setColors] = useState({
    colorPrimary: settings.colorPrimary,
    colorBackground: settings.colorBackground,
    colorAccent: settings.colorAccent,
  });

  const colorFields = [
    { name: "colorPrimary", label: dict.panel.appearance.colorPrimary },
    { name: "colorBackground", label: dict.panel.appearance.colorBackground },
    { name: "colorAccent", label: dict.panel.appearance.colorAccent },
  ] as const;

  return (
    <form action={formAction} className="space-y-6">
      <section className="glass rounded-2xl p-6">
        <h2 className="text-lg font-medium">{dict.panel.appearance.colorsSection}</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {colorFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <div className="flex items-center gap-2">
                <input
                  id={field.name}
                  name={field.name}
                  type="color"
                  value={colors[field.name]}
                  onChange={(event) =>
                    setColors((prev) => ({ ...prev, [field.name]: event.target.value }))
                  }
                  className="h-9 w-12 shrink-0 cursor-pointer rounded border border-white/10 bg-transparent"
                />
                <output className="font-mono text-xs text-muted-foreground">
                  {colors[field.name]}
                </output>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-5 flex items-center gap-3 rounded-xl p-4"
          style={{ background: colors.colorBackground }}
        >
          <span className="text-xs text-white/60">{dict.panel.appearance.preview}</span>
          <span
            className="rounded-full px-4 py-1.5 text-sm font-medium text-white"
            style={{ background: colors.colorPrimary }}
          >
            {localizedText(settings.siteTitle, locale)}
          </span>
          <span className="h-4 w-4 rounded-full" style={{ background: colors.colorAccent }} />
        </div>
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="text-lg font-medium">{dict.panel.appearance.textsSection}</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="siteTitlePt">{dict.panel.appearance.siteTitle} (PT)</Label>
            <Input
              id="siteTitlePt"
              name="siteTitlePt"
              required
              defaultValue={settings.siteTitle.pt ?? ""}
              className="border-white/10 bg-white/5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteTitleEn">{dict.panel.appearance.siteTitle} (EN)</Label>
            <Input
              id="siteTitleEn"
              name="siteTitleEn"
              defaultValue={settings.siteTitle.en ?? ""}
              className="border-white/10 bg-white/5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taglinePt">{dict.panel.appearance.tagline} (PT)</Label>
            <Input
              id="taglinePt"
              name="taglinePt"
              defaultValue={settings.tagline.pt ?? ""}
              className="border-white/10 bg-white/5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taglineEn">{dict.panel.appearance.tagline} (EN)</Label>
            <Input
              id="taglineEn"
              name="taglineEn"
              defaultValue={settings.tagline.en ?? ""}
              className="border-white/10 bg-white/5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aboutPt">{dict.panel.appearance.about} (PT)</Label>
            <Textarea
              id="aboutPt"
              name="aboutPt"
              rows={4}
              defaultValue={settings.aboutText.pt ?? ""}
              className="border-white/10 bg-white/5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aboutEn">{dict.panel.appearance.about} (EN)</Label>
            <Textarea
              id="aboutEn"
              name="aboutEn"
              rows={4}
              defaultValue={settings.aboutText.en ?? ""}
              className="border-white/10 bg-white/5"
            />
          </div>
        </div>
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="text-lg font-medium">{dict.panel.appearance.layoutSection}</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="layoutVariant">{dict.panel.appearance.layoutSection}</Label>
            <select
              id="layoutVariant"
              name="layoutVariant"
              defaultValue={settings.layoutVariant}
              className={FIELD}
            >
              <option value="grid">{dict.panel.appearance.layoutGrid}</option>
              <option value="masonry">{dict.panel.appearance.layoutMasonry}</option>
              <option value="carousel">{dict.panel.appearance.layoutCarousel}</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontHeading">{dict.panel.appearance.fontHeading}</Label>
            <Input
              id="fontHeading"
              name="fontHeading"
              defaultValue={settings.fontHeading}
              className="border-white/10 bg-white/5"
            />
          </div>
        </div>
      </section>

      {message && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
      {state.ok && !message && (
        <p role="status" className="text-sm text-[var(--neon-cyan)]">
          {dict.panel.slots.saved}
        </p>
      )}

      <Button type="submit" disabled={pending} className="rounded-full">
        {pending ? dict.panel.board.saving : dict.panel.board.save}
      </Button>
    </form>
  );
}
