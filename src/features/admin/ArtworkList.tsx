"use client";

import Image from "next/image";
import { useActionState } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";

import { errorText } from "@/features/admin/errorText";
import { ArtworkUploadForm } from "@/features/admin/ArtworkUploadForm";
import { useI18n } from "@/i18n/I18nProvider";
import { localizedText } from "@/i18n/localized";
import { IDLE } from "@/server/actionState";
import { deleteArtworkAction, toggleArtworkPublishedAction } from "@/server/artworkActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryLabel } from "@/types/artwork";
import type { Artwork } from "@/types/artwork";

export function ArtworkList({ artworks }: { artworks: Artwork[] }) {
  const { dict } = useI18n();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="text-gradient-aurora">{dict.panel.artworks.title}</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{dict.panel.artworks.subtitle}</p>
      </header>

      <ArtworkUploadForm />

      {artworks.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {dict.panel.artworks.empty}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artworks.map((art) => (
            <ArtworkRow key={art.id} art={art} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArtworkRow({ art }: { art: Artwork }) {
  const { dict, locale } = useI18n();
  const [deleteState, deleteAction, deleting] = useActionState(deleteArtworkAction, IDLE);
  const [publishState, publishAction, publishing] = useActionState(
    toggleArtworkPublishedAction,
    IDLE,
  );

  const title = localizedText(art.title, locale);
  const message = errorText(deleteState.error ?? publishState.error, dict);

  return (
    <article className="glass overflow-hidden rounded-xl">
      <div className="relative aspect-[4/3]">
        <Image
          src={art.imageUrl}
          alt={title}
          fill
          sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {art.isMain && (
            <Badge className="border-none bg-[var(--neon-violet)] text-white">✦</Badge>
          )}
          {art.isNsfw && (
            <Badge className="border-none bg-black/70 text-white">{dict.nsfw.badge}</Badge>
          )}
          {!art.isPublished && (
            <Badge className="gap-1 border-none bg-amber-500/80 text-white">
              <EyeOff className="h-3 w-3" />
              {dict.panel.artworks.draft}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-2 p-3">
        <h3 className="truncate text-sm font-medium">{title}</h3>
        <Badge variant="outline" className="border-white/15 text-xs text-muted-foreground">
          {categoryLabel(art.category, dict)}
        </Badge>

        <div className="flex gap-2 pt-1">
          <form action={publishAction} className="flex-1">
            <input type="hidden" name="id" value={art.id} />
            <input type="hidden" name="publish" value={art.isPublished ? "0" : "1"} />
            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={publishing}
              className="w-full gap-1.5"
            >
              {art.isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {art.isPublished ? dict.panel.artworks.unpublish : dict.panel.artworks.publish}
            </Button>
          </form>

          <form
            action={deleteAction}
            onSubmit={(event) => {
              if (!window.confirm(dict.panel.board.confirmDelete)) event.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={art.id} />
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              disabled={deleting}
              aria-label={dict.panel.board.delete}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {message && (
          <p role="alert" className="text-xs text-destructive">
            {message}
          </p>
        )}
      </div>
    </article>
  );
}
