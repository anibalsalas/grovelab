import { describe, expect, it } from "vitest";

import {
  CLAVE_ALMACEN,
  agregarFila,
  cambiarCantidad,
  consolidarFilas,
  guardarFilas,
  leerFilas,
  quitarFila,
  totalProductos,
  type AlmacenSimple,
} from "./almacen-local.ts";
import { resolverDestino, urlWhatsapp } from "./destino.ts";
import {
  CANTIDAD_MAXIMA,
  LIMITE_FILAS,
  esquemaEnvioConDatos,
  esquemaEnvioSinDatos,
  type FilaPedido,
} from "./esquema.ts";
import { construirMensaje } from "./mensaje-whatsapp.ts";
import { normalizarWhatsapp } from "./normalizar-whatsapp.ts";

function crearAlmacen(inicial?: string): AlmacenSimple & { valor: string | null } {
  const almacen = {
    valor: inicial ?? null,
    getItem: () => almacen.valor,
    setItem: (_clave: string, valor: string) => {
      almacen.valor = valor;
    },
    removeItem: () => {
      almacen.valor = null;
    },
  };
  return almacen;
}

const koala: FilaPedido = { slug: "koala", presentacion: "1 L", cantidad: 2 };
const pk65: FilaPedido = { slug: "pk-65", presentacion: "1 L", cantidad: 10 };

describe("normalizarWhatsapp", () => {
  it("completa el 51 en un celular peruano de 9 dígitos", () => {
    expect(normalizarWhatsapp("987 524 473")).toBe("51987524473");
  });

  it("acepta +51, espacios y guiones", () => {
    expect(normalizarWhatsapp("+51 987-524-473")).toBe("51987524473");
    expect(normalizarWhatsapp("0051987524473")).toBe("51987524473");
  });

  it("rechaza vacío, texto y longitudes fuera de rango", () => {
    expect(normalizarWhatsapp("")).toBeNull();
    expect(normalizarWhatsapp(null)).toBeNull();
    expect(normalizarWhatsapp("sin número")).toBeNull();
    expect(normalizarWhatsapp("12345678")).toBeNull();
    expect(normalizarWhatsapp("1".repeat(16))).toBeNull();
  });
});

describe("almacén local", () => {
  it("guarda y lee el pedido", () => {
    const almacen = crearAlmacen();
    expect(guardarFilas(almacen, [koala])).toBe(true);
    expect(leerFilas(almacen)).toEqual([koala]);
  });

  it("vaciar borra la clave", () => {
    const almacen = crearAlmacen();
    guardarFilas(almacen, [koala]);
    guardarFilas(almacen, []);
    expect(almacen.valor).toBeNull();
    expect(leerFilas(almacen)).toEqual([]);
  });

  it("descarta en silencio JSON roto, versión vieja o datos fuera de rango", () => {
    expect(leerFilas(crearAlmacen("{no es json"))).toEqual([]);
    expect(
      leerFilas(crearAlmacen(JSON.stringify({ version: 0, filas: [koala] }))),
    ).toEqual([]);
    expect(
      leerFilas(
        crearAlmacen(
          JSON.stringify({
            version: 1,
            filas: [{ ...koala, cantidad: 0 }],
          }),
        ),
      ),
    ).toEqual([]);
    expect(
      leerFilas(
        crearAlmacen(
          JSON.stringify({
            version: 1,
            filas: [{ slug: "<script>", presentacion: "1 L", cantidad: 1 }],
          }),
        ),
      ),
    ).toEqual([]);
  });

  it("no revienta si el almacenamiento lanza", () => {
    const roto: AlmacenSimple = {
      getItem: () => {
        throw new Error("bloqueado");
      },
      setItem: () => {
        throw new Error("cuota");
      },
      removeItem: () => {
        throw new Error("bloqueado");
      },
    };
    expect(leerFilas(roto)).toEqual([]);
    expect(guardarFilas(roto, [koala])).toBe(false);
  });

  it("usa la clave versionada", () => {
    expect(CLAVE_ALMACEN).toBe("grovelab.pedido.v1");
  });
});

describe("operaciones sobre las filas", () => {
  it("suma la misma combinación producto + presentación en vez de duplicar", () => {
    const { filas, resultado } = agregarFila([koala], { ...koala, cantidad: 3 });
    expect(resultado).toBe("agregado");
    expect(filas).toEqual([{ ...koala, cantidad: 5 }]);
  });

  it("trata presentaciones distintas como filas distintas", () => {
    const { filas } = agregarFila([koala], { ...koala, presentacion: "20 L" });
    expect(filas).toHaveLength(2);
  });

  it("limita la cantidad máxima al sumar", () => {
    const { filas } = agregarFila([{ ...koala, cantidad: CANTIDAD_MAXIMA }], koala);
    expect(filas[0]?.cantidad).toBe(CANTIDAD_MAXIMA);
  });

  it("rechaza filas inválidas sin tocar el pedido", () => {
    const original = [koala];
    const { filas, resultado } = agregarFila(original, { ...koala, cantidad: 0 });
    expect(resultado).toBe("invalido");
    expect(filas).toEqual(original);
  });

  it("no pasa de 20 filas, pero sí deja sumar a una existente", () => {
    const llenas: FilaPedido[] = Array.from({ length: LIMITE_FILAS }, (_, i) => ({
      slug: `producto-${i}`,
      presentacion: "1 L",
      cantidad: 1,
    }));
    expect(agregarFila(llenas, koala).resultado).toBe("lleno");
    const suma = agregarFila(llenas, { ...llenas[0]!, cantidad: 4 });
    expect(suma.resultado).toBe("agregado");
    expect(suma.filas).toHaveLength(LIMITE_FILAS);
    expect(suma.filas[0]?.cantidad).toBe(5);
  });

  it("consolida duplicados que vengan de un almacén viejo", () => {
    expect(consolidarFilas([koala, koala, pk65])).toEqual([
      { ...koala, cantidad: 4 },
      pk65,
    ]);
  });

  it("quita y cambia cantidades sin mutar la entrada", () => {
    const original = [koala, pk65];
    expect(quitarFila(original, "koala", "1 L")).toEqual([pk65]);
    expect(cambiarCantidad(original, "koala", "1 L", 7)[0]?.cantidad).toBe(7);
    expect(original[0]?.cantidad).toBe(2);
  });

  it("ajusta cantidades fuera de rango e ignora valores no numéricos", () => {
    expect(cambiarCantidad([koala], "koala", "1 L", 0)[0]?.cantidad).toBe(1);
    expect(cambiarCantidad([koala], "koala", "1 L", 99999)[0]?.cantidad).toBe(
      CANTIDAD_MAXIMA,
    );
    expect(cambiarCantidad([koala], "koala", "1 L", 3.9)[0]?.cantidad).toBe(3);
    expect(cambiarCantidad([koala], "koala", "1 L", Number.NaN)[0]?.cantidad).toBe(2);
  });

  it("el contador cuenta productos distintos", () => {
    expect(totalProductos([koala, pk65])).toBe(2);
  });
});

describe("resolverDestino", () => {
  it("usa la zona solo si el número está autorizado", () => {
    expect(
      resolverDestino({
        zona: { whatsapp: "987 111 222", numeroAutorizado: true },
        numeroGeneral: "987524473",
      }),
    ).toEqual({ tipo: "zona", digitos: "51987111222" });
    expect(
      resolverDestino({
        zona: { whatsapp: "987 111 222", numeroAutorizado: false },
        numeroGeneral: "987524473",
      }),
    ).toEqual({ tipo: "general", digitos: "51987524473" });
  });

  it("cae al general si el número de la zona no es válido", () => {
    expect(
      resolverDestino({
        zona: { whatsapp: "123", numeroAutorizado: true },
        numeroGeneral: "987524473",
      }),
    ).toEqual({ tipo: "general", digitos: "51987524473" });
  });

  it("devuelve null si no hay ningún destino", () => {
    expect(resolverDestino({})).toBeNull();
    expect(resolverDestino({ numeroGeneral: "  " })).toBeNull();
  });
});

describe("mensaje de WhatsApp", () => {
  it("arma el pedido completo", () => {
    const mensaje = construirMensaje({
      numeroPedido: 123,
      items: [
        { nombre: "KOALA", presentacion: "1 L", cantidad: 2 },
        { nombre: "NOT FLY", presentacion: "A consultar con el asesor", cantidad: 1 },
      ],
      nombre: "Rosa",
      zona: "Costa norte",
      ciudad: "Piura",
      cultivo: "Palto",
      hectareas: 12,
    });
    expect(mensaje).toBe(
      [
        "Hola, quiero cotizar este pedido (N.º 0123):",
        "• KOALA — 1 L × 2",
        "• NOT FLY — A consultar con el asesor × 1",
        "Nombre: Rosa",
        "Zona: Costa norte · Ciudad: Piura",
        "Cultivo: Palto · 12 ha",
      ].join("\n"),
    );
  });

  it("omite lo que no se pidió ni se guardó", () => {
    const mensaje = construirMensaje({
      items: [{ nombre: "PK 65", presentacion: "1 L", cantidad: 10 }],
    });
    expect(mensaje).toBe(
      "Hola, quiero cotizar este pedido:\n• PK 65 — 1 L × 10",
    );
  });

  it("lo que pasa al URL va codificado, también con tildes y emojis", () => {
    const destino = { tipo: "general", digitos: "51987524473" } as const;
    const url = urlWhatsapp(destino, "Ñandú 🌱 & más\n• A");
    expect(url.startsWith("https://wa.me/51987524473?text=")).toBe(true);
    const texto = new URL(url).searchParams.get("text");
    expect(texto).toBe("Ñandú 🌱 & más\n• A");
    expect(url).not.toMatch(/\s/);
  });

  it("peor caso (20 filas, nombre largo, cantidad 9999) queda bajo 2500 caracteres de URL", () => {
    const items = Array.from({ length: LIMITE_FILAS }, () => ({
      nombre: "LIGNOFOL PLUS EXTRA LARGO",
      presentacion: "A consultar con el asesor",
      cantidad: CANTIDAD_MAXIMA,
    }));
    const url = urlWhatsapp(
      { tipo: "general", digitos: "51987524473" },
      construirMensaje({ items }),
    );
    // Medido: 2276. Si el formato del mensaje crece, este tope avisa antes de que rompa en un celular.
    expect(url.length).toBeLessThan(2500);
  });
});

describe("esquemas de envío", () => {
  const filas = [koala];

  it("sin datos: acepta solo productos y campos opcionales vacíos", () => {
    const r = esquemaEnvioSinDatos.safeParse({
      filas,
      zona: "",
      ciudad: " Piura ",
      cultivo: "",
      hectareas: "12,5",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.zona).toBeUndefined();
      expect(r.data.ciudad).toBe("Piura");
      expect(r.data.hectareas).toBe(12.5);
    }
  });

  it("rechaza pedido vacío, hectáreas inválidas y más de 20 filas", () => {
    expect(esquemaEnvioSinDatos.safeParse({ filas: [] }).success).toBe(false);
    expect(
      esquemaEnvioSinDatos.safeParse({ filas, hectareas: "abc" }).success,
    ).toBe(false);
    expect(
      esquemaEnvioSinDatos.safeParse({ filas, hectareas: "0" }).success,
    ).toBe(false);
    const muchas = Array.from({ length: LIMITE_FILAS + 1 }, (_, i) => ({
      slug: `p-${i}`,
      presentacion: "1 L",
      cantidad: 1,
    }));
    expect(esquemaEnvioSinDatos.safeParse({ filas: muchas }).success).toBe(false);
  });

  it("con datos: exige nombre, teléfono y aceptación de la política", () => {
    const base = { filas, nombre: "Rosa", telefono: "987524473" };
    expect(
      esquemaEnvioConDatos.safeParse({ ...base, aceptoPolitica: true }).success,
    ).toBe(true);
    expect(
      esquemaEnvioConDatos.safeParse({ ...base, aceptoPolitica: false }).success,
    ).toBe(false);
    expect(
      esquemaEnvioConDatos.safeParse({ ...base, nombre: "R", aceptoPolitica: true })
        .success,
    ).toBe(false);
    expect(
      esquemaEnvioConDatos.safeParse({ filas, aceptoPolitica: true }).success,
    ).toBe(false);
  });
});
