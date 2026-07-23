import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="aurora-bg noise-overlay relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <Sparkles className="mb-6 h-10 w-10 text-[var(--neon-cyan)]" />
      <p className="text-sm font-medium tracking-widest text-muted-foreground">ERRO 404</p>
      <h1 className="text-gradient-aurora mt-2 text-7xl font-semibold tracking-tight sm:text-8xl">
        Obra não encontrada
      </h1>
      <p className="mt-6 max-w-md text-muted-foreground">
        A página que você procura pode ter sido movida, renomeada ou nunca existiu nesta galeria.
      </p>
      <Button className="glow-violet mt-10 rounded-full" render={<Link href="/" />}>
        <Compass className="mr-2 h-4 w-4" /> Voltar para a home
      </Button>
    </div>
  );
}
