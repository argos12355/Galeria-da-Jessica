import { redirect } from "next/navigation";

import { CommissionBoard } from "@/features/admin/CommissionBoard";
import { getCommissions } from "@/server/adminData";
import { getArtistSession } from "@/server/auth";
import { getCommissionTiers, getSlotState } from "@/server/commissions";

export default async function PainelComissoesPage() {
  const session = await getArtistSession();
  if (!session) redirect("/login");

  const [commissions, tiers, slots] = await Promise.all([
    getCommissions(),
    getCommissionTiers(),
    getSlotState(),
  ]);

  return <CommissionBoard commissions={commissions} tiers={tiers} slots={slots} />;
}
