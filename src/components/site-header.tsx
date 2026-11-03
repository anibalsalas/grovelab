import Link from "next/link";

import { MenuPrincipal } from "@/components/layout/menu-principal";
import { anchoContenedor } from "@/lib/clases-sitio";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-marca/15 bg-fondo/95 shadow-s backdrop-blur-sm supports-[backdrop-filter]:bg-fondo/85">
      <div
        className={`relative flex items-center justify-between gap-4 py-4 ${anchoContenedor}`}
      >
        <Link
          href="/"
          className="font-titular text-xl text-marca focus-visible:rounded-sm"
        >
          Grovelab
        </Link>
        <MenuPrincipal />
      </div>
    </header>
  );
}
