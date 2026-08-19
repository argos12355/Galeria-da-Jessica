import { redirect } from "next/navigation";

import { ArtworkList } from "@/features/admin/ArtworkList";
import { getArtworks } from "@/server/artworks";
import { getArtistSession } from "@/server/auth";

export default async function PainelObrasPage() {
  const session = await getArtistSession();
  if (!session) redirect("/login");

  // Logada, a policy de RLS devolve também as não publicadas.
  const artworks = await getArtworks();

  return <ArtworkList artworks={artworks} />;
}
