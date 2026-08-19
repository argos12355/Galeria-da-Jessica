export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/**
 * A Supabase renomeou a "anon key" para "publishable key". Aceitamos os dois
 * nomes para que qualquer valor copiado do painel funcione.
 *
 * Os dois acessos precisam ser literais: o Next substitui `process.env.X` no
 * build por texto, e não resolve nome montado dinamicamente.
 */
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

/**
 * Sem credenciais não existe sessão possível. Tudo que protege o painel
 * consulta isto e trata "não configurado" como "não autenticado" — falha
 * fechada. O painel nunca abre por falta de configuração.
 */
export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}
