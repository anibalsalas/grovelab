export type VideoIncrustado = {
  proveedor: "youtube" | "vimeo";
  idVideo: string;
};

const PATRON_YOUTUBE =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&].*)?$/;

const PATRON_VIMEO =
  /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)(?:\?.*)?$/;

export function parsearUrlVideoIncrustado(url: string): VideoIncrustado | null {
  const limpio = url.trim();
  if (!limpio) {
    return null;
  }

  const youtube = PATRON_YOUTUBE.exec(limpio);
  if (youtube?.[1]) {
    return { proveedor: "youtube", idVideo: youtube[1] };
  }

  const vimeo = PATRON_VIMEO.exec(limpio);
  if (vimeo?.[1]) {
    return { proveedor: "vimeo", idVideo: vimeo[1] };
  }

  return null;
}

export function urlEmbedVideo(video: VideoIncrustado): string {
  if (video.proveedor === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${video.idVideo}`;
  }
  return `https://player.vimeo.com/video/${video.idVideo}`;
}
