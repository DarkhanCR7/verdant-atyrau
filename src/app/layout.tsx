import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

const siteUrl = process.env.NEXTAUTH_URL ?? "https://verdant-atyrau.kz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Verdant — клиника лазерной косметологии и омоложения в Атырау",
    template: "%s | Verdant",
  },
  description:
    "Verdant — клиника лазерной косметологии и омоложения в Атырау. Удаление новообразований, лазерные и аппаратные процедуры, консультации хирурга и косметолога. Онлайн-запись на приём.",
  keywords: [
    "косметология Атырау",
    "лазерная косметология Атырау",
    "удаление родинок Атырау",
    "удаление папиллом Атырау",
    "омоложение кожи Атырау",
    "Verdant",
  ],
  authors: [{ name: "Verdant" }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "Verdant",
    title: "Verdant — клиника лазерной косметологии и омоложения в Атырау",
    description:
      "Удаление новообразований, лазерные и аппаратные процедуры, консультации хирурга и косметолога. Онлайн-запись на приём.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- this IS the root layout (App Router), the correct place for global fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body className="bg-paper text-ink flex min-h-full flex-col">
        <a
          href="#main-content"
          className="focus:bg-deep sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-white"
        >
          Перейти к содержимому
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
