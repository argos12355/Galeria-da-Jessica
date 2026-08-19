import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

import { CustomCursor } from "@/components/layout/CustomCursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/layout/PageTransition";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { HTML_LANG, LOCALE_COOKIE, resolveLocale } from "@/i18n/config";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getSiteSettings, themeStyle } from "@/server/settings";
import { SITE_NAME } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Ilustração Digital`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Galeria digital das ilustrações de personagens da artista Jessica — arte digital, anime e pintura em camadas.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  // Ler o cookie no servidor evita o flash de português antes da hidratação.
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);

  // Só decide o rótulo do link no rodapé. Cookie presente NÃO prova sessão
  // válida — a proteção real é o getUser() no layout do /painel. Checar aqui
  // por cookie em vez de validar evita uma ida ao servidor de auth em toda
  // página pública.
  const maybeSignedIn = cookieStore.getAll().some((c) => c.name.includes("-auth-token"));

  const settings = await getSiteSettings();

  return (
    <html
      lang={HTML_LANG[locale]}
      // Inline vence a classe .dark do globals.css sem precisar de !important.
      style={themeStyle(settings)}
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <I18nProvider initialLocale={locale}>
          <SmoothScrollProvider>
            <CustomCursor />
            <Header siteTitle={settings.siteTitle} />
            <main className="flex-1 pt-16">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer siteTitle={settings.siteTitle} maybeSignedIn={maybeSignedIn} />
          </SmoothScrollProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
