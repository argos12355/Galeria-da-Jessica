import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Renova o token de sessão a cada request.
 *
 * O access token do Supabase dura cerca de uma hora. Server Components não
 * podem gravar cookies, então sem este middleware o token vence e a artista é
 * deslogada no meio do trabalho — perdendo o que estava editando.
 */
export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // É esta chamada que dispara a renovação e grava o cookie novo na resposta.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Tudo menos assets estáticos — não faz sentido renovar sessão ao servir imagem.
    "/((?!_next/static|_next/image|favicon.ico|imagem|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
