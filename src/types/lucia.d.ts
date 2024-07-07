import { lucia } from "~/lib/lucia";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
  interface DatabaseUserAttributes {
    name: string;
    email: string;
    picture: string;
  }
}
