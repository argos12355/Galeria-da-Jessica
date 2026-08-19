"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getArtistSession } from "./auth";
import { isCategory } from "@/types/artwork";
import type { ActionState } from "./actionState";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

/** Acentos fora, espaços viram hífen: o slug entra na URL da obra. */
function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function localizedPair(pt: string, en: string): Record<string, string> {
  // Inglês em branco não vira chave: o fallback do i18n cuida disso.
  return en.trim() ? { pt, en: en.trim() } : { pt };
}

export async function createArtworkAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getArtistSession())) return { error: "unauthorized", ok: false };

  const titlePt = String(formData.get("titlePt") ?? "").trim();
  const file = formData.get("image");

  if (!titlePt || !(file instanceof File) || file.size === 0) {
    return { error: "invalid", ok: false };
  }
  if (!ALLOWED_TYPES.includes(file.type)) return { error: "invalid_file", ok: false };
  if (file.size > MAX_BYTES) return { error: "too_large", ok: false };

  const category = String(formData.get("category") ?? "");
  if (!isCategory(category)) return { error: "invalid", ok: false };

  const slug = slugify(titlePt);
  if (!slug) return { error: "invalid", ok: false };

  const supabase = await createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("artworks")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) return { error: "slug_taken", ok: false };

  // Timestamp no nome evita colisão se a obra for reenviada depois.
  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${slug}-${Date.now()}.${extension}`;

  const upload = await supabase.storage.from("artworks").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (upload.error) return { error: "upload_failed", ok: false };

  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const isMain = formData.get("isMain") === "on";

  // Índice único garante uma principal só; limpar antes evita o erro.
  if (isMain) {
    await supabase.from("artworks").update({ is_main: false }).eq("is_main", true);
  }

  const { error } = await supabase.from("artworks").insert({
    slug,
    title: localizedPair(titlePt, String(formData.get("titleEn") ?? "")),
    description: localizedPair(
      String(formData.get("descriptionPt") ?? "").trim(),
      String(formData.get("descriptionEn") ?? ""),
    ),
    content: localizedPair(
      String(formData.get("contentPt") ?? "").trim(),
      String(formData.get("contentEn") ?? ""),
    ),
    technique: localizedPair(
      String(formData.get("techniquePt") ?? "").trim(),
      String(formData.get("techniqueEn") ?? ""),
    ),
    category,
    tags,
    image_path: path,
    is_nsfw: formData.get("isNsfw") === "on",
    is_featured: formData.get("isFeatured") === "on",
    is_main: isMain,
    is_published: formData.get("isPublished") === "on",
    published_at: new Date().toISOString(),
  });

  if (error) {
    // Não deixa imagem órfã no bucket se a linha não entrou.
    await supabase.storage.from("artworks").remove([path]);
    return { error: "failed", ok: false };
  }

  revalidateArtworkViews();
  return { error: null, ok: true };
}

export async function deleteArtworkAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getArtistSession())) return { error: "unauthorized", ok: false };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "invalid", ok: false };

  const supabase = await createSupabaseServerClient();

  const { data: row } = await supabase
    .from("artworks")
    .select("image_path")
    .eq("id", id)
    .maybeSingle<{ image_path: string }>();

  const { error } = await supabase.from("artworks").delete().eq("id", id);
  if (error) return { error: "failed", ok: false };

  // Só apaga do Storage o que veio de upload; "/imagem/..." é arquivo do repo.
  if (row?.image_path && !row.image_path.startsWith("/")) {
    await supabase.storage.from("artworks").remove([row.image_path]);
  }

  revalidateArtworkViews();
  return { error: null, ok: true };
}

export async function toggleArtworkPublishedAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getArtistSession())) return { error: "unauthorized", ok: false };

  const id = String(formData.get("id") ?? "");
  const publish = formData.get("publish") === "1";
  if (!id) return { error: "invalid", ok: false };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("artworks")
    .update({ is_published: publish })
    .eq("id", id);

  if (error) return { error: "failed", ok: false };

  revalidateArtworkViews();
  return { error: null, ok: true };
}

function revalidateArtworkViews(): void {
  revalidatePath("/");
  revalidatePath("/galeria");
  revalidatePath("/favoritos");
  revalidatePath("/painel/obras");
}
