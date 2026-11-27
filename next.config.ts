import withPayload from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Solo entra en juego cuando BLOB_READ_WRITE_TOKEN está activo (ver payload.config.ts);
    // en disco local las imágenes sirven desde /api/medios/file/... (misma URL, sin esto).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  turbopack: {
    rules: {
      // Solo globals.css por Tailwind; *.module.css y demás CSS usan el pipeline por defecto.
      "**/globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withPayload(nextConfig);
