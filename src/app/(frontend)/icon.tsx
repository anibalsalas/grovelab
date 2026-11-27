import { readFileSync } from "node:fs";
import path from "node:path";

import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Reemplaza el favicon por defecto de Next por el logo real (src/images/grovelab-logo.png, 363×129). */
export default function Icon() {
  const logoBase64 = readFileSync(
    path.join(process.cwd(), "src/images/grovelab-logo.png"),
  ).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f5f0",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${logoBase64}`}
          alt=""
          width={28}
          height={10}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size },
  );
}
