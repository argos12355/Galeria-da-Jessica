#!/usr/bin/env node
/**
 * Diagnóstico da ligação com o Supabase.
 *   node scripts/check-supabase.mjs
 *
 * Usa só a anon key — é exatamente o que o navegador enxerga. Se um teste de
 * leitura passar aqui, ele passa para qualquer visitante do site.
 */
import { existsSync, readFileSync } from "node:fs";

import { createClient } from "@supabase/supabase-js";

const PASS = "✓";
const FAIL = "✗";

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const values = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (match) values[match[1]] = match[2].trim();
  }
  return values;
}

const env = { ...loadEnvFile(".env.local"), ...process.env };
const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey =
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

if (!url || !anonKey) {
  console.log(`${FAIL} .env.local incompleto.`);
  console.log("   Preencha NEXT_PUBLIC_SUPABASE_URL e a chave pública");
  console.log("   (NEXT_PUBLIC_SUPABASE_ANON_KEY ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).");
  console.log("   Supabase Studio > botão Connect");
  process.exit(1);
}

// A interface nova do Supabase chama de "secret key" (sb_secret_...); a
// antiga, de service_role. As duas ignoram o RLS e não podem ir ao navegador.
if (anonKey.includes("service_role") || anonKey.startsWith("sb_secret_")) {
  console.log(`${FAIL} Isso é uma chave secreta. Use a "anon public" / "Publishable key".`);
  console.log("   A chave secreta ignora todo o RLS e nunca pode ir para o navegador.");
  process.exit(1);
}

console.log(`${PASS} Credenciais encontradas (${new URL(url).host})\n`);

const supabase = createClient(url, anonKey);
let failures = 0;

function report(ok, label, detail) {
  console.log(`${ok ? PASS : FAIL} ${label}`);
  if (detail) console.log(`   ${detail}`);
  if (!ok) failures += 1;
}

// 0. Cadastro publico aberto + policies de escrita = qualquer visitante vira
//    administrador. E o furo mais grave possivel aqui, entao vem primeiro.
const authSettings = await fetch(url + "/auth/v1/settings", { headers: { apikey: anonKey } })
  .then((response) => response.json())
  .catch(() => null);

if (authSettings) {
  report(
    authSettings.disable_signup === true,
    "Cadastro publico desativado",
    authSettings.disable_signup === true
      ? "so a conta da artista existe"
      : "ABERTO: qualquer pessoa pode criar conta. Desligue em Authentication > Sign In / Providers e rode db/lockdown.sql.",
  );
}

// 1. O schema foi aplicado? A função de vagas é o melhor canário: só existe
//    se db/schema.sql rodou até o fim.
const slots = await supabase.rpc("public_slot_status").single();
const schemaOk = !slots.error && Boolean(slots.data);
report(
  schemaOk,
  "Schema aplicado (public_slot_status)",
  slots.error
    ? `${slots.error.message} — rode db/schema.sql no SQL Editor.`
    : `${slots.data.used_slots}/${slots.data.max_slots} vagas, modo "${slots.data.mode}"`,
);

// 2. Leitura pública das obras.
const artworks = await supabase.from("artworks").select("slug").limit(5);
report(
  !artworks.error,
  "Obras legíveis pelo público",
  artworks.error ? artworks.error.message : `${artworks.data.length} obra(s) publicada(s)`,
);

// 3. Tabela de preços.
const tiers = await supabase.from("commission_tiers").select("id").limit(10);
report(
  !tiers.error,
  "Tabela de preços legível",
  tiers.error
    ? tiers.error.message
    : tiers.data.length === 0
      ? "0 tiers — rode db/seed.sql para popular"
      : `${tiers.data.length} tier(s)`,
);

// 4. O teste que mais importa: dados de cliente NÃO podem vazar.
//    Só vale se o schema existir — tabela ausente também "não devolve linha",
//    e tratar isso como aprovado seria um falso positivo de segurança.
if (!schemaOk) {
  console.log("· Comissões protegidas do público");
  console.log("   não testável ainda — aplique o schema e rode de novo");
} else {
  const leak = await supabase.from("commissions").select("client_name").limit(1);
  const isProtected = !leak.error && leak.data.length === 0;
  report(
    isProtected,
    "Comissões protegidas do público",
    leak.error
      ? `resposta inesperada: ${leak.error.message}`
      : isProtected
        ? "a chave pública não recebe nenhuma linha (reteste depois de cadastrar uma comissão)"
        : "VAZAMENTO: a chave pública leu nome de cliente. Revise as policies de RLS.",
  );
}

console.log(
  failures === 0
    ? `\n${PASS} Tudo certo. Reinicie o servidor e entre em /login.`
    : `\n${FAIL} ${failures} verificação(ões) falharam.`,
);

process.exit(failures === 0 ? 0 : 1);
