import { getUser } from "~/server/user";
import { type CurrentUser } from "~/types";
import Navbar from "./navbar";

export default async function Header() {
  const currentUser = (await getUser()) as CurrentUser;
  return (
    <header className="h-20 w-full bg-transparent">
      <div className="container h-full">
        <Navbar loggedInUser={currentUser} />
      </div>
    </header>
  );
}
