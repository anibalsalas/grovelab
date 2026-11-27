import type { Access, FieldAccess } from "payload";

import type { User } from "../payload-types.ts";

type Rol = User["role"];

/** Rol del usuario autenticado; `undefined` si no hay sesión o no trae rol. */
export function rolDe(usuario: unknown): Rol | undefined {
  if (usuario && typeof usuario === "object" && "role" in usuario) {
    return (usuario as User).role;
  }
  return undefined;
}

function esAdministradorOEditor(usuario: unknown): boolean {
  const rol = rolDe(usuario);
  return rol === "administrador" || rol === "editor";
}

/** Lectura en la web: solo publicados. En el panel, administrador y editor ven también borradores. */
export const lecturaPublicaOEditor: Access = ({ req }) => {
  if (esAdministradorOEditor(req.user)) {
    return true;
  }
  return {
    _status: {
      equals: "published",
    },
  };
};

/** Escribe el contenido del catálogo y del sitio: administrador y editor. El rol `ventas` no. */
export const escrituraPanel: Access = ({ req }) =>
  esAdministradorOEditor(req.user);

/** Pedidos contienen datos personales: administrador y ventas. El editor no los ve. */
export const accesoPedidos: Access = ({ req }) => {
  const rol = rolDe(req.user);
  return rol === "administrador" || rol === "ventas";
};

export const soloAdministrador: Access = ({ req }) =>
  rolDe(req.user) === "administrador";

/** Para campos que nadie edita desde el panel (se llenan al crear el registro). */
export const nadieEditaCampo: FieldAccess = () => false;

/** Oculta una colección del menú del panel al rol `ventas` (el acceso real lo da `access`). */
export const ocultoParaVentas = ({ user }: { user?: unknown }): boolean =>
  rolDe(user) === "ventas";
