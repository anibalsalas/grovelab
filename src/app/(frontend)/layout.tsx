import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Grovelab",
  description:
    "Sitio web en construcción. Pronto encontrarás el catálogo de productos para el agro.",
};

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="es-PE">
      <body>{children}</body>
    </html>
  );
}
