import { lucia } from "~/lib/auth";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
  interface DatabaseUserAttributes {
    name: string;
    email: string;
    picture: string;
    github_id: number;
  }
}
