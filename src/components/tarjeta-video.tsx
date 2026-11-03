"use client";

import { useState } from "react";

import {
  parsearUrlVideoIncrustado,
  urlEmbedVideo,
} from "@/lib/video-incrustado.ts";
import institucional from "@/styles/institucional.module.css";

type TarjetaVideoProps = {
  urlVideo: string;
  titulo?: string | null;
};

export function TarjetaVideo({ urlVideo, titulo }: TarjetaVideoProps) {
  const video = parsearUrlVideoIncrustado(urlVideo);
  const [reproducir, setReproducir] = useState(false);

  if (!video) {
    return null;
  }

  const tituloSeccion = titulo?.trim() || "Testimonio en video";
  const src = urlEmbedVideo(video);

  return (
    <section aria-labelledby="video-testimonio-titulo">
      <h2
        id="video-testimonio-titulo"
        className="font-titular text-2xl text-marca sm:text-3xl"
      >
        {tituloSeccion}
      </h2>
      <div className={`mt-6 ${institucional.videoContenedor}`}>
        {reproducir ? (
          <iframe
            className={institucional.videoIframe}
            src={`${src}?autoplay=1`}
            title={tituloSeccion}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className={institucional.videoPoster}
            onClick={() => setReproducir(true)}
          >
            Reproducir video
          </button>
        )}
      </div>
    </section>
  );
}
