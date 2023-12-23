import { AbilityBuilder, type PureAbility } from "@casl/ability";
import {
  createPrismaAbility,
  type PrismaQuery,
  type Subjects,
} from "@casl/prisma";
import { type Project, type Role, type User } from "@prisma/client";
import { type User as AuthUser } from "lucia";

type AppSubjects =
  | "all"
  | Subjects<{
      User: User;
      Project: Project;
    }>;
type AppAction = "manage" | "create" | "read" | "update" | "delete";
type AppAbility = PureAbility<[AppAction, AppSubjects], PrismaQuery>;

type DefinePermissions = (
  user: AuthUser,
  builder: AbilityBuilder<AppAbility>
) => void;

const rolePermissions: Record<Role, DefinePermissions> = {
  member(user, { can, cannot }) {
    can("read", "Project", { userId: user.userId });
    can("update", "User", { id: user.userId });
    can("create", "Project");
    can("update", "Project", { userId: user.userId });
    cannot("delete", "Project", { userId: { not: user.userId } });
    cannot("delete", "User", { id: { not: user.userId } });
  },
  admin(user, { can, cannot }) {
    can("manage", "all");
    cannot("delete", "User", { id: { not: user.userId } });
  },
};

export function defineAbilityFor(user: AuthUser): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);

  if (typeof rolePermissions[user.role] === "function") {
    rolePermissions[user.role](user, builder);
  } else {
    throw new Error(`Trying to use unknown role "${user.role}"`);
  }

  return builder.build();
}
