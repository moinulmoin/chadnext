import { type User } from "lucia";
import { getScopedI18n } from "~/locales/server";
import { validateRequest } from "~/server/auth";
import Navbar from "./navbar";

export default async function Header() {
  const { user } = await validateRequest();
  const scopedT = await getScopedI18n("header");
  const headerText = {
    changelog: scopedT("changelog"),
    about: scopedT("about"),
    login: scopedT("login"),
  };
  return (
    <header className="h-20 w-full">
      <div className="container h-full">
        <Navbar headerText={headerText} user={user as User} />
      </div>
    </header>
  );
}
