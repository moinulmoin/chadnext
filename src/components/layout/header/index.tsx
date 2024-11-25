import { getCurrentSession } from "~/lib/server/auth/session";
import { getScopedI18n } from "~/locales/server";
import Navbar from "./navbar";

export default async function Header() {
  const { session } = await getCurrentSession();
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
        <Navbar headerText={headerText} session={session!} />
      </div>
    </header>
  );
}
