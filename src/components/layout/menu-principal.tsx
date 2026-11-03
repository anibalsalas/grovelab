"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export const enlacesNavegacion = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/cultivos", etiqueta: "Cultivos" },
  { href: "/productos", etiqueta: "Productos" },
  { href: "/buscar", etiqueta: "Buscar" },
  { href: "/nosotros", etiqueta: "Nosotros" },
  { href: "/servicios", etiqueta: "Servicios" },
  { href: "/noticias", etiqueta: "Noticias" },
  { href: "/contacto", etiqueta: "Contacto" },
] as const;

function rutaActiva(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

const claseEnlace =
  "min-h-11 inline-flex items-center text-texto underline-offset-4 hover:text-marca hover:underline focus-visible:rounded-sm";

export function MenuPrincipal() {
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

  const lista = enlacesNavegacion.map((enlace) => {
    const activo = rutaActiva(pathname, enlace.href);
    return (
      <li key={enlace.href}>
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
        className="hidden min-[48rem]:block"
        aria-label="Principal"
      >
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">{lista}</ul>
      </nav>

      <div className="min-[48rem]:hidden">
        <button
          ref={botonRef}
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-m border border-marca/25 px-3 text-sm font-medium text-marca"
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
            className="fixed inset-0 z-50 flex flex-col bg-fondo"
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
