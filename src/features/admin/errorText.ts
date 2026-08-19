import type { Dictionary } from "@/i18n/config";
import type { ActionError } from "@/server/actionState";

export function errorText(error: ActionError | null, dict: Dictionary): string | null {
  if (!error) return null;
  if (error === "unauthorized") return dict.panel.board.unauthorized;
  if (error === "limit_reached") return dict.panel.board.limitReached;
  if (error === "invalid_file") return dict.panel.artworks.invalidFile;
  if (error === "too_large") return dict.panel.artworks.tooLarge;
  if (error === "slug_taken") return dict.panel.artworks.slugTaken;
  if (error === "upload_failed") return dict.panel.artworks.uploadFailed;
  return dict.panel.board.genericError;
}
