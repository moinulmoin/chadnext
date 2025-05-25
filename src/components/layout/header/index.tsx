import { getCurrentSession } from "~/lib/server/auth";
import { getScopedI18n } from "~/locales/server";
import Navbar from "./navbar";

export default async function Header() {
  const result = await getCurrentSession();
  const session = result?.session;
  const scopedT = await getScopedI18n("header");
  const headerText = {
    changelog: scopedT("changelog"),
    about: scopedT("about"),
    login: scopedT("login"),
    dashboard: scopedT("dashboard"),
  };

  return (
    <header className="h-20 w-full">
      <div className="container h-full">
        <Navbar headerText={headerText} isUserLoggedIn={!!session} />
      </div>
    </header>
  );
}
