import { cache } from "react";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ArtistSession {
  userId: string;
  email: string;
}

/**
 * Fonte única de "está logada?". Devolve null sempre que houver qualquer
 * dúvida — inclusive quando o Supabase nem está configurado.
 *
 * cache() dedupe a chamada dentro da mesma request: layout e página podem
 * verificar a sessão sem bater duas vezes no servidor de auth.
 */
export const getArtistSession = cache(async (): Promise<ArtistSession | null> => {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();

  // getUser() valida o token no servidor de auth. getSession() só lê o
  // cookie, que o cliente pode forjar — nunca use getSession() para proteger.
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user?.email) return null;

  return { userId: data.user.id, email: data.user.email };
});
