"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import estilos from "./menu-principal.module.css";

export const enlacesNavegacion = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/cultivos", etiqueta: "Cultivos" },
  { href: "/productos", etiqueta: "Productos" },
  { href: "/nosotros", etiqueta: "Nosotros" },
  { href: "/servicios", etiqueta: "Servicios" },
  { href: "/zonas-comerciales", etiqueta: "Zonas" },
  { href: "/noticias", etiqueta: "Noticias" },
  { href: "/contacto", etiqueta: "Contacto" },
] as const;

function rutaActiva(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Layout en Tailwind; color e indicador «surco» en el módulo (un enfoque por efecto).
const claseEnlace = `min-h-11 inline-flex items-center focus-visible:rounded-sm ${estilos.enlace}`;

type MenuPrincipalProps = {
  /** Sin cultivos publicados, el enlace llevaría a una página vacía. */
  mostrarCultivos: boolean;
  /** Sin zonas publicadas, el enlace llevaría a un 404. */
  mostrarZonas: boolean;
  /**
   * Clase de la cabecera para subir los controles al compactarse. Se aplica a
   * la navegación de escritorio y al botón, nunca al contenedor del panel móvil:
   * un ancestro con transform encerraría al panel (position: fixed).
   */
  claseDesplazable?: string;
};

export function MenuPrincipal({
  mostrarCultivos,
  mostrarZonas,
  claseDesplazable = "",
}: MenuPrincipalProps) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const panelId = useId();
  const botonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const cerrar = useCallback(() => {
    setAbierto(false);
    botonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!abierto) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const primerEnlace = panelRef.current?.querySelector<HTMLAnchorElement>(
      "a[href]",
    );
    primerEnlace?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cerrar();
      }
      if (event.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );
        if (focusables.length === 0) {
          return;
        }
        const primero = focusables[0];
        const ultimo = focusables[focusables.length - 1];
        if (!primero || !ultimo) {
          return;
        }
        if (event.shiftKey && document.activeElement === primero) {
          event.preventDefault();
          ultimo.focus();
        } else if (!event.shiftKey && document.activeElement === ultimo) {
          event.preventDefault();
          primero.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [abierto, cerrar]);

  const enlaces = enlacesNavegacion.filter(
    (enlace) =>
      (enlace.href !== "/cultivos" || mostrarCultivos) &&
      (enlace.href !== "/zonas-comerciales" || mostrarZonas),
  );

  const lista = enlaces.map((enlace, indice) => {
    const activo = rutaActiva(pathname, enlace.href);
    return (
      <li
        key={enlace.href}
        className={estilos.itemMovil}
        // Índice para el escalonado de entrada del menú móvil.
        style={{ "--indice": indice } as CSSProperties}
      >
        <Link
          href={enlace.href}
          className={claseEnlace}
          aria-current={activo ? "page" : undefined}
          onClick={() => setAbierto(false)}
        >
          {enlace.etiqueta}
        </Link>
      </li>
    );
  });

  return (
    <>
      <nav
        className={`hidden min-[48rem]:block ${claseDesplazable}`}
        aria-label="Principal"
      >
        <ul
          className={`flex flex-wrap gap-x-4 gap-y-2 text-sm ${estilos.listaEscritorio}`}
        >
          {lista}
        </ul>
      </nav>

      <div className="min-[48rem]:hidden">
        <button
          ref={botonRef}
          type="button"
          className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-m border border-marca/25 px-3 text-sm font-medium text-marca ${claseDesplazable}`}
          aria-expanded={abierto}
          aria-controls={panelId}
          onClick={() => setAbierto((valor) => !valor)}
        >
          {abierto ? "Cerrar" : "Menú"}
        </button>

        {abierto ? (
          <div
            ref={panelRef}
            id={panelId}
            className={`fixed inset-0 z-50 flex flex-col bg-fondo ${estilos.panel}`}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="flex items-center justify-between border-b border-marca/15 px-4 py-4">
              <span className="font-titular text-lg text-marca">Menú</span>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-m border border-marca/25 px-3 text-sm font-medium"
                onClick={cerrar}
              >
                Cerrar
              </button>
            </div>
            <ul className="flex flex-col gap-1 px-4 py-6 text-base">{lista}</ul>
          </div>
        ) : null}
      </div>
    </>
  );
}
