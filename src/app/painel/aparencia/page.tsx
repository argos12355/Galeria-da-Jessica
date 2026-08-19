import { redirect } from "next/navigation";

import { AppearanceForm } from "@/features/admin/AppearanceForm";
import { getArtistSession } from "@/server/auth";
import { getSiteSettings } from "@/server/settings";

export default async function PainelAparenciaPage() {
  const session = await getArtistSession();
  if (!session) redirect("/login");

  const settings = await getSiteSettings();

  return <AppearanceForm settings={settings} />;
}
