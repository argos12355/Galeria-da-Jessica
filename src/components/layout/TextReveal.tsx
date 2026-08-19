import { cn } from "@/lib/utils";

/**
 * Entrada de texto em CSS puro.
 *
 * Substitui a versão com GSAP, que trazia 6,4 MB de biblioteca para este
 * único efeito. Sem "use client": é markup estático, roda no servidor.
 */
export function TextReveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  as?: "div" | "h1" | "h2" | "p";
  className?: string;
  delay?: number;
}) {
  return (
    <Tag
      className={cn("rise-in", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
