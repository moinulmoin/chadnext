import { type User } from "lucia";
import { validateRequest } from "~/lib/auth";
import Navbar from "./navbar";

export default async function Header() {
  const { user } = await validateRequest();
  return (
    <header className="h-20 w-full">
      <div className="container h-full">
        <Navbar loggedInUser={user as User} />
      </div>
    </header>
  );
}
