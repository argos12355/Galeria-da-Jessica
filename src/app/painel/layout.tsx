import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PanelNav } from "@/features/admin/PanelNav";
import { getArtistSession } from "@/server/auth";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

/**
 * Guarda de todas as rotas do painel. Sem sessão válida, ninguém passa daqui
 * — inclusive quando o Supabase não está configurado.
 */
export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const session = await getArtistSession();

  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <PanelNav email={session.email} />
      <div className="mt-8">{children}</div>
    </div>
  );
}
