import type { Access } from "payload";

/** Lectura en la web: solo publicados. En el panel, cualquier usuario autenticado. */
export const lecturaPublicaOEditor: Access = ({ req }) => {
  if (req.user) {
    return true;
  }
  return {
    _status: {
      equals: "published",
    },
  };
};

export const escrituraPanel: Access = ({ req }) => Boolean(req.user);
