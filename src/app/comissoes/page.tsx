import type { Metadata } from "next";

import { CommissionsView } from "@/features/commissions/CommissionsView";
import { getCommissionSettings, getPublicCommissionTiers, getSlotState } from "@/server/commissions";

export const metadata: Metadata = {
  title: "Comissões",
  description:
    "Preços, estilos e vagas disponíveis para comissões com a artista Jessica.",
};

export default async function ComissoesPage() {
  const [slots, settings, tiers] = await Promise.all([
    getSlotState(),
    getCommissionSettings(),
    getPublicCommissionTiers(),
  ]);

  return <CommissionsView slots={slots} settings={settings} tiers={tiers} />;
}
