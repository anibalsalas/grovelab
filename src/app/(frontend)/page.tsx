import type { Metadata } from "next";
import Link from "next/link";

import { TransicionPagina } from "@/components/animacion/transicion-pagina";
import { EncabezadoSeccion } from "@/components/encabezado-seccion";
import { CintaSeccion } from "@/components/layout/cinta-seccion";
import { FormularioBuscador } from "@/components/formulario-buscador";
import { FranjaRespaldo } from "@/components/franja-respaldo";
import { TarjetaVideo } from "@/components/tarjeta-video";
import { UltimasNoticias } from "@/components/ultimas-noticias";
import { BotonEnlace } from "@/components/ui/boton-enlace";
import { TarjetaProducto } from "@/components/ui/tarjeta-producto";
import { TarjetaCultivo } from "@/components/ui/tarjeta-cultivo";
import {
  anchoContenedor,
  clasePanelFormulario,
  clasesMainPortada,
  idContenidoPrincipal,
} from "@/lib/clases-sitio";
import {
  certificacionesPublicadas,
  obtenerTextosSitio,
  serviciosPublicados,
} from "@/lib/obtener-textos-sitio.ts";
import { parsearUrlVideoIncrustado } from "@/lib/video-incrustado.ts";
import { hayCultivosPublicados } from "@/lib/hay-cultivos-publicados.ts";
import { hayZonasPublicadas } from "@/lib/hay-zonas-publicadas.ts";
import { medioPopulado, primeraImagen } from "@/lib/medio-populado.ts";
import { getPayloadClient } from "@/lib/payload-client";
import sitio from "@/styles/sitio.module.css";

import styles from "./portada.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Grovelab — Productos para el agro" },
  description:
    "Formulaciones para el sector agrícola. Catálogo por cultivo y asesoría técnica.",
};

const pasosHistoria = [
  {
    numero: "01",
    titulo: "Suelo y raíz",
    texto:
      "Nutrición y acondicionamiento del suelo para un arranque sano.",
  },
  {
    numero: "02",
    titulo: "Crecimiento",
    texto: "Protección y bioestimulación en cada etapa del cultivo.",
  },
  {
    numero: "03",
    titulo: "Cosecha",
    texto: "Resultados con respaldo técnico y formulaciones específicas.",
  },
] as const;

export default async function HomePage() {
  const payload = await getPayloadClient();

  const [
    textos,
    cultivos,
    plagas,
    categorias,
    cultivosDestacados,
    productosDestacados,
    ultimasNoticias,
    hayCultivos,
  ] = await Promise.all([
    obtenerTextosSitio(),
    payload.find({
      collection: "cultivos",
      limit: 200,
      sort: "nombre",
      depth: 0,
    }),
    payload.find({ collection: "plagas", limit: 200, sort: "nombre", depth: 0 }),
    payload.find({
      collection: "categorias",
      limit: 200,
      sort: "orden",
      depth: 0,
    }),
    payload.find({
      collection: "cultivos",
      limit: 6,
      where: { destacado: { equals: true } },
      sort: "nombre",
      depth: 1,
    }),
    payload.find({
      collection: "productos",
      limit: 6,
      where: { destacado: { equals: true } },
      sort: "nombre",
      depth: 1,
    }),
    payload.find({
      collection: "noticias",
      limit: 3,
      sort: "-fecha",
      depth: 0,
    }),
    hayCultivosPublicados(),
  ]);
  const hayZonas = await hayZonasPublicadas();

  const titular =
    textos.titularPortada?.trim() ||
    "Titular de portada: POR CONFIRMAR con Grovelab";
  const subtitulo =
    textos.subtituloPortada?.trim() ||
    "Subtítulo: POR CONFIRMAR con Grovelab.";

  const certificaciones = certificacionesPublicadas(textos);
  const servicios = serviciosPublicados(textos);
  const urlTestimonio = textos.testimonio?.urlVideo?.trim();
  const videoTestimonio =
    urlTestimonio && parsearUrlVideoIncrustado(urlTestimonio)
      ? urlTestimonio
      : null;

  const opcionesCultivos = cultivos.docs.map((c) => ({
    slug: c.slug,
    nombre: c.nombre,
  }));
  const opcionesPlagas = plagas.docs.map((p) => ({
    slug: p.slug,
    nombre: p.nombre,
  }));
  const opcionesCategorias = categorias.docs.map((c) => ({
    slug: c.slug,
    nombre: c.nombre,
  }));

  const noticiasPortada = ultimasNoticias.docs.map((noticia) => ({
    slug: noticia.slug,
    titulo: noticia.titulo,
    fecha: noticia.fecha,
    resumen: noticia.resumen,
  }));

  const hayDestacados =
    cultivosDestacados.docs.length > 0 || productosDestacados.docs.length > 0;

  return (
    <TransicionPagina>
      <main id={idContenidoPrincipal} className={clasesMainPortada}>
        <CintaSeccion tono="neutra" contenedor={false}>
          <section className={styles.hero} aria-labelledby="portada-titular">
            <div className={styles.capaCampo} aria-hidden="true" />
            <div className={styles.capaHoja} aria-hidden="true" />
            <div className={`${anchoContenedor} ${styles.heroGrid}`}>
              <div className={styles.contenidoHero}>
                <p className={styles.etiquetaMarca}>Grovelab</p>
                <h1
                  id="portada-titular"
                  className="mt-2 font-titular text-h1 font-bold leading-[var(--token-interlineado-h1)] tracking-tight text-marca"
                >
                  {titular}
                </h1>
                <p className="mt-4 max-w-prose font-texto text-lg font-normal leading-relaxed text-texto/90">
                  {subtitulo}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {hayCultivos ? (
                    <BotonEnlace href="/cultivos" variante="primario">
                      Ver cultivos
                    </BotonEnlace>
                  ) : (
                    <BotonEnlace href="/productos" variante="primario">
                      Ver productos
                    </BotonEnlace>
                  )}
                  <BotonEnlace href="/contacto" variante="secundario">
                    Contactar
                  </BotonEnlace>
                </div>
              </div>
              <div className={styles.decoracionHero} aria-hidden="true">
                <div className={styles.manchaHero} />
              </div>
            </div>
          </section>
        </CintaSeccion>

        <CintaSeccion tono="verde" borde="surco">
          <section className={sitio.seccionEnCinta} aria-labelledby="historia-titulo">
            <EncabezadoSeccion
              id="historia-titulo"
              destacado="Nuestra historia"
              titulo="Del suelo a la cosecha"
              descripcion="Formulaciones pensadas para cada etapa del cultivo, con asesoría técnica de campo."
            />
            <div className={`mt-8 ${styles.pasos}`}>
              {pasosHistoria.map((paso) => (
                <article key={paso.numero} className={styles.paso}>
                  <span className={styles.pasoNumero} aria-hidden="true">
                    {paso.numero}
                  </span>
                  <h3 className="font-titular text-lg text-marca">{paso.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{paso.texto}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {hayCultivos ? (
                <BotonEnlace href="/cultivos" variante="secundario">
                  Explorar cultivos
                </BotonEnlace>
              ) : (
                <BotonEnlace href="/productos" variante="secundario">
                  Explorar productos
                </BotonEnlace>
              )}
            </div>
          </section>
        </CintaSeccion>

        <CintaSeccion tono="crema" borde="surco">
          <section
            className={sitio.seccionEnCinta}
            aria-labelledby="buscador-titulo"
          >
            <div className={`${clasePanelFormulario} w-full max-w-3xl mx-auto`}>
              <FormularioBuscador
                cultivos={opcionesCultivos}
                plagas={opcionesPlagas}
                categorias={opcionesCategorias}
                mostrarEnlaceCultivos={hayCultivos}
              />
            </div>
          </section>
        </CintaSeccion>

        {!hayDestacados ? (
          <CintaSeccion tono="neutra" borde="surco">
            <section
              className={sitio.seccionEnCinta}
              aria-labelledby="acceso-catalogo"
            >
              <div className={sitio.bloqueAccesoCatalogo}>
                <div className="max-w-prose">
                  <p className="text-sm font-medium tracking-wide text-acento uppercase">
                    Catálogo
                  </p>
                  <h2
                    id="acceso-catalogo"
                    className="mt-1 font-titular text-2xl text-marca sm:text-3xl"
                  >
                    Encuentra la formulación para tu cultivo
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-texto/85">
                    Explora productos por categoría o navega cultivos con
                    recomendaciones técnicas.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <BotonEnlace href="/productos" variante="primario">
                    Ver productos
                  </BotonEnlace>
                  {hayCultivos ? (
                    <BotonEnlace href="/cultivos" variante="secundario">
                      Ver cultivos
                    </BotonEnlace>
                  ) : null}
                </div>
              </div>
            </section>
          </CintaSeccion>
        ) : null}

        {cultivosDestacados.docs.length > 0 ? (
          <CintaSeccion tono="verde" borde="surco">
            <section
              className={sitio.seccionEnCinta}
              aria-labelledby="cultivos-destacados"
            >
              <EncabezadoSeccion
                id="cultivos-destacados"
                titulo="Cultivos destacados"
                descripcion="Encuentra productos formulados para tu cultivo."
              />
              <ul className={`mt-8 ${styles.tarjetas}`}>
                {cultivosDestacados.docs.map((cultivo) => {
                  const medio = medioPopulado(cultivo.imagen);
                  return (
                    <li key={cultivo.id}>
                      <TarjetaCultivo
                        slug={cultivo.slug}
                        nombre={cultivo.nombre}
                        resumen={cultivo.resumen}
                        imagen={
                          medio
                            ? {
                                url: medio.url ?? "",
                                alt: medio.alt,
                                width: medio.width,
                                height: medio.height,
                              }
                            : null
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            </section>
          </CintaSeccion>
        ) : null}

        {productosDestacados.docs.length > 0 ? (
          <CintaSeccion tono="crema" borde="surco">
            <section
              className={sitio.seccionEnCinta}
              aria-labelledby="productos-destacados"
            >
              <EncabezadoSeccion
                id="productos-destacados"
                titulo="Productos destacados"
              />
              <ul className={`mt-8 ${styles.tarjetas}`}>
                {productosDestacados.docs.map((producto) => {
                  const medio = primeraImagen(producto.galeria);
                  return (
                    <li key={producto.id}>
                      <TarjetaProducto
                        slug={producto.slug}
                        nombre={producto.nombre}
                        resumen={producto.resumen}
                        imagen={
                          medio
                            ? {
                                url: medio.url ?? "",
                                alt: medio.alt,
                                width: medio.width,
                                height: medio.height,
                              }
                            : null
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            </section>
          </CintaSeccion>
        ) : null}

        {certificaciones.length > 0 ? (
          <CintaSeccion tono="neutra" borde="surco">
            <section className={sitio.seccionEnCinta}>
              <FranjaRespaldo items={certificaciones} />
            </section>
          </CintaSeccion>
        ) : null}

        {servicios.length > 0 ? (
          <CintaSeccion tono="verde" borde="surco">
            <section
              className={sitio.seccionEnCinta}
              aria-labelledby="servicios-portada"
            >
              <EncabezadoSeccion
                id="servicios-portada"
                titulo="Servicios"
                descripcion="Importación, asesoría y registro para llevar la formulación a tu campo."
              />
              <ul className={`mt-8 ${styles.tarjetas}`}>
                {servicios.map((servicio) => (
                  <li key={servicio.titulo} className={sitio.tarjetaPlana}>
                    <h3 className="font-titular text-lg text-marca">
                      {servicio.titulo}
                    </h3>
                    {servicio.descripcion ? (
                      <p className="mt-2 text-sm leading-relaxed">
                        {servicio.descripcion}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                <Link
                  href="/servicios"
                  className="font-medium text-marca underline-offset-4 hover:underline"
                >
                  Ver todos los servicios
                </Link>
              </p>
            </section>
          </CintaSeccion>
        ) : null}

        {videoTestimonio ? (
          <CintaSeccion tono="crema" borde="surco">
            <section className={sitio.seccionEnCinta}>
              <TarjetaVideo
                urlVideo={videoTestimonio}
                titulo={textos.testimonio?.titulo}
              />
            </section>
          </CintaSeccion>
        ) : null}

        {noticiasPortada.length > 0 ? (
          <CintaSeccion tono="neutra" borde="surco">
            <section className={sitio.seccionEnCinta}>
              <UltimasNoticias noticias={noticiasPortada} />
            </section>
          </CintaSeccion>
        ) : null}

        <CintaSeccion tono="marca">
          <section className={sitio.ctaPortada}>
            <h2 className="font-titular text-h2 font-semibold leading-[var(--token-interlineado-h2)] tracking-tight">¿Necesitas asesoría?</h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-fondo/95">
              Cuéntanos tu cultivo y te orientamos con el producto adecuado.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <BotonEnlace href="/contacto" variante="sobreMarca">
                Ir a contacto
              </BotonEnlace>
              {hayZonas ? (
                <BotonEnlace href="/zonas-comerciales" variante="sobreMarca">
                  Ver asesores por zona
                </BotonEnlace>
              ) : null}
            </div>
          </section>
        </CintaSeccion>
      </main>
    </TransicionPagina>
  );
}
