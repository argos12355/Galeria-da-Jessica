import { redirect } from "next/navigation";

import { PanelHome } from "@/features/admin/PanelHome";
import { getArtistSession } from "@/server/auth";
import { getCommissionSettings, getSlotState } from "@/server/commissions";

export default async function PainelPage() {
  // O layout já barra, mas repetir aqui evita que uma refatoração no layout
  // exponha a página sem ninguém perceber.
  const session = await getArtistSession();
  if (!session) redirect("/login");

  const [slots, settings] = await Promise.all([getSlotState(), getCommissionSettings()]);

  return <PanelHome slots={slots} settings={settings} />;
}
