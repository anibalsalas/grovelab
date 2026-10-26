import type { Access, CollectionConfig } from "payload";

import type { User } from "../payload-types.ts";

export type UserPanelRole = "administrador" | "editor";

function isAdministrador(user: User | null | undefined): boolean {
  return user?.role === "administrador";
}

function userFromAuth(
  user: User | Record<string, unknown> | null | undefined,
): User | null | undefined {
  if (!user || typeof user !== "object") {
    return undefined;
  }
  if ("role" in user) {
    return user as User;
  }
  return undefined;
}

const usersCollectionAccess: {
  create: Access;
  delete: Access;
  read: Access;
  update: Access;
} = {
  create: ({ req }) => isAdministrador(userFromAuth(req.user)),
  delete: ({ req }) => isAdministrador(userFromAuth(req.user)),
  read: ({ req }) => {
    const user = userFromAuth(req.user);
    if (!user) {
      return false;
    }
    if (isAdministrador(user)) {
      return true;
    }
    return {
      id: {
        equals: user.id,
      },
    };
  },
  update: ({ req, id }) => {
    const user = userFromAuth(req.user);
    if (!user) {
      return false;
    }
    if (isAdministrador(user)) {
      return true;
    }
    return user.id === id;
  },
};

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Usuario",
    plural: "Usuarios",
  },
  admin: {
    useAsTitle: "email",
    hidden: ({ user }) => !isAdministrador(userFromAuth(user)),
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 600_000,
  },
  access: usersCollectionAccess,
  fields: [
    {
      name: "role",
      type: "select",
      label: "Rol",
      required: true,
      defaultValue: "editor",
      options: [
        {
          label: "Administrador",
          value: "administrador",
        },
        {
          label: "Editor",
          value: "editor",
        },
      ],
      access: {
        create: ({ req }) => isAdministrador(userFromAuth(req.user)),
        update: ({ req }) => isAdministrador(userFromAuth(req.user)),
      },
    },
  ],
};
