import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import Navbar from "./navbar";

async function Header() {
  const session = await getServerSession(authOptions);
  return <Navbar session={session} />;
}

export default Header;
