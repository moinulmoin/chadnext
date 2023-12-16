import { type User } from "lucia";
import { getPageSession } from "~/lib/auth";
import Navbar from "./navbar";

export default async function Header() {
  const session = await getPageSession();
  return (
    <header className="h-20 w-full">
      <div className="container h-full">
        <Navbar loggedInUser={session?.user as User} />
      </div>
    </header>
  );
}
