import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Navbar from "./navbar";

async function Header() {
	const session = await getServerSession(authOptions);
	return <Navbar session={session} />;
}

export default Header;
