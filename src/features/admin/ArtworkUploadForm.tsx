"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";

import { errorText } from "@/features/admin/errorText";
import { useI18n } from "@/i18n/I18nProvider";
import { IDLE } from "@/server/actionState";
import { createArtworkAction } from "@/server/artworkActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, categoryLabel } from "@/types/artwork";

const FIELD =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground";

export function ArtworkUploadForm() {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(createArtworkAction, IDLE);
  const message = errorText(state.error, dict);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state.ok]);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2 rounded-full">
        <Upload className="h-4 w-4" />
        {dict.panel.artworks.newArtwork}
      </Button>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="glass rounded-2xl p-6">
      <h2 className="text-lg font-medium">{dict.panel.artworks.newArtwork}</h2>

      <div className="mt-5 space-y-2">
        <Label htmlFor="image">{dict.panel.artworks.image}</Label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          required
          className="w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-foreground"
        />
        <p className="text-xs text-muted-foreground">{dict.panel.artworks.imageHint}</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="titlePt">{dict.panel.artworks.titleField} (PT)</Label>
          <Input id="titlePt" name="titlePt" required className="border-white/10 bg-white/5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="titleEn">{dict.panel.artworks.titleField} (EN)</Label>
          <Input id="titleEn" name="titleEn" className="border-white/10 bg-white/5" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">{dict.panel.artworks.category}</Label>
          <select id="category" name="category" defaultValue="illustration" className={FIELD}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabel(cat, dict)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">{dict.panel.artworks.tags}</Label>
          <Input id="tags" name="tags" className="border-white/10 bg-white/5" />
          <p className="text-xs text-muted-foreground">{dict.panel.artworks.tagsHint}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="techniquePt">{dict.panel.artworks.technique} (PT)</Label>
          <Input id="techniquePt" name="techniquePt" className="border-white/10 bg-white/5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="techniqueEn">{dict.panel.artworks.technique} (EN)</Label>
          <Input id="techniqueEn" name="techniqueEn" className="border-white/10 bg-white/5" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descriptionPt">{dict.panel.artworks.description} (PT)</Label>
          <Textarea
            id="descriptionPt"
            name="descriptionPt"
            rows={2}
            className="border-white/10 bg-white/5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descriptionEn">{dict.panel.artworks.description} (EN)</Label>
          <Textarea
            id="descriptionEn"
            name="descriptionEn"
            rows={2}
            className="border-white/10 bg-white/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contentPt">{dict.panel.artworks.content} (PT)</Label>
          <Textarea id="contentPt" name="contentPt" rows={4} className="border-white/10 bg-white/5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contentEn">{dict.panel.artworks.content} (EN)</Label>
          <Textarea id="contentEn" name="contentEn" rows={4} className="border-white/10 bg-white/5" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-5">
        {[
          { name: "isPublished", label: dict.panel.artworks.isPublished, checked: true },
          { name: "isFeatured", label: dict.panel.artworks.isFeatured, checked: false },
          { name: "isMain", label: dict.panel.artworks.isMain, checked: false },
          { name: "isNsfw", label: dict.panel.artworks.isNsfw, checked: false },
        ].map((box) => (
          <label key={box.name} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={box.name}
              defaultChecked={box.checked}
              className="h-4 w-4 accent-[var(--neon-violet)]"
            />
            {box.label}
          </label>
        ))}
      </div>

      {message && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {message}
        </p>
      )}

      <div className="mt-5 flex gap-2">
        <Button type="submit" disabled={pending} className="rounded-full">
          {pending ? dict.panel.board.saving : dict.panel.board.save}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="rounded-full"
          onClick={() => setOpen(false)}
        >
          {dict.panel.board.cancel}
        </Button>
      </div>
    </form>
  );
}
