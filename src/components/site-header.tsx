import Image from "next/image";
import Link from "next/link";

import { MenuPrincipal } from "@/components/layout/menu-principal";
import { anchoContenedor } from "@/lib/clases-sitio";
import { hayCultivosPublicados } from "@/lib/hay-cultivos-publicados.ts";
import logoGrovelab from "@/images/grovelab-logo.png";

import estilos from "./site-header.module.css";

export async function SiteHeader() {
  const mostrarCultivos = await hayCultivosPublicados();

  return (
    <header
      className={`sticky top-0 z-40 ${estilos.cabecera}`}
      // Ancla de la transición entre páginas: la cabecera no se mueve al navegar.
      style={{ viewTransitionName: "cabecera-sitio" }}
    >
      <div className={estilos.fondo} aria-hidden="true" />
      <div
        className={`flex items-center justify-between gap-4 py-4 ${anchoContenedor} ${estilos.contenido}`}
      >
        <Link
          href="/"
          className={`focus-visible:rounded-sm ${estilos.logo}`}
          aria-label="Grovelab — Inicio"
        >
          <Image src={logoGrovelab} alt="Grovelab" className="h-9 w-auto" priority />
        </Link>
        <MenuPrincipal
          mostrarCultivos={mostrarCultivos}
          claseDesplazable={estilos.desplazable}
        />
      </div>
      <div className={estilos.bordeInferior} aria-hidden="true">
        <div className={estilos.progreso} />
      </div>
    </header>
  );
}
