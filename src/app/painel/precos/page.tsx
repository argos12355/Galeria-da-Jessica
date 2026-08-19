import { redirect } from "next/navigation";

import { TierManager } from "@/features/admin/TierManager";
import { getArtistSession } from "@/server/auth";
import { getCommissionTiers } from "@/server/commissions";

export default async function PainelPrecosPage() {
  const session = await getArtistSession();
  if (!session) redirect("/login");

  // Versão completa: inclui os pacotes ocultos do público.
  const tiers = await getCommissionTiers();

  return <TierManager tiers={tiers} />;
}
