import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SaltoContenido } from "@/components/layout/salto-contenido";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import { fuenteTexto, fuenteTitular } from "./fuentes";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Grovelab",
    template: "%s — Grovelab",
  },
  description:
    "Productos formulados para el sector agrícola. Catálogo por cultivo y asesoría técnica.",
  openGraph: {
    locale: "es_PE",
    type: "website",
    siteName: "Grovelab",
  },
};

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html
      lang="es-PE"
      className={`${fuenteTitular.variable} ${fuenteTexto.variable}`}
    >
      <body className="relative flex min-h-screen flex-col bg-fondo font-texto text-texto antialiased">
        <SaltoContenido />
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
