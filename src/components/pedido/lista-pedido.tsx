"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";

import {
  consultarProductosPedido,
  type ProductoPedido,
  type ResultadoEnvio,
} from "@/app/(frontend)/pedido/actions";
import { BotonEnlace } from "@/components/ui/boton-enlace";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import {
  CANTIDAD_MAXIMA,
  CANTIDAD_MINIMA,
  type FilaPedido,
} from "@/lib/pedido/esquema.ts";
import { usePedido } from "@/lib/pedido/usar-pedido.ts";

import { FormularioEnvio, type OpcionLista } from "./formulario-envio";
import estilos from "./pedido.module.css";

/** `false` en el servidor y durante la hidratación; evita mostrar «vacío» antes de leer el pedido guardado. */
function useMontado(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type FilaEditableProps = {
  fila: FilaPedido;
  nombre: string | null;
  onCantidad: (cantidad: number) => void;
  onQuitar: () => void;
};

function FilaEditable({ fila, nombre, onCantidad, onQuitar }: FilaEditableProps) {
  const idCantidad = useId();
  // `null` = no se está editando: el campo muestra la cantidad real, así sigue
  // los cambios que vengan de otra pestaña o de los botones − y + sin efectos.
  const [borrador, setBorrador] = useState<string | null>(null);
  const titulo = nombre ?? "Producto";

  function confirmar() {
    const valor = Number.parseInt(borrador ?? "", 10);
    setBorrador(null);
    if (!Number.isFinite(valor) || valor < CANTIDAD_MINIMA) {
      return;
    }
    const acotado = Math.min(CANTIDAD_MAXIMA, valor);
    if (acotado !== fila.cantidad) {
      onCantidad(acotado);
    }
  }

  function alTeclear(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key === "Enter") {
      evento.preventDefault();
      confirmar();
    }
  }

  return (
    <li className="grid gap-3 border-b border-marca/15 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6">
      <div className="min-w-0">
        {nombre ? (
          <Link
            href={`/productos/${fila.slug}`}
            className="font-titular text-lg text-marca underline-offset-4 hover:underline"
          >
            {nombre}
          </Link>
        ) : (
          <span className="font-titular text-lg text-marca">{titulo}</span>
        )}
        <p className="mt-1 text-sm text-texto/80">{fila.presentacion}</p>
      </div>

      <div>
        <label htmlFor={idCantidad} className="sr-only">
          Cantidad de {titulo}, {fila.presentacion}
        </label>
        <div className={estilos.cantidad}>
          <button
            type="button"
            className={estilos.pasoCantidad}
            aria-label={`Disminuir cantidad de ${titulo}, ${fila.presentacion}`}
            disabled={fila.cantidad <= CANTIDAD_MINIMA}
            onClick={() => onCantidad(fila.cantidad - 1)}
          >
            −
          </button>
          <input
            id={idCantidad}
            className={estilos.campoCantidad}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={borrador ?? String(fila.cantidad)}
            onChange={(e) =>
              setBorrador(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            onBlur={confirmar}
            onKeyDown={alTeclear}
          />
          <button
            type="button"
            className={estilos.pasoCantidad}
            aria-label={`Aumentar cantidad de ${titulo}, ${fila.presentacion}`}
            disabled={fila.cantidad >= CANTIDAD_MAXIMA}
            onClick={() => onCantidad(fila.cantidad + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div>
        <button
          type="button"
          className={estilos.accionTexto}
          aria-label={`Quitar ${titulo}, ${fila.presentacion}, del pedido`}
          onClick={onQuitar}
        >
          Quitar
        </button>
      </div>
    </li>
  );
}

type ListaPedidoProps = {
  zonas: readonly OpcionLista[];
  cultivos: readonly OpcionLista[];
  conPolitica: boolean;
};

export function ListaPedido({ zonas, cultivos, conPolitica }: ListaPedidoProps) {
  const montado = useMontado();
  const { filas, quitar, cambiarCantidad, vaciar } = usePedido();
  const [enviado, setEnviado] = useState<{
    url: string | null;
    numero: number | null;
  } | null>(null);

  function alResultadoEnvio(resultado: ResultadoEnvio) {
    if (resultado.ok) {
      // La lista local solo se vacía tras una respuesta correcta del servidor.
      vaciar();
      setEnviado({ url: resultado.url, numero: resultado.numero });
      if (resultado.url) {
        window.location.assign(resultado.url);
      }
      return;
    }
    if (resultado.productosNoDisponibles) {
      const motivos: string[] = [];
      for (const item of resultado.productosNoDisponibles) {
        quitar(item.slug, item.presentacion);
        motivos.push(item.motivo);
      }
      setAvisos((previos) => [...new Set([...previos, ...motivos])]);
    }
  }
  const [productos, setProductos] = useState<Map<string, ProductoPedido> | null>(
    null,
  );
  const [avisos, setAvisos] = useState<string[]>([]);
  const [confirmandoVaciar, setConfirmandoVaciar] = useState(false);

  const claveSlugs = [...new Set(filas.map((f) => f.slug))].sort().join("|");

  // Vuelve a leer en el servidor los productos del pedido y retira lo que ya no se puede pedir.
  useEffect(() => {
    if (!montado || claveSlugs === "") {
      return;
    }
    let vigente = true;
    consultarProductosPedido(claveSlugs.split("|"))
      .then((lista) => {
        if (!vigente) {
          return;
        }
        const mapa = new Map(lista.map((p) => [p.slug, p]));
        setProductos(mapa);

        const nuevosAvisos: string[] = [];
        for (const fila of filas) {
          const producto = mapa.get(fila.slug);
          if (!producto) {
            nuevosAvisos.push(
              "Un producto de tu pedido ya no está disponible y lo quitamos.",
            );
            quitar(fila.slug, fila.presentacion);
          } else if (!producto.presentaciones.includes(fila.presentacion)) {
            nuevosAvisos.push(
              `La presentación ${fila.presentacion} de ${producto.nombre} ya no está disponible y la quitamos de tu pedido.`,
            );
            quitar(fila.slug, fila.presentacion);
          }
        }
        if (nuevosAvisos.length > 0) {
          setAvisos((previos) => [...new Set([...previos, ...nuevosAvisos])]);
        }
      })
      .catch(() => {
        // Sin conexión: se muestra la lista guardada, con el nombre genérico.
      });
    return () => {
      vigente = false;
    };
    // `filas` y `quitar` se leen al resolver; la clave de slugs decide cuándo reconsultar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [montado, claveSlugs]);

  if (!montado) {
    return (
      <p role="status" className="text-texto/80">
        Cargando tu pedido…
      </p>
    );
  }

  const bloqueAvisos =
    avisos.length > 0 ? (
      <div role="status" className={estilos.bloqueAvisos}>
        <ul className="grid gap-1">
          {avisos.map((aviso) => (
            <li key={aviso}>{aviso}</li>
          ))}
        </ul>
        <button
          type="button"
          className={estilos.accionTexto}
          onClick={() => setAvisos([])}
        >
          Entendido
        </button>
      </div>
    ) : null;

  if (enviado) {
    return (
      <div role="status" className={estilos.exito}>
        <h2 className="font-titular text-xl text-marca">
          Listo. Te llevamos a WhatsApp…
        </h2>
        {enviado.numero !== null ? (
          <p>Tu pedido es el N.º {String(enviado.numero).padStart(4, "0")}.</p>
        ) : null}
        {enviado.url ? (
          <p className="text-sm text-texto/85">
            Si WhatsApp no se abrió, usa el botón de abajo. Tu pedido ya está
            armado en el mensaje.
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          {enviado.url ? (
            <a
              href={enviado.url}
              className="inline-flex min-h-11 items-center rounded-m bg-marca px-5 py-2 text-fondo shadow-s hover:bg-marca/90 focus-visible:rounded-m"
            >
              Abrir WhatsApp otra vez
            </a>
          ) : null}
          <BotonEnlace href="/productos" variante="secundario">
            Seguir viendo productos
          </BotonEnlace>
        </div>
      </div>
    );
  }

  if (filas.length === 0) {
    return (
      <>
        {bloqueAvisos}
        <EstadoVacio
          titulo="Tu pedido está vacío"
          mensaje="Elige un producto, indica la presentación y la cantidad, y agrégalo a tu pedido."
          enlace={{ href: "/productos", etiqueta: "Ver productos" }}
        />
      </>
    );
  }

  return (
    <div>
      {bloqueAvisos}

      <ul aria-label="Productos de mi pedido" className="border-t border-marca/15">
        {filas.map((fila) => (
          <FilaEditable
            key={`${fila.slug}|${fila.presentacion}`}
            fila={fila}
            nombre={productos?.get(fila.slug)?.nombre ?? null}
            onCantidad={(cantidad) =>
              cambiarCantidad(fila.slug, fila.presentacion, cantidad)
            }
            onQuitar={() => quitar(fila.slug, fila.presentacion)}
          />
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {confirmandoVaciar ? (
          <div role="group" aria-label="Confirmar vaciar el pedido" className="flex flex-wrap items-center gap-3">
            <p className="text-sm">¿Quitar todos los productos del pedido?</p>
            <BotonEnlace
              type="button"
              variante="secundario"
              onClick={() => {
                vaciar();
                setConfirmandoVaciar(false);
              }}
            >
              Sí, vaciar
            </BotonEnlace>
            <button
              type="button"
              className={estilos.accionTexto}
              onClick={() => setConfirmandoVaciar(false)}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={estilos.accionTexto}
            onClick={() => setConfirmandoVaciar(true)}
          >
            Vaciar pedido
          </button>
        )}
      </div>

      <FormularioEnvio
        filas={filas}
        zonas={zonas}
        cultivos={cultivos}
        conPolitica={conPolitica}
        onResultado={alResultadoEnvio}
      />
    </div>
  );
}
