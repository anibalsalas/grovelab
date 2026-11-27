"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import institucional from "@/styles/institucional.module.css";

type RevelarAlScrollProps = {
  children: ReactNode;
  className?: string;
};

function nodoEnViewport(nodo: HTMLElement): boolean {
  const rect = nodo.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

export function RevelarAlScroll({ children, className }: RevelarAlScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [animar, setAnimar] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) {
      return;
    }

    const preferencia = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preferencia.matches) {
      return;
    }

    if (nodoEnViewport(nodo)) {
      return;
    }

    setAnimar(true);

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  const clases = [
    institucional.revelarContenedor,
    animar ? institucional.revelarEntrada : "",
    visible ? institucional.revelarVisible : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={clases}>
      {children}
    </div>
  );
}
