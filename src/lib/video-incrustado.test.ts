import { describe, expect, it } from "vitest";

import { parsearUrlVideoIncrustado } from "./video-incrustado.ts";

describe("parsearUrlVideoIncrustado", () => {
  it("acepta YouTube watch y youtu.be", () => {
    expect(
      parsearUrlVideoIncrustado("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    )?.toEqual({ proveedor: "youtube", idVideo: "dQw4w9WgXcQ" });
    expect(parsearUrlVideoIncrustado("https://youtu.be/dQw4w9WgXcQ")?.proveedor).toBe(
      "youtube",
    );
  });

  it("acepta Vimeo", () => {
    expect(parsearUrlVideoIncrustado("https://vimeo.com/123456789"))?.toEqual({
      proveedor: "vimeo",
      idVideo: "123456789",
    });
  });

  it("rechaza URLs arbitrarias", () => {
    expect(parsearUrlVideoIncrustado("https://evil.example/embed")).toBeNull();
    expect(parsearUrlVideoIncrustado("")).toBeNull();
  });
});
