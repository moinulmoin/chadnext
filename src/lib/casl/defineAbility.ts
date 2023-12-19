import { defineAbility } from "@casl/ability";

export default defineAbility((can, cannot) => {
  can("manage", "all");
  cannot("delete", "User");
});
