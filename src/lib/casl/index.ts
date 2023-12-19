import { AbilityBuilder, type PureAbility } from "@casl/ability";
import {
  createPrismaAbility,
  type PrismaQuery,
  type Subjects,
} from "@casl/prisma";
import { type Project, type User } from "prisma/generated/client";

// const actions = ["manage", "read", "create", "update", "delete"] as const;
// const subjects = ["User", "Project", "all"] as const;
type AppSubjects =
  | "all"
  | Subjects<{
      User: User;
      Project: Project;
    }>;
type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

type DefinePermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void;
type Roles = "member" | "admin";

const rolePermissions: Record<Roles, DefinePermissions> = {
  member(user, { can }) {
    can("read", "Project", { userId: user.id });
    can("update", "User", { id: user.id });
    can("update", "Project", { userId: user.id });
    can("create", "Project");
  },
  admin(user, { can }) {
    can("manage", "all");
  },
};

export function defineAbilityFor(user: User): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);

  if (typeof rolePermissions[user.role] === "function") {
    rolePermissions[user.role](user, builder);
  } else {
    throw new Error(`Trying to use unknown role "${user.role}"`);
  }

  return builder.build();
}
